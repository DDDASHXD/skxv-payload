import dynamic from 'next/dynamic'
import { StatDesignVersion } from './config'

type StatDesignVersionValue = StatDesignVersion['value']

// Use dynamic imports for code-splitting - components are only loaded when needed
const stat: Record<StatDesignVersionValue, React.ComponentType<any>> = {
  STAT1: dynamic(() => import('@/blocks/Stat/stat1')),
  STAT2: dynamic(() => import('@/blocks/Stat/stat2')),
  STAT4: dynamic(() => import('@/blocks/Stat/stat4')),
  STAT5: dynamic(() => import('@/blocks/Stat/stat5')),
  STAT6: dynamic(() => import('@/blocks/Stat/stat6')),
  STAT7: dynamic(() => import('@/blocks/Stat/stat7')),
  STAT8: dynamic(() => import('@/blocks/Stat/stat8')),
}

export const StatBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'stat') return null
  if (!designVersion) return null

  const StatToRender = stat[designVersion as StatDesignVersionValue]

  if (!StatToRender) return null

  return <StatToRender {...props} />
}

export default StatBlock
