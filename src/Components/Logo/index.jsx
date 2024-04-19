import React from 'react'
import { string } from 'prop-types'

import './style.css'

export function Logo({
  href, id, color, children,
}) {
  return (
    <a href={href} target='_blank' rel='noreferrer'>
      <svg id={id} width='40' height='40' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path fillRule='evenodd' clipRule='evenodd' d={children} fill={color || '#f3f3f3'} />
      </svg>
    </a>
  )
}

Logo.propTypes = {
  href: string.isRequired,
  id: string.isRequired,
  color: string,
  children: string.isRequired,
}
