'use client'

import React from 'react'
import { useTerminalStore } from './store'
import filesystem from './files'
import { createConfession, getRandomConfession } from './action'
import InlineLink from '../reusables/inline-link'

interface Command {
  description: string
  usage?: string
  hidden?: boolean
  execute: (args?: string) => void
}

export interface Commands {
  [key: string]: Command
}

export function useCommands() {
  const { print, clear, log, setLog, currentDirectory, setCurrentDirectory, input, setInput } =
    useTerminalStore()

  React.useEffect(() => {
    setCurrentDirectory(filesystem[0])
  }, [])

  React.useEffect(() => {
    if (log.length > 10) {
      setLog(log.slice(log.length - 10))
    }
  }, [log, setLog])

  const commands: Commands = {
    help: {
      description: 'Show available commands',
      usage: 'help',
      execute: () => {
        const commandList = Object.keys(commands)
          .filter((command) => !commands[command].hidden)
          .map((command) => `${command}: ${commands[command].usage}`)
          .join('\n')
        print(
          <div>
            <div>Available commands:</div>
            <pre>{commandList}</pre>
          </div>,
        )
      },
    },
    clear: {
      description: 'Clear terminal',
      usage: 'clear',
      execute: () => {
        clear()
      },
    },
    confess: {
      description: 'Confess your sins',
      usage: 'confess <your confession>',
      execute: async (args?: string) => {
        if (!args || args.trim() === '') {
          print('Usage: confess <your confession>')
          return
        }

        print('Submitting confession...')

        const result = await createConfession(args)

        if (result.success) {
          print('Confession submitted anonymously.')
        } else {
          print('Failed to submit confession. Please try again.')
        }
      },
    },
    confession: {
      description: 'Get a random confession',
      usage: 'confession',
      execute: async () => {
        const result = await getRandomConfession()

        if (result.success) {
          print(result.confession?.content)
        } else {
          print('Failed to get random confession. Please try again.')
        }
      },
    },
    job: {
      description: 'i hate my job',
      usage: 'job',
      hidden: true,
      execute: () => {
        print(
          <div>
            <div>i hate my job so fucking much</div>
            <video
              src="https://images-ext-1.discordapp.net/external/dsdYYWz_DvvUhtwQ6PqMDqGKILZ97LLdCsV4fVmPoJs/https/media.tenor.com/oH_2wCXH2UgAAAPo/banbert-tired.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-32 w-32"
            />
            <p>
              Which is why i am starting{' '}
              <InlineLink href="https:/arevodigital.dk">my own business</InlineLink>!!!
            </p>
          </div>,
        )
      },
    },
  }

  return commands
}
