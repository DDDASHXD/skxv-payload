import React from 'react'
import { create } from 'zustand'
import filesystem from './files'
import type { FileNode } from './files'

interface TerminalStore {
  log: React.ReactNode[]
  print: (message: React.ReactNode, asHtml?: boolean) => void
  clear: () => void
  setLog: (log: React.ReactNode[]) => void
  filesystem: FileNode[]
  currentDirectory: FileNode
  setCurrentDirectory: (directory: FileNode) => void
  input: string
  setInput: (input: string) => void
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  log: [],
  print: (message: React.ReactNode, asHtml?: boolean) =>
    set((state) => ({
      log: [
        ...state.log,
        asHtml
          ? React.createElement('div', { dangerouslySetInnerHTML: { __html: message as string } })
          : message,
      ],
    })),
  clear: () => set({ log: [] }),
  setLog: (log: React.ReactNode[]) => set({ log }),
  filesystem: filesystem,
  currentDirectory: filesystem[0],
  setCurrentDirectory: (directory: FileNode) => set({ currentDirectory: directory }),
  input: '',
  setInput: (input: string) => set({ input }),
}))
