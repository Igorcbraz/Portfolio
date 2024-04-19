import React, { useEffect, useState } from 'react'
import { GithubLogo } from '../Logo/GithubLogo'
import { LinkedinLogo } from '../Logo/LinkedinLogo'
import Logo from '../../Images/Logo.png'

import './style.css'

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
              <li><GithubLogo /></li>
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
              <a href='#home'>
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
              <li><LinkedinLogo /></li>
            </div>
          ) : (
            <div className='iconsMobile'>
              <li><GithubLogo /></li>
              <li><LinkedinLogo /></li>
            </div>
          )}
        </ul>
      </nav>
    </header>
  )
}
