/**
 * SkillCard Component
 * Simple card layout for marketplace skills
 */
import React from 'react'

const SkillCard = ({ name, category, description, offeredBy, competencyLevel, tags = [], onConnect }) => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900 flex-1">{name}</h3>
        <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full ml-2">{competencyLevel}</span>
      </div>
      <p className="text-sm text-slate-700 font-semibold mb-3">{description}</p>
      <div className="space-y-2 mb-4 text-sm">
        <p className="text-slate-700"><strong>📁 Category:</strong> {category}</p>
        <p className="text-slate-700"><strong>👤 By:</strong> {offeredBy?.name || 'Anonymous'}</p>
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
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 text-sm font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
      >
        🔗 Connect with {offeredBy?.name || 'Provider'}
      </button>
    </div>
  )
}

export default SkillCard
