/**
 * SkillCard Component
 * Card layout for marketplace skills with provider avatar
 */
import React from 'react'
import { UserCircle2 } from 'lucide-react'

const SkillCard = ({ name, category, description, userId, level, tags = [], onConnect }) => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 duration-200">
      {/* Provider Avatar Section */}
      {userId && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-slate-200">
          {userId.profileImage ? (
            <img
              src={userId.profileImage}
              alt={userId.name}
              className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover"
            />
          ) : (
            <span className="w-14 h-14 rounded-full border-2 border-blue-400 bg-blue-50 text-blue-700 inline-flex items-center justify-center" aria-hidden="true">
              <UserCircle2 size={28} />
            </span>
          )}
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{userId.name}</p>
            <p className="text-xs text-slate-600">Mentor</p>
            {userId.rating && (
              <p className="text-xs text-yellow-600 font-semibold">{userId.rating}/5.0</p>
            )}
          </div>
        </div>
      )}

      {/* Skill Details */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900 flex-1">{name}</h3>
        <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full ml-2">{level}</span>
      </div>
      
      <p className="text-sm text-slate-700 font-semibold mb-3">{description}</p>
      
      <div className="space-y-2 mb-4 text-sm">
        <p className="text-slate-700"><strong>📁 Category:</strong> {category}</p>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <button
        onClick={onConnect}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 text-sm font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 border border-blue-800"
      >
        🔗 Connect
      </button>
    </div>
  )
}

export default SkillCard
