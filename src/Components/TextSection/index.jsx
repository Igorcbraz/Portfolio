import React from 'react'
import PropTypes from 'prop-types'

import './style.css'

export function TextSection({
  invertTextColors,
  title,
  subtitle,
  highlight,
  isFinal,
  introduction,
}) {
  const sectionClass = introduction ? 'frase-imagens introduction' : 'frase-imagens'
  const dataAos = introduction ? 'slide-right' : 'fade-down'
  const id = introduction ? 'developer' : undefined

  return (
    <section className={invertTextColors ? sectionClass : 'frase-imagens'}>
      <h1 data-aos={invertTextColors ? dataAos : 'fade-down'} id={id}>
        <span>{title}</span>
        {' '}
        {subtitle}
      </h1>
      { introduction && (
        <h1 data-aos='slide-left' id='designer'>
          <span>{ title }</span>
          {' '}
          { highlight }
        </h1>
      )}
      { isFinal && (
        <a href='https://www.linkedin.com/in/igorcbraz/' target='_blank' rel='noreferrer' data-aos='fade-down'>
          <button type='button'>Entre em Contato</button>
        </a>
      )}
    </section>
  )
}

TextSection.propTypes = {
  invertTextColors: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isFinal: PropTypes.bool,
  introduction: PropTypes.bool,
  highlight: PropTypes.string,
}
