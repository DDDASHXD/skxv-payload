import dynamic from 'next/dynamic'
import { Page } from '@/payload-types'
import { allGalleryDesignVersions } from './config'

// Extract just the value property from the design version objects
type GalleryDesignVersionValue = (typeof allGalleryDesignVersions)[number]['value']

// Use dynamic imports for code-splitting - components are only loaded when needed
const galleries: Record<GalleryDesignVersionValue, React.ComponentType<any>> = {
  GALLERY1: dynamic(() => import('@/blocks/Gallery/gallery1')),
  GALLERY2: dynamic(() => import('@/blocks/Gallery/gallery2')),
  GALLERY3: dynamic(() => import('@/blocks/Gallery/gallery3')),
  GALLERY4: dynamic(() => import('@/blocks/Gallery/gallery4')),
  GALLERY5: dynamic(() => import('@/blocks/Gallery/gallery5')),
  GALLERY6: dynamic(() => import('@/blocks/Gallery/gallery6')),
  GALLERY7: dynamic(() => import('@/blocks/Gallery/gallery7')),
  GALLERY25: dynamic(() => import('@/blocks/Gallery/gallery25').then((mod) => mod.Gallery25 || mod.default)),
  GALLERY26: dynamic(() => import('@/blocks/Gallery/gallery26').then((mod) => mod.Gallery26 || mod.default)),
}

export const GalleryBlock: React.FC<Page['layout'][0]> = (props) => {
  if (props.blockType !== 'gallery') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const GalleryToRender = galleries[designVersion]

  if (!GalleryToRender) return null

  return <GalleryToRender {...props} />
}
