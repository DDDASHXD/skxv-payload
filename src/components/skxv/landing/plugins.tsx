import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Card from '../reusables/card'
import Link from 'next/link'
import InlineLink from '../reusables/inline-link'

const Plugins = async () => {
  const payload = await getPayload({ config: configPromise })
  const plugins = await payload.find({
    collection: 'plugins',
    limit: 10,
  })
  return (
    <Card title="Plugins">
      <p>This is a list of plugins for Payload CMS, which i have created or am working on.</p>
      <ul className="list-inside list-disc">
        {plugins.docs.map((plugin) => (
          <li key={plugin.id}>
            <InlineLink href={plugin.link || ''}>{plugin.name}</InlineLink> - {plugin.description}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default Plugins
