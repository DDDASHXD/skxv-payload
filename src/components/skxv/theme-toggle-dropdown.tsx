'use client'

import React from 'react'
import { useTheme } from '@/providers/Theme'
import BadgeButtonDropdown from './reusables/badge-button-dropdown'

const ThemeToggleDropdown = ({ position }: { position: 'top' | 'bottom' }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <BadgeButtonDropdown
        badge={<p>Change Theme</p>}
        DropdownItems={[{ label: 'Light' }, { label: 'Dark' }]}
      >
        <p>Dark</p>
      </BadgeButtonDropdown>
    )
  }

  return (
    <BadgeButtonDropdown
      badge={<p>Change Theme</p>}
      position={position}
      DropdownItems={[
        {
          label: 'Light',
          onClick: () => setTheme('light'),
        },
        {
          label: 'Dark',
          onClick: () => setTheme('dark'),
        },
      ]}
    >
      <p>{theme === 'dark' ? 'Dark' : 'Light'}</p>
    </BadgeButtonDropdown>
  )
}

export default ThemeToggleDropdown
