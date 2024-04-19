import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { VTlist } from './VTlist'
import { VTcontent } from './VTcontent'

import './style.css'

export function VerticalTab({ experiences }) {
  const [activeTabName, setActiveTabName] = useState(Object.keys(experiences)[0])

  const handleClickList = (name) => setActiveTabName(name)

  return (
    <div className='experience' data-aos='slide-up'>
      <div className='containerExp'>
        <div className='col-sm-3'>
          <div className='section__Jobs-styledTab'>
            <ul className='section__Jobs-styledTabList'>
              {Object.entries(experiences).map(([company]) => (
                <VTlist
                  key={company}
                  onClick={() => handleClickList(company)}
                  companyName={company}
                  activeTabName={activeTabName}
                />
              ))}
            </ul>
          </div>
          <span className={`company-${activeTabName.replace(/\s/g, '').toLocaleLowerCase()}-chosen`} id='companyMarker' />
        </div>
        <div className='col-sm-9'>
          {Object.entries(experiences)
            .filter(([company]) => company === activeTabName)
            .map(([company, jobs], index) => (
              <VTcontent
                data={jobs}
                key={company + index}
                companyName={company}
                activeTabName={activeTabName}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

VerticalTab.propTypes = {
  experiences: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
}
