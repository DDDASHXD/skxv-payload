import { cn } from '@/utilities/cn'
import React from 'react'

interface ActionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const ActionGroup = ({ children, className, ...props }: ActionGroupProps) => {
  return (
    <div className={cn('flex flex-col gap-0', className)} {...props}>
      {children}
    </div>
  )
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

const ActionButton = ({ children, className, icon, ...props }: ActionButtonProps) => {
  return (
    <button
      className={cn(
        'hover:bg-accent/90 flex items-stretch justify-start bg-none p-0 text-left',
        className,
      )}
      {...props}
    >
      <div className="bg-muted/70 flex w-max items-center justify-center px-3 py-0.5">{icon}</div>
      <div className="bg-muted flex flex-1 items-center px-4 py-0.5">{children}</div>
    </button>
  )
}

export { ActionGroup, ActionButton }
