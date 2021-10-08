import { Logos } from '../Logos/Logos';
import Logo from '../../Images/Logo.png';

import './navbar.css'


export function Navbar(){
    return(
        <header>
            <nav>
                <ul>

                <div class="icons algin-center-nav">
                    <li><Logos isGithub/></li>
                    <li><Logos isBehance/></li>
                </div>
                    
                    <div className="algin-center-nav">
                        <div className="algin-center-nav text-nav">
                            <li>
                                <a href="#perguntas">Perguntas</a>
                            </li>
                            <li>
                                <a href="#sobre">Sobre</a>
                            </li>
                        </div>
                        <a href="#intro">
                            <img src={Logo} id="logo" width="128px" height="123px" alt="Logo igorcbraz design"/>
                        </a>
                        <div className="algin-center-nav text-nav">
                            <li>
                                <a href="#imagens">Design</a>
                            </li>
                            <li>
                                <a href="#sites">Programação</a>
                            </li>
                        </div>
                    </div>
                    
                <div class="icons-nav algin-center-nav">
                    <li><Logos isInstagram/></li>
                    <li><Logos isLinkedin/></li>
                </div>

                </ul>
            </nav>
        </header>
    );
}