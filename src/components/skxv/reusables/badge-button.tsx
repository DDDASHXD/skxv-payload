import React from 'react'

interface BadgeButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  badge: React.ReactNode
}

const BadgeButton = ({ children, badge, ...props }: BadgeButtonProps) => {
  return (
    <div
      className="bg-muted hover:bg-accent flex w-max cursor-pointer gap-1 p-1 text-sm select-none"
      {...props}
    >
      <div className="cursor-pointer select-none">{badge}</div>
      <div className="bg-muted-foreground/30 cursor-pointer px-1 select-none">{children}</div>
    </div>
  )
}

export default BadgeButton
