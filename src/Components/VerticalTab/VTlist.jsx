import React from 'react'
import PropTypes from 'prop-types'

import './VTlist.css'

export function VTlist({
  companyName,
  onClick,
  activeTabName,
}) {
  return (
    <li key={companyName} style={{ listStyle: 'none', textAlign: 'left' }}>
      <button
        className='section__Jobs-buttonCompany'
        onClick={() => onClick(companyName)}
        style={activeTabName === companyName ? { color: '#FF960C' } : { color: '#8892b0' }}
        type='button'
      >
        {companyName}
      </button>
    </li>
  )
}

VTlist.propTypes = {
  companyName: PropTypes.string,
  onClick: PropTypes.func,
  activeTabName: PropTypes.string,
}
