'use client'

import React from 'react'
import axios from 'axios'
import Badge from './reusables/badge'
import Spinner from './reusables/spinner'

const PageViews = () => {
  const [pageViews, setPageViews] = React.useState(0)
  const [hasFetched, setHasFetched] = React.useState(false)

  React.useEffect(() => {
    axios
      .get('/api/get-view-count?websiteId=9c2eac36-9ef2-4ad1-b9ce-ab71adf608cd')
      .then((res) => {
        if (res.data.success) {
          setPageViews(res.data.viewCount)
        } else {
          console.error('Failed to fetch page views:', res.data.error)
        }
        setHasFetched(true)
      })
      .catch((error) => {
        console.error('Error fetching page views:', error)
        setHasFetched(true)
      })
  }, [])

  return (
    <Badge>
      Page views: {hasFetched ? pageViews : <Spinner size="small" className="text-sm" />}
    </Badge>
  )
}

export default PageViews
