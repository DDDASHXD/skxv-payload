import dynamic from 'next/dynamic'
import { FaqDesignVersion } from './config'

// Use dynamic imports for code-splitting - components are only loaded when needed
const faq: Record<FaqDesignVersion, React.ComponentType<any>> = {
  FAQ1: dynamic(() => import('@/blocks/Faq/faq1')),
  FAQ2: dynamic(() => import('@/blocks/Faq/faq2')),
  FAQ3: dynamic(() => import('@/blocks/Faq/faq3')),
  FAQ4: dynamic(() => import('@/blocks/Faq/faq4')),
  FAQ5: dynamic(() => import('@/blocks/Faq/faq5')),
}

export const FaqBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'faq') return null
  if (!designVersion) return null

  const FaqToRender = faq[designVersion as FaqDesignVersion]

  if (!FaqToRender) return null

  return <FaqToRender {...props} />
}

export default FaqBlock
