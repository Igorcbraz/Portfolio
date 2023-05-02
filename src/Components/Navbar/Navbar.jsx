import { useEffect, useState } from 'react'
import { Logos } from '../Logos/Logos'
import Logo from '../../Images/Logo.png'

import './navbar.css'

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export function Navbar() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header>
      <nav>
        <ul className='row'>

          { windowDimensions.width > 425 && (
            <div className='icons algin-center-nav col'>
              <li><Logos isGithub /></li>
              {/* <li><Logos isBehance /></li> */}
            </div>
          )}

          <div className='algin-center-nav col'>
            <div className='algin-center-nav text-nav'>
              <li>
                <a href='#experiencias'>Experiências</a>
              </li>
              <li>
                <a href='#sobre'>Sobre</a>
              </li>
            </div>
            { windowDimensions.width > 425 && (
              <a href='#developer'>
                <img src={Logo} id='logo' width='128px' height='123px' alt='Logo igorcbraz design' />
              </a>
            )}
            <div className='algin-center-nav text-nav'>
              <li>
                <a href='#projetos'>Projetos</a>
              </li>
              <li>
                <a href='#tecnologias'>Tecnologias</a>
              </li>
            </div>
          </div>

          { windowDimensions.width > 425 ? (
            <div className='icons algin-center-nav col'>
              {/* <li><Logos isInstagram /></li> */}
              <li><Logos isLinkedin /></li>
            </div>
          ) : (
            <div className='iconsMobile'>
              <li><Logos isGithub /></li>
              {/* <li><Logos isBehance /></li> */}
              {/* <li><Logos isInstagram /></li> */}
              <li><Logos isLinkedin /></li>
            </div>
          )}
        </ul>
      </nav>
    </header>
  )
}
