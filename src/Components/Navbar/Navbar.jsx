import { Logos } from '../Logos/Logos';
import Logo from '../../Images/Logo.png';

import './navbar.css';

export function Navbar() {
  const screenSize = window.screen.width;
  return (
    <header>
      <nav>
        <ul className='row'>

          {screenSize > 425 && (
            <div className='icons algin-center-nav col'>
              <li><Logos isGithub /></li>
              <li><Logos isBehance /></li>
            </div>
          )}

          <div className='algin-center-nav col'>
            <div className='algin-center-nav text-nav'>
              <li>
                <a href='#perguntas'>Perguntas</a>
              </li>
              <li>
                <a href='#sobre'>Sobre</a>
              </li>
            </div>
            {screenSize > 425 && (
              <a href='#intro'>
                <img src={Logo} id='logo' width='128px' height='123px' alt='Logo igorcbraz design' />
              </a>
            )}
            <div className='algin-center-nav text-nav'>
              <li>
                <a href='#imagens'>Design</a>
              </li>
              <li>
                <a href='#sites'>Programação</a>
              </li>
            </div>
          </div>

          {screenSize > 425 ? (
            <div className='icons algin-center-nav col'>
              <li><Logos isInstagram /></li>
              <li><Logos isLinkedin /></li>
            </div>
          ) : (
            <div className='iconsMobile'>
              <li><Logos isGithub /></li>
              <li><Logos isBehance /></li>
              <li><Logos isInstagram /></li>
              <li><Logos isLinkedin /></li>
            </div>
          )}
        </ul>
      </nav>
    </header>
  );
}
