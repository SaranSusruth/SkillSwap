const Request = require('../models/Request');
const Message = require('../models/Message');

const getEntityId = (value) => value?._id || value?.id || value;

const canAccessRequest = (request, userId) => {
    if (!request) {
        return false;
    }

    return String(getEntityId(request.senderId)) === String(userId) || String(getEntityId(request.receiverId)) === String(userId);
};

exports.getMessagesForRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId)
            .populate('senderId', 'name email profileImage')
            .populate('receiverId', 'name email profileImage')
            .populate('skillOfferedId', 'name category level')
            .populate('skillRequestedId', 'name category level');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (!canAccessRequest(request, req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to view this conversation' });
        }

        if (request.status !== 'accepted') {
            return res.status(400).json({ error: 'Chat is only available after the request is accepted' });
        }

        const messages = await Message.find({ requestId: request._id })
            .populate('senderId', 'name email profileImage')
            .populate('receiverId', 'name email profileImage')
            .sort({ createdAt: 1 });

        res.status(200).json({ request, messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { content } = req.body || {};
        const trimmedContent = String(content || '').trim();

        if (!trimmedContent) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const request = await Request.findById(req.params.requestId)
            .populate('senderId', 'name email profileImage')
            .populate('receiverId', 'name email profileImage');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (!canAccessRequest(request, req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to send messages in this conversation' });
        }

        if (request.status !== 'accepted') {
            return res.status(400).json({ error: 'Chat is only available after the request is accepted' });
        }

        const senderId = getEntityId(request.senderId);
        const receiverId = String(senderId) === String(req.user.id)
            ? getEntityId(request.receiverId)
            : senderId;

        const message = await Message.create({
            requestId: request._id,
            senderId: req.user.id,
            receiverId,
            content: trimmedContent,
        });

        await message.populate([
            { path: 'senderId', select: 'name email profileImage' },
            { path: 'receiverId', select: 'name email profileImage' },
        ]);

        res.status(201).json({
            message: 'Message sent successfully',
            chatMessage: message,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};