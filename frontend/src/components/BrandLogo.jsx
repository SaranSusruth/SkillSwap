import React from 'react'
import logoImage from '../assets/logo.png'

const BrandLogo = ({ showTagline = false, textSize = 'text-base' }) => {
  const imageSizeClass = textSize === 'text-lg' ? 'h-16' : 'h-10'

  return (
    <div className="inline-flex flex-col items-start" aria-label="Skill Swap brand">
      <img src={logoImage} alt="Skill Swap" className={`${imageSizeClass} w-auto object-contain`} />
      {showTagline && <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Campus learning</span>}
    </div>
  )
}

export default BrandLogo
