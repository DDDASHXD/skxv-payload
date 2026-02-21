import dynamic from 'next/dynamic'
import { CtaDesignVersion } from './config'

type CtaDesignVersionValue = CtaDesignVersion['value']

// Use dynamic imports for code-splitting - components are only loaded when needed
const ctas: Record<string, React.ComponentType<any>> = {
  CTA1: dynamic(() => import('@/blocks/Cta/cta1')),
  CTA3: dynamic(() => import('@/blocks/Cta/cta3')),
  CTA4: dynamic(() => import('@/blocks/Cta/cta4')),
  CTA5: dynamic(() => import('@/blocks/Cta/cta5')),
  CTA6: dynamic(() => import('@/blocks/Cta/cta6')),
  CTA7: dynamic(() => import('@/blocks/Cta/cta7')),
  CTA10: dynamic(() => import('@/blocks/Cta/cta10')),
  CTA11: dynamic(() => import('@/blocks/Cta/cta11')),
  CTA12: dynamic(() => import('@/blocks/Cta/cta12')),
  CTA13: dynamic(() => import('@/blocks/Cta/cta13')),
  CTA15: dynamic(() => import('@/blocks/Cta/cta15')),
  CTA16: dynamic(() => import('@/blocks/Cta/cta16')),
  CTA17: dynamic(() => import('@/blocks/Cta/cta17')),
}

export const CtaBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'cta') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const CtaToRender = ctas[designVersion as CtaDesignVersionValue]

  if (!CtaToRender) return null

  return <CtaToRender {...props} />
}

export default CtaBlock
