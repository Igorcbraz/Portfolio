import { bool } from 'prop-types'
import { useState } from 'react'
import Modal from 'react-modal'
import { Logos } from '../Logos/Logos'
import { OpenPortifolio } from '../OpenPortifolio/OpenPortifolio'

import Imagem1 from '../../Images/imagem1.png'
import Imagem2 from '../../Images/imagem2.png'
import Imagem3 from '../../Images/imagem3.png'

import Img1Open from '../../Images/imagem1-open.png'
import Img2Open from '../../Images/imagem2-open.png'
import Img3Open from '../../Images/imagem3-open.png'

import Site1 from '../../Images/site1.png'
import Site2 from '../../Images/site2.png'
import Site3 from '../../Images/site3.jpg'

import Site1Open from '../../Images/site1-open.png'
import Site2Open from '../../Images/site2-open.mp4'
import Site3Open from '../../Images/site3-open.mp4'

import './portfolio.css'

export function Portfolio({
  isImages,
  isSites,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [numPortifolio, setNumPortifolio] = useState(0)

  function openPortifolio(portifolioNum) {
    setModalIsOpen(true)
    setNumPortifolio(portifolioNum)
  }

  return (
    <>
      { isImages && (
        <div className='portfolio' data-aos='zoom-out-up'>
          <button type='button' onClick={() => openPortifolio(1)}>
            <img src={Imagem1} alt='Primeira Imagem portfólio' />
          </button>
          <button type='button' onClick={() => openPortifolio(2)}>
            <img src={Imagem2} alt='Segunda Imagem portfólio' />
          </button>
          <button type='button' onClick={() => openPortifolio(3)}>
            <img id='img3' src={Imagem3} alt='Terceira Imagem portfólio' />
          </button>
          <div>
            <Logos isBehance behanceColor='#E3AA5F' />
          </div>
        </div>
      )}
      { isSites && (
        <div className='portfolio row' data-aos='zoom-out-down'>
          <button type='button' onClick={() => openPortifolio(4)}>
            <img src={Site1} alt='Primeira Imagem sites' />
          </button>
          <button type='button' onClick={() => openPortifolio(5)}>
            <img src={Site2} alt='Segunda Imagem sites' />
          </button>
          <button type='button' onClick={() => openPortifolio(6)}>
            <img src={Site3} alt='Terceira Imagem sites' />
          </button>
          <div>
            <Logos isGithub githubColor='#E3AA5F' />
          </div>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        aria={{
          labelledby: 'heading',
          describedby: 'full_description',
        }}
        id='modalDelete'
      >
        { numPortifolio === 1 ? (
          <>
            <button type='button' className='closeBtn' onClick={() => setModalIsOpen(false)}>Fechar</button>
            <OpenPortifolio image={Img1Open} link='https://www.behance.net/gallery/113447237/Overlay-Igorcbraz_Design' />
          </>
        ) : numPortifolio === 2 ? (
          <>
            <button type='button' className='closeBtn' onClick={() => setModalIsOpen(false)}>Fechar</button>
            <OpenPortifolio image={Img2Open} link='https://www.behance.net/gallery/112143357/Overlay-Para-Twitch' />
          </>
        ) : numPortifolio === 3 ? (
          <>
            <button type='button' className='closeBtn' onClick={() => setModalIsOpen(false)}>Fechar</button>
            <OpenPortifolio image={Img3Open} link='https://www.behance.net/gallery/112143357/Overlay-Para-Twitch' />
          </>
        ) : numPortifolio === 4 ? (
          <>
            <button type='button' className='closeBtn' onClick={() => setModalIsOpen(false)}>Fechar</button>
            <OpenPortifolio
              image={Site1Open}
              secondButton
              link='https://igorcbraz.github.io/Buscafe/'
              secondLink='https://github.com/Igorcbraz/Buscafe'
            />
          </>
        ) : numPortifolio === 5 ? (
          <>
            <button type='button' className='closeBtn' onClick={() => setModalIsOpen(false)}>Fechar</button>
            <OpenPortifolio
              srcVideo={Site2Open}
              secondButton
              isVideo
              link='https://letmeask-d58e1.firebaseapp.com/'
              secondLink='https://github.com/Igorcbraz/Letmeask'
            />
          </>
        ) : (
          <>
            <button type='button' className='closeBtn' onClick={() => setModalIsOpen(false)}>Fechar</button>
            <OpenPortifolio
              srcVideo={Site3Open}
              secondButton
              isVideo
              link='https://dtmoney-igorcbraz.netlify.app'
              secondLink='https://github.com/Igorcbraz/dtmoney'
            />
          </>
        )}
      </Modal>
    </>
  )
}

Portfolio.propTypes = {
  isImages: bool.isRequired,
  isSites: bool.isRequired,
}
