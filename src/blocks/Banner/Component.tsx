import dynamic from 'next/dynamic'
import { BannerDesignVersion } from './config'

// Extract the value property from BannerDesignVersion for use as keys
type BannerVersionValue = BannerDesignVersion['value']

// Use dynamic imports for code-splitting - components are only loaded when needed
const banner: Record<BannerVersionValue, React.ComponentType<any>> = {
  BANNER1: dynamic(() => import('./banner1')),
  BANNER5: dynamic(() => import('./banner5')),
}

export const BannerBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'banner') return null
  if (!designVersion) return null

  const BannerToRender = banner[designVersion as BannerVersionValue]

  if (!BannerToRender) return null

  return <BannerToRender {...props} />
}

export default BannerBlock
