import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import dynamic from 'next/dynamic'

import type { Footer } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

// Use dynamic imports for code-splitting - components are only loaded when needed
const footers: Record<string, React.ComponentType<any>> = {
  '1': dynamic(() => import('./footer/footer1')),
  '2': dynamic(() => import('./footer/footer2')),
  '3': dynamic(() => import('./footer/footer3')),
  '4': dynamic(() => import('./footer/footer4')),
  '5': dynamic(() => import('./footer/footer5')),
  '6': dynamic(() => import('./footer/footer6')),
  '7': dynamic(() => import('./footer/footer7')),
  '8': dynamic(() => import('./footer/footer8')),
}

export async function Footer({ publicContext }: { publicContext: PublicContextProps }) {
  const footer: Footer = await getCachedGlobal('footer', publicContext.locale, 2)()

  const footerType = footer.designVersion

  if (!footerType) return null

  const FooterComponent = footers[footerType]

  if (!FooterComponent) return null

  return <FooterComponent footer={footer} publicContext={publicContext} />
}
