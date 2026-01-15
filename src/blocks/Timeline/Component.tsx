import dynamic from 'next/dynamic'
import { TimelineDesignVersion } from './config'

// Use dynamic imports for code-splitting - components are only loaded when needed
const timeline: Record<TimelineDesignVersion, React.ComponentType<any>> = {
  TIMELINE2: dynamic(() => import('./timeline2')),
  TIMELINE8: dynamic(() => import('./timeline8')),
}

export const TimelineBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'timeline') return null
  if (!designVersion) return null

  const TimelineToRender = timeline[designVersion as TimelineDesignVersion]

  if (!TimelineToRender) return null

  return <TimelineToRender {...props} />
}

export default TimelineBlock
