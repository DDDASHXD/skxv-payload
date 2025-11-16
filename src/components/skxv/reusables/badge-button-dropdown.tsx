'use client'

import React from 'react'
import BadgeButton from './badge-button'
import { cn } from '@/utilities/cn'

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface BadgeButtonDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  DropdownItems: DropdownItem[]
  badge: React.ReactNode
  onClick?: () => void
  position?: 'top' | 'bottom'
}

const BadgeButtonDropdown = ({
  children,
  DropdownItems,
  badge,
  onClick,
  position = 'bottom',
  ...props
}: BadgeButtonDropdownProps) => {
  const [open, setOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const handleClick = () => {
    console.log('clicked')
    setOpen(!open)
    if (onClick) {
      onClick()
    }
  }

  React.useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div ref={dropdownRef} className="relative z-10 overflow-visible">
      <BadgeButton {...props} badge={badge} onClick={handleClick}>
        {children}
      </BadgeButton>
      {open && (
        <div
          className={cn(
            'bg-muted border-border absolute left-0 z-10 border',
            position === 'top' ? 'bottom-full -translate-y-1' : 'top-full translate-y-1',
          )}
        >
          {DropdownItems.map((item, index) => (
            <div
              key={index}
              className="group flex cursor-pointer items-center"
              onClick={() => {
                if (item.onClick) {
                  item.onClick()
                }
                setOpen(false)
              }}
            >
              <div className="bg-muted hover:bg-accent group-hover:bg-accent cursor-pointer px-2">
                {item.icon ?? '⊹'}
              </div>
              <p className="bg-muted-foreground/30 w-full cursor-pointer px-2">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BadgeButtonDropdown
