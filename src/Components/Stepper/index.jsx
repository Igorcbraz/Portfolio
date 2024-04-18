import React from 'react'
import { string, node } from 'prop-types'

import './style.css'

export function Stepper({
  status = 'empty',
  children,
}) {
  return (
    <div className={`step ${status}`}>
      <div className='v-stepper'>
        <div className='circle' />
        <div className='line' />
      </div>

      <div className='content'>
        { children }
      </div>
    </div>
  )
}

Stepper.propTypes = {
  status: string,
  children: node,
}
