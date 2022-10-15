import { string, bool } from 'prop-types'

import './frase.css'

export function Frase({
  invertColors,
  frase,
  destaque,
  isFinal,
  intro,
  secondDestaque,
}) {
  return (
    <>
      { !invertColors ? (
        <section className='frase-imagens'>
          <h1
            data-aos='fade-down'
          >
            { frase }
            {' '}
            <span>{ destaque }</span>
          </h1>
          { isFinal && (
            <a href='https://www.instagram.com/igorcbrazdesign/' target='_blank' rel='noreferrer' data-aos='fade-down'>
              <button type='button'>Entre em Contato</button>
            </a>
          )}
        </section>
      ) : (
        <section className={!intro ? 'frase-imagens' : 'frase-imagens intro'}>
          <h1
            data-aos={!intro ? 'fade-down' : 'slide-right'}
            id={intro && 'developer'}
          >
            <span>{frase}</span>
            {' '}
            {destaque}
          </h1>
          { intro && (
            <h1
              data-aos='slide-left'
              id='designer'
            >
              <span>{ frase }</span>
              {' '}
              { secondDestaque }
            </h1>
          )}
        </section>
      )}
    </>
  )
}

Frase.propTypes = {
  invertColors: bool,
  frase: string,
  destaque: string,
  isFinal: bool,
  intro: bool,
  secondDestaque: string,
}
