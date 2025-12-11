'use client'

import { cn } from '@/utilities/cn'
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  slimCaret?: boolean
  blink?: boolean
}

const Input = ({ className, slimCaret = false, blink = false, ...props }: InputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const [caretPosition, setCaretPosition] = React.useState<number>(0)
  const [caretPixelPosition, setCaretPixelPosition] = React.useState<number>(0)
  const [caretHeight, setCaretHeight] = React.useState<number>(20)

  const updateCaretPosition = React.useCallback(() => {
    if (inputRef.current && measureRef.current) {
      const position = inputRef.current.selectionStart ?? 0
      setCaretPosition(position)

      // Measure pixel position of caret
      const textBeforeCaret = inputRef.current.value.substring(0, position)
      measureRef.current.textContent = textBeforeCaret || '\u200B' // Use zero-width space for empty input
      const width = measureRef.current.offsetWidth
      const height = measureRef.current.offsetHeight
      setCaretPixelPosition(width)
      setCaretHeight(height)
    }
  }, [])

  // Track caret position on any interaction
  React.useEffect(() => {
    const input = inputRef.current
    if (!input) return

    // Update on various events that can change caret position
    input.addEventListener('click', updateCaretPosition)
    input.addEventListener('keyup', updateCaretPosition)
    input.addEventListener('focus', updateCaretPosition)
    input.addEventListener('select', updateCaretPosition)
    input.addEventListener('input', updateCaretPosition)

    return () => {
      input.removeEventListener('click', updateCaretPosition)
      input.removeEventListener('keyup', updateCaretPosition)
      input.removeEventListener('focus', updateCaretPosition)
      input.removeEventListener('select', updateCaretPosition)
      input.removeEventListener('input', updateCaretPosition)
    }
  }, [updateCaretPosition])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={cn('w-full caret-transparent focus:outline-none', className)}
        {...props}
      />
      {/* Hidden measuring element with same font properties */}
      <span
        ref={measureRef}
        className={cn('invisible absolute whitespace-pre', className)}
        aria-hidden="true"
      />
      <div
        className={cn(
          'absolute top-0 w-3 bg-white mix-blend-difference transition-all duration-75',
          slimCaret ? 'w-1' : 'w-3',
          blink ? 'animate-blink' : '',
        )}
        style={{ left: `${caretPixelPosition}px`, height: `${caretHeight}px` }}
      />
    </div>
  )
}

export default Input
