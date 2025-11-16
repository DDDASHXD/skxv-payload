import { cn } from '@/utilities/cn'
import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  titlePosition?: 'left' | 'center' | 'right'
  className?: string
  children: React.ReactNode
}

const Card = ({ title, titlePosition = 'left', className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn('bg-background border-foreground relative mt-4 border-2 p-6', className)}
      {...props}
    >
      <div
        className={cn(
          'bg-background absolute top-0 -translate-y-1/2 px-2',
          titlePosition === 'left'
            ? 'left-4'
            : titlePosition === 'center'
              ? 'left-1/2 -translate-x-1/2'
              : 'right-4',
        )}
      >
        {title}
      </div>
      <div className="">{children}</div>
    </div>
  )
}

export default Card
