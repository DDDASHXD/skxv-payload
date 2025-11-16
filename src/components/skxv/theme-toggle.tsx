'use client'

import React from 'react'
import { useTheme } from '@/providers/Theme'
import { Moon, Sun } from 'lucide-react'
import BadgeButton from './reusables/badge-button'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <BadgeButton badge={<p>Theme</p>}>
        <p>Loading...</p>
      </BadgeButton>
    )
  }

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    console.log('Toggling theme from', theme, 'to', newTheme)
    setTheme(newTheme)
  }

  return (
    <BadgeButton
      onClick={handleToggle}
      badge={
        <div className="flex items-center gap-1">
          {theme === 'dark' ? <Moon className="size-3" /> : <Sun className="size-3" />}
          <p>{theme === 'dark' ? 'Dark' : 'Light'}</p>
        </div>
      }
    >
      <p>Change Theme</p>
    </BadgeButton>
  )
}

export default ThemeToggle

