import React from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorPlace() {
    const err = useRouteError()
  return (
    <section>
        <h1>You just Ran into an ERROR</h1>
        <p>{err.message}</p>
    </section>
  )
}

export default ErrorPlace