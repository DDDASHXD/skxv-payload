'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'

import Card from '@/components/skxv/reusables/card'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <Card title="CODE" titlePosition="center" className="border-primary p-0">
      <Highlight code={code} language={language} theme={themes.vsDark}>
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre className="overflow-x-auto p-4">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ className: 'table-row', line })}>
                <span className="table-cell pr-4 text-right text-white/25 select-none">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Card>
  )
}
