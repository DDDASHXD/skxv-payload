'use client'

import React from 'react'
import Card from '../reusables/card'
import Input from '../reusables/input'
import { useCommands } from './commands'
import { useTerminalStore } from './store'

const Terminal = () => {
  const { log, print, clear, currentDirectory, setCurrentDirectory, input, setInput } =
    useTerminalStore()
  const commands = useCommands()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      print(`> ${input}`)

      const [commandName, ...args] = input.split(' ')
      const commandArgs = args.join(' ')

      setInput('')

      if (commands[commandName]) {
        commands[commandName].execute(commandArgs)
      } else {
        print(`Unknown command: ${commandName}`)
      }
    }
  }

  return (
    <Card title="Terminal">
      {log.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
      <div className="flex items-center">
        <p className="mr-2.5 flex items-center gap-2">
          <span className="text-foreground">{currentDirectory.name}</span>{' '}
          <span className="text-foreground">{'>'}</span>
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full focus:outline-none"
        />
      </div>
    </Card>
  )
}

export default Terminal
