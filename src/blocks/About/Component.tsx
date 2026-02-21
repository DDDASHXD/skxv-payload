import dynamic from 'next/dynamic'
import { AboutDesignVersion } from './config'

// Use dynamic imports for code-splitting - components are only loaded when needed
const about: Record<AboutDesignVersion, React.ComponentType<any>> = {
  // ABOUT1: dynamic(() => import('@/blocks/About/about1')),
  // ABOUT2: dynamic(() => import('@/blocks/About/about2')),
  ABOUT3: dynamic(() => import('@/blocks/About/about3')),
  ABOUT4: dynamic(() => import('@/blocks/About/about4')),
  // ABOUT5: dynamic(() => import('@/blocks/About/about5')),
}

export const AboutBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'about') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const AboutToRender = about[designVersion as AboutDesignVersion]

  if (!AboutToRender) return null

  return <AboutToRender {...props} />
}

export default AboutBlock
