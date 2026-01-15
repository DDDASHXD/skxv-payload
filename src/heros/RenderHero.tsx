import React from 'react'
import dynamic from 'next/dynamic'

import type { Page } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

// Use dynamic imports for code-splitting - components are only loaded when needed
const heroes: Record<number, React.ComponentType<any>> = {
  1: dynamic(() => import('@/heros/PageHero/hero1').then((mod) => mod.Hero1 || mod.default)),
  2: dynamic(() => import('@/heros/PageHero/hero2').then((mod) => mod.Hero2 || mod.default)),
  3: dynamic(() => import('@/heros/PageHero/hero3').then((mod) => mod.Hero3 || mod.default)),
  4: dynamic(() => import('@/heros/PageHero/hero4').then((mod) => mod.Hero4 || mod.default)),
  5: dynamic(() => import('@/heros/PageHero/hero5').then((mod) => mod.Hero5 || mod.default)),
  6: dynamic(() => import('@/heros/PageHero/hero6').then((mod) => mod.Hero6 || mod.default)),
  7: dynamic(() => import('@/heros/PageHero/hero7').then((mod) => mod.Hero7 || mod.default)),
  8: dynamic(() => import('@/heros/PageHero/hero8').then((mod) => mod.Hero8 || mod.default)),
  9: dynamic(() => import('@/heros/PageHero/hero9')),
  10: dynamic(() => import('@/heros/PageHero/hero10')),
  11: dynamic(() => import('@/heros/PageHero/hero11')),
  12: dynamic(() => import('@/heros/PageHero/hero12')),
  13: dynamic(() => import('@/heros/PageHero/hero13')),
  14: dynamic(() => import('@/heros/PageHero/hero14')),
  15: dynamic(() => import('@/heros/PageHero/hero15')),
  16: dynamic(() => import('@/heros/PageHero/hero16')),
  18: dynamic(() => import('@/heros/PageHero/hero18')),
  20: dynamic(() => import('@/heros/PageHero/hero20')),
  21: dynamic(() => import('@/heros/PageHero/hero21')),
  24: dynamic(() => import('@/heros/PageHero/hero24')),
  25: dynamic(() => import('@/heros/PageHero/hero25')),
  26: dynamic(() => import('@/heros/PageHero/hero26')),
  27: dynamic(() => import('@/heros/PageHero/hero27')),
  28: dynamic(() => import('@/heros/PageHero/hero28')),
  29: dynamic(() => import('@/heros/PageHero/hero29')),
  30: dynamic(() => import('@/heros/PageHero/hero30')),
  31: dynamic(() => import('@/heros/PageHero/hero31').then((mod) => mod.Hero31 || mod.default)),
  32: dynamic(() => import('@/heros/PageHero/hero32')),
  33: dynamic(() => import('@/heros/PageHero/hero33')),
  34: dynamic(() => import('@/heros/PageHero/hero34')),
  35: dynamic(() => import('@/heros/PageHero/hero35')),
  36: dynamic(() => import('@/heros/PageHero/hero36')),
  37: dynamic(() => import('@/heros/PageHero/hero37')),
  38: dynamic(() => import('@/heros/PageHero/hero38')),
  39: dynamic(() => import('@/heros/PageHero/hero39')),
  40: dynamic(() => import('@/heros/PageHero/hero40')),
  45: dynamic(() => import('@/heros/PageHero/hero45')),
  50: dynamic(() => import('@/heros/PageHero/hero50')),
  51: dynamic(() => import('@/heros/PageHero/hero51')),
  53: dynamic(() => import('@/heros/PageHero/hero53')),
  55: dynamic(() => import('@/heros/PageHero/hero55')),
  57: dynamic(() => import('@/heros/PageHero/hero57')),
  101: dynamic(() => import('@/heros/PageHero/hero101')),
  112: dynamic(() => import('@/heros/PageHero/hero112')),
  195: dynamic(() => import('@/heros/PageHero/hero195')),
  220: dynamic(() => import('@/heros/PageHero/hero220').then((mod) => mod.Hero220 || mod.default)),
  214: dynamic(() => import('@/heros/PageHero/hero214').then((mod) => mod.Hero214 || mod.default)),
  219: dynamic(() => import('@/heros/PageHero/hero219').then((mod) => mod.Hero219 || mod.default)),
}

export const RenderHero: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = (
  props,
) => {
  const { designVersion, publicContext } = props || {}

  if (!designVersion || designVersion === 'none') return null

  const HeroToRender = heroes[designVersion]

  if (!HeroToRender) return null

  return <HeroToRender {...props} publicContext={publicContext} />
}
