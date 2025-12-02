'use client'

import React from 'react'
import axios from 'axios'
import Badge from './reusables/badge'
import Spinner from './reusables/spinner'

const PageViews = () => {
  const [pageViews, setPageViews] = React.useState(0)
  const [hasFetched, setHasFetched] = React.useState(false)

  React.useEffect(() => {
    axios.get('/api/get-view-count?websiteId=f843ebec-8bc9-4096-8eb3-859a1bfa871c').then((res) => {
      setPageViews(res.data.viewCount)
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
