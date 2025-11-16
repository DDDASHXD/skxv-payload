import React from 'react'
import InlineLink from '../reusables/inline-link'
import Card from '../reusables/card'

const RecentProjects = () => {
  const projects = [
    {
      title: 'Arevo Digital',
      description: 'Website for Arevo Digital',
      link: 'https://arevodigital.dk',
    },
    {
      title: 'Arevo Plugins Repository',
      description: 'Repository of plugins for Payload CMS',
      link: 'https://plugins.arevodigital.dk',
    },
    {
      title: 'RPI-KWH',
      description: 'Dashboard for monitoring electricity prices in Denmark',
      link: 'https://rpi-kwh.vercel.app',
    },
  ]
  return (
    <Card title="Recent projects">
      <ul className="list-inside list-disc">
        {projects.map((project) => (
          <li key={project.title}>
            <InlineLink href={project.link}>{project.title}</InlineLink> - {project.description}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default RecentProjects
