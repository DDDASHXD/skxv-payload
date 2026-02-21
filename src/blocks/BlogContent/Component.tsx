import { Post } from '@/payload-types'
import { allPostDesignVersions } from '@/collections/Posts/index'
import { Blog18 } from './blog18'
import { PublicContextProps } from '@/utilities/publicContextProps'

// Extract just the value property from the design versions for use as keys
type PostDesignVersionValue = (typeof allPostDesignVersions)[number]['value']

// Enforce required blog but allow additional ones
type BlogContent<T extends string = string> = Required<
  Record<PostDesignVersionValue, React.FC<any>>
> &
  Record<T, React.FC<any>>

const blog: BlogContent = {
  BLOG18: Blog18,
}

/**
 * Blog Content is the Blog Detail Page.
 * @param props
 * @returns
 */
export const BlogContentBlock: React.FC<Post & { publicContext: PublicContextProps }> = (props) => {
  if (!props.content) return null

  return <Blog18 {...props} />
}
