import dynamic from 'next/dynamic'
import { ContactDesignVersion } from './config'

// Use dynamic imports for code-splitting - components are only loaded when needed
const contact: Record<ContactDesignVersion, React.ComponentType<any>> = {
  // CONTACT1: dynamic(() => import('@/blocks/Contact/contact1')),
  CONTACT2: dynamic(() => import('@/blocks/Contact/contact2')),
  // CONTACT3: dynamic(() => import('@/blocks/Contact/contact3')),
  // CONTACT4: dynamic(() => import('@/blocks/Contact/contact4')),
}

export const ContactBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'contact') return null
  if (!designVersion) return null

  const ContactToRender = contact[designVersion as ContactDesignVersion]

  if (!ContactToRender) return null

  return <ContactToRender {...props} />
}

export default ContactBlock
