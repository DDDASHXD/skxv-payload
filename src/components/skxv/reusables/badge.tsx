import React from 'react'

interface BadgeProps {
  children: React.ReactNode
}

const Badge = ({ children }: BadgeProps) => {
  return <div className="bg-muted flex flex-shrink-0 p-1 text-xs">{children}</div>
}

export default Badge
