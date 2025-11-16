'use client'

import { cn } from '@/utilities/cn'
import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  slimCaret?: boolean
  blink?: boolean
}

const Textarea = ({ className, slimCaret = false, blink = false, ...props }: TextareaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const [caretPosition, setCaretPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [caretHeight, setCaretHeight] = React.useState<number>(20)
  const [textareaSize, setTextareaSize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  const updateCaretPosition = React.useCallback(() => {
    if (textareaRef.current && measureRef.current) {
      const textarea = textareaRef.current
      const position = textarea.selectionStart ?? 0

      // Copy computed styles to ensure exact matching
      const computedStyle = window.getComputedStyle(textarea)
      measureRef.current.style.width = `${textarea.clientWidth}px`
      measureRef.current.style.font = computedStyle.font
      measureRef.current.style.fontSize = computedStyle.fontSize
      measureRef.current.style.fontFamily = computedStyle.fontFamily
      measureRef.current.style.fontWeight = computedStyle.fontWeight
      measureRef.current.style.lineHeight = computedStyle.lineHeight
      measureRef.current.style.letterSpacing = computedStyle.letterSpacing
      measureRef.current.style.wordSpacing = computedStyle.wordSpacing
      measureRef.current.style.whiteSpace = computedStyle.whiteSpace
      measureRef.current.style.wordBreak = computedStyle.wordBreak
      measureRef.current.style.padding = computedStyle.padding
      measureRef.current.style.border = 'none'
      measureRef.current.style.boxSizing = computedStyle.boxSizing

      // Get text before and after caret
      const textBeforeCaret = textarea.value.substring(0, position)
      const caretChar = textarea.value.substring(position, position + 1) || '\u200B'

      // Set measuring div content with a marker for the caret
      measureRef.current.innerHTML = ''
      
      const beforeSpan = document.createElement('span')
      beforeSpan.textContent = textBeforeCaret
      measureRef.current.appendChild(beforeSpan)
      
      const caretSpan = document.createElement('span')
      caretSpan.textContent = caretChar
      caretSpan.id = 'caret-marker'
      measureRef.current.appendChild(caretSpan)

      // Get the bounding rect of the caret marker relative to the measure div
      const measureRect = measureRef.current.getBoundingClientRect()
      const caretMarker = caretSpan.getBoundingClientRect()
      
      // Calculate position relative to textarea accounting for scroll
      const scrollTop = textarea.scrollTop
      const scrollLeft = textarea.scrollLeft

      setCaretPosition({
        x: caretMarker.left - measureRect.left - scrollLeft,
        y: caretMarker.top - measureRect.top - scrollTop,
      })
      setCaretHeight(caretMarker.height)
      setTextareaSize({
        width: textarea.clientWidth,
        height: textarea.clientHeight,
      })
    }
  }, [])

  // Track caret position on any interaction
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Update on various events that can change caret position
    textarea.addEventListener('click', updateCaretPosition)
    textarea.addEventListener('keyup', updateCaretPosition)
    textarea.addEventListener('focus', updateCaretPosition)
    textarea.addEventListener('select', updateCaretPosition)
    textarea.addEventListener('input', updateCaretPosition)
    textarea.addEventListener('scroll', updateCaretPosition)

    // Handle textarea resize
    const resizeObserver = new ResizeObserver(() => {
      updateCaretPosition()
    })
    resizeObserver.observe(textarea)

    // Initial position update
    updateCaretPosition()

    return () => {
      textarea.removeEventListener('click', updateCaretPosition)
      textarea.removeEventListener('keyup', updateCaretPosition)
      textarea.removeEventListener('focus', updateCaretPosition)
      textarea.removeEventListener('select', updateCaretPosition)
      textarea.removeEventListener('input', updateCaretPosition)
      textarea.removeEventListener('scroll', updateCaretPosition)
      resizeObserver.disconnect()
    }
  }, [updateCaretPosition])

  // Check if caret is visible within textarea bounds
  const isCaretVisible =
    caretPosition.y >= 0 &&
    caretPosition.y < textareaSize.height &&
    caretPosition.x >= 0 &&
    caretPosition.x < textareaSize.width

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={cn('block w-full caret-transparent focus:outline-none resize-none', className)}
        {...props}
      />
      {/* Hidden measuring element with same font properties */}
      <div
        ref={measureRef}
        className="invisible absolute top-0 left-0 whitespace-pre-wrap overflow-hidden pointer-events-none"
        aria-hidden="true"
      />
      {isCaretVisible && (
        <div
          className={cn(
            'absolute bg-white mix-blend-difference transition-all duration-75 pointer-events-none',
            slimCaret ? 'w-1' : 'w-4',
            blink ? 'animate-blink' : '',
          )}
          style={{
            left: `${caretPosition.x}px`,
            top: `${caretPosition.y}px`,
            height: `${caretHeight}px`,
          }}
        />
      )}
    </div>
  )
}

export default Textarea

