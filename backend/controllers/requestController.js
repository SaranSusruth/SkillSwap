const Request = require('../models/Request');
const User = require('../models/User');
const Skill = require('../models/Skill');
const {
    sendRequestSentConfirmationEmail,
    sendRequestReceivedEmail,
    sendPendingRequestReminderEmail,
    sendRequestAcceptedEmail,
} = require('../utils/mailer');

// Create Request
exports.createRequest = async (req, res) => {
    try {
        const { receiverId, skillOfferedId, skillRequestedId, message } = req.body;
        const sender = await User.findById(req.user.id).select('name email');

        // Validate that receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

        // Validate requested skill and optionally offered skill when provided.
        const skillRequested = await Skill.findById(skillRequestedId);
        const skillOffered = skillOfferedId ? await Skill.findById(skillOfferedId) : null;

        if (!skillRequested) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        if (skillOfferedId && !skillOffered) {
            return res.status(404).json({ error: 'Offered skill not found' });
        }

        // Allow separate requests per requested skill; block only duplicate active requests for same skill.
        const existingRequest = await Request.findOne({
            senderId: req.user.id,
            receiverId,
            skillRequestedId,
            status: { $in: ['pending', 'accepted'] },
        });

        if (existingRequest) {
            return res.status(400).json({
                error: existingRequest.status === 'accepted'
                    ? 'This skill request is already accepted for this user'
                    : 'You already have a pending request for this skill with this user',
            });
        }

        const request = new Request({
            senderId: req.user.id,
            receiverId,
            skillOfferedId: skillOffered ? skillOffered._id : null,
            skillRequestedId,
            message,
        });

        await request.save();

        const pendingCount = await Request.countDocuments({
            receiverId,
            status: 'pending',
        });

        void sendRequestReceivedEmail({
            to: receiver.email,
            senderName: sender?.name || 'A user',
            skillOffered: skillOffered?.name || 'No skill listed yet',
            skillRequested: skillRequested.name,
            message,
        }).catch((mailError) => console.error('Failed to send request email:', mailError.message));

        void sendRequestSentConfirmationEmail({
            to: sender?.email,
            receiverName: receiver.name,
            skillOffered: skillOffered?.name || 'No skill listed yet',
            skillRequested: skillRequested.name,
        }).catch((mailError) => console.error('Failed to send request confirmation email:', mailError.message));

        if (pendingCount === 4 || pendingCount === 5) {
            void sendPendingRequestReminderEmail({
                to: receiver.email,
                pendingCount,
            }).catch((mailError) => console.error('Failed to send pending reminder email:', mailError.message));
        }

        // Populate the request with user and skill data
        await request.populate([
            { path: 'senderId', select: 'name email profileImage' },
            { path: 'receiverId', select: 'name email profileImage' },
            { path: 'skillOfferedId', select: 'name category level' },
            { path: 'skillRequestedId', select: 'name category level' }
        ]);

        res.status(201).json({
            message: 'Request sent successfully',
            request,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Sent Requests
exports.getSentRequests = async (req, res) => {
    try {
        const requests = await Request.find({ senderId: req.user.id })
            .populate('receiverId', 'name email profileImage')
            .populate('skillOfferedId', 'name category level')
            .populate('skillRequestedId', 'name category level')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Received Requests
exports.getReceivedRequests = async (req, res) => {
    try {
        const requests = await Request.find({ receiverId: req.user.id })
            .populate('senderId', 'name email profileImage')
            .populate('skillOfferedId', 'name category level')
            .populate('skillRequestedId', 'name category level')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Accept Request
exports.acceptRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is the receiver
        if (request.receiverId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to accept this request' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request is not pending' });
        }

        request.status = 'accepted';
        await request.save();

        const senderUser = await User.findById(request.senderId).select('name email');
        const receiverUser = await User.findById(req.user.id).select('name email');

        void sendRequestAcceptedEmail({
            to: senderUser?.email,
            senderName: senderUser?.name || 'there',
            receiverName: receiverUser?.name || 'Your match',
        }).catch((mailError) => console.error('Failed to send acceptance email:', mailError.message));

        // Populate the updated request
        await request.populate([
            { path: 'senderId', select: 'name email profileImage' },
            { path: 'receiverId', select: 'name email profileImage' },
            { path: 'skillOfferedId', select: 'name category level' },
            { path: 'skillRequestedId', select: 'name category level' }
        ]);

        res.status(200).json({
            message: 'Request accepted successfully',
            request,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reject Request
exports.rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is the receiver
        if (request.receiverId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to reject this request' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request is not pending' });
        }

        const { responseMessage } = req.body;
        request.status = 'rejected';
        request.responseMessage = responseMessage || '';
        await request.save();

        res.status(200).json({
            message: 'Request rejected successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Request by ID
exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('senderId', 'name email profileImage')
            .populate('receiverId', 'name email profileImage')
            .populate('skillOfferedId', 'name category level description')
            .populate('skillRequestedId', 'name category level description');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if user is involved in the request
        if (request.senderId._id.toString() !== req.user.id && request.receiverId._id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to view this request' });
        }

        res.status(200).json({ request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};