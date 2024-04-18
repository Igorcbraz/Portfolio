import React from 'react'
import { string, bool } from 'prop-types'

export function OpenPortifolio({
  image,
  link,
  secondButton,
  secondLink,
  isVideo,
  srcVideo,
}) {
  return (
    <div className='portifolio-open'>
      <div>
        <a href={link} target='_blank' rel='noreferrer'>
          <button type='button'>Acessar Projeto</button>
        </a>

        { secondButton && (
          <a href={secondLink} target='_blank' rel='noreferrer'>
            <button type='button'>Acessar Repositório</button>
          </a>
        )}
      </div>

      { !isVideo ? (
        <img src={image} alt='Imagem completa do portifólio' />
      ) : (
        <video controls>
          <source src={srcVideo} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}

OpenPortifolio.propTypes = {
  image: string.isRequired,
  link: string.isRequired,
  secondLink: string,
  secondButton: bool,
  isVideo: bool,
  srcVideo: string,
}
