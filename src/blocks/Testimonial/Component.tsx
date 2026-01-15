import dynamic from 'next/dynamic'
import { TestimonialDesignVersion } from './config'

type TestimonialDesignVersionValue = TestimonialDesignVersion['value']

// Use dynamic imports for code-splitting - components are only loaded when needed
const testimonial: Record<TestimonialDesignVersionValue, React.ComponentType<any>> = {
  TESTIMONIAL1: dynamic(() => import('@/blocks/Testimonial/testimonial1')),
  TESTIMONIAL2: dynamic(() => import('@/blocks/Testimonial/testimonial2')),
  TESTIMONIAL3: dynamic(() => import('@/blocks/Testimonial/testimonial3')),
  TESTIMONIAL4: dynamic(() => import('@/blocks/Testimonial/testimonial4')),
  TESTIMONIAL6: dynamic(() => import('@/blocks/Testimonial/testimonial6')),
  TESTIMONIAL7: dynamic(() => import('@/blocks/Testimonial/testimonial7')),
  TESTIMONIAL8: dynamic(() => import('@/blocks/Testimonial/testimonial8')),
  TESTIMONIAL9: dynamic(() => import('@/blocks/Testimonial/testimonial9')),
  TESTIMONIAL10: dynamic(() => import('@/blocks/Testimonial/testimonial10')),
  TESTIMONIAL11: dynamic(() => import('@/blocks/Testimonial/testimonial11')),
  TESTIMONIAL12: dynamic(() => import('@/blocks/Testimonial/testimonial12')),
  TESTIMONIAL13: dynamic(() => import('@/blocks/Testimonial/testimonial13')),
  TESTIMONIAL14: dynamic(() => import('@/blocks/Testimonial/testimonial14')),
  TESTIMONIAL15: dynamic(() => import('@/blocks/Testimonial/testimonial15')),
  TESTIMONIAL16: dynamic(() => import('@/blocks/Testimonial/testimonial16')),
  TESTIMONIAL17: dynamic(() => import('@/blocks/Testimonial/testimonial17')),
  TESTIMONIAL18: dynamic(() => import('@/blocks/Testimonial/testimonial18')),
  TESTIMONIAL19: dynamic(() => import('@/blocks/Testimonial/testimonial19')),
}

export const TestimonialBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'testimonial') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const TestimonialToRender = testimonial[designVersion as TestimonialDesignVersionValue]

  if (!TestimonialToRender) return null

  return <TestimonialToRender {...props} />
}

export default TestimonialBlock
