import dynamic from 'next/dynamic'
import { LogosDesignVersion } from './config'

type LogosVersionValue = LogosDesignVersion['value']

// Use dynamic imports for code-splitting - components are only loaded when needed
const Logos: Record<LogosVersionValue, React.ComponentType<any>> = {
  LOGOS1: dynamic(() => import('@/blocks/Logos/logos1')),
  LOGOS2: dynamic(() => import('@/blocks/Logos/logos2')),
  LOGOS3: dynamic(() => import('@/blocks/Logos/logos3')),
  LOGOS9: dynamic(() => import('@/blocks/Logos/logos9')),
}

export const LogosBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'logos') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const LogosToRender = Logos[designVersion as LogosVersionValue]

  if (!LogosToRender) return null

  return <LogosToRender {...props} />
}

export default LogosBlock
