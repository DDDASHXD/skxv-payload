import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sebastian Skov',
  alternateName: 'SKXV',
  url: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work',
  image: `${NEXT_PUBLIC_SERVER_URL || 'https://trieb.work'}/skxv.svg`,
  jobTitle: 'Frontend Engineer',
  description:
    'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Specializing in TypeScript, React, Next.js, and Payload CMS.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Roskilde',
    addressCountry: 'DK',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Roskilde University',
  },
  worksFor: [
    {
      '@type': 'Organization',
      name: 'TypoConsult',
      url: 'https://typoconsult.dk',
    },
    {
      '@type': 'Organization',
      name: 'Arevo Digital',
      url: 'https://arevodigital.dk',
    },
  ],
  knowsAbout: [
    'Payload CMS',
    'TypeScript',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Figma',
    'UI/UX Design',
    'Web Development',
  ],
  knowsLanguage: [
    {
      '@type': 'Language',
      name: 'Danish',
      alternateName: 'da',
    },
    {
      '@type': 'Language',
      name: 'English',
      alternateName: 'en',
    },
  ],
  sameAs: [
    // Add your social media profiles here
    // 'https://github.com/yourusername',
    // 'https://linkedin.com/in/yourusername',
    // 'https://twitter.com/skxvdk',
  ],
}

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sebastian Skov - Frontend Engineer',
  alternateName: 'SKXV',
  url: NEXT_PUBLIC_SERVER_URL || 'https://trieb.work',
  description:
    'UI/UX Designer and frontend web developer based in Roskilde, Denmark. Specializing in TypeScript, React, Next.js, and Payload CMS.',
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'Sebastian Skov',
  },
}

export const profilePageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateCreated: new Date('2024-01-01').toISOString(),
  dateModified: new Date().toISOString(),
  mainEntity: personStructuredData,
}

