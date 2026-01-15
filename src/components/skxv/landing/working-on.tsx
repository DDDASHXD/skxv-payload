import React from 'react'
import Card from '../reusables/card'
import Link from 'next/link'
import { ActionButton } from '../reusables/action'
import { ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
import { PublicContextProps } from '@/utilities/publicContextProps'
import localization from '@/localization.config'

const WorkingOn = async () => {
  const payload = await getPayload({ config: configPromise })
  const highlightedProject = await payload.find({
    collection: 'projects',
    where: {
      highlighted: {
        equals: true,
      },
    },
    limit: 1,
  })

  if (!highlightedProject.docs.length) {
    return null
  }

  const project = highlightedProject.docs[0]
  const publicContext: PublicContextProps = {
    locale: localization.defaultLocale,
    isNotFound: false,
  }

  return (
    <Card title="Currently working on" titlePosition="left">
      <b>{project.title}</b>
      {project.longDescription && (
        <div className="mb-2">
          <RichText
            publicContext={publicContext}
            content={project.longDescription}
            withWrapper={false}
          />
        </div>
      )}
      {project.link && (
        <Link href={project.link} className="w-full">
          <ActionButton icon={<ArrowRight className="size-4" />} className="w-full">
            Visit {project.title}
          </ActionButton>
        </Link>
      )}
    </Card>
  )
}

export default WorkingOn
