import React from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({title="Chatify",description="This is the Chatting App "}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
    </Helmet>
  )
}

export default Title