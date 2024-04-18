import React, { useState } from 'react'
import Modal from 'react-modal'
import { Logos } from '../Logos'
import { OpenPortifolio } from '../OpenPortifolio'

import Site1 from '../../Images/site1.png'
import Site2 from '../../Images/site2.png'
import Site3 from '../../Images/site3.jpg'

import Site1Open from '../../Images/site1-open.png'
import Site2Open from '../../Images/site2-open.mp4'
import Site3Open from '../../Images/site3-open.mp4'

import './style.css'

export function Portfolio() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [numPortifolio, setNumPortifolio] = useState(0)

  const openPortifolio = (portifolioNum) => {
    setModalIsOpen(true)
    setNumPortifolio(portifolioNum)
  }

  return (
    <>
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

      <Modal
        isOpen={modalIsOpen}
        aria={{
          labelledby: 'heading',
          describedby: 'full_description',
        }}
        id='modalDelete'
      >
        { numPortifolio === 4 ? (
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
