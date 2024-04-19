import React from 'react'
import PropTypes from 'prop-types'
import { Stepper } from '../Stepper'

import './VTcontent.css'

export function VTcontent({ data }) {
  return data.map((job) => (
    <Stepper
      key={job.id}
      status={job.status}
      className='section__Jobs-styledContent'
    >
      <span className='headerStep'>
        <h3>{job.position}</h3>
        {job?.highlight?.length > 0 && (<p className='company'>{job.highlight}</p>)}
      </span>
      <span>
        {job?.contract?.length > 0 && (<p className='company'>{job.contract}</p>)}
        <p className='caption'>{job.period}</p>
      </span>
      {job.details.map((detail) => (
        <p className={`section__Jobs-detail ${detail.className}`}>{detail.content}</p>
      ))}
    </Stepper>
  ))
}

VTcontent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
}
