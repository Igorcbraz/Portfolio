import Aos from 'aos';

import { useEffect } from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import { Frase } from "./Components/Frase/Frase";
import { Portfolio } from "./Components/Portfolio/Portfolio";
import { Chat } from "./Components/Chat/Chat";
import { ListQuestions } from './Components/ListQuestions/ListQuestions';

import AboutMe from './Images/aboutMe.jpeg'
import Logo from './Images/Logo.png';

import './styles/index.css';

function App() {
  useEffect(() => {
    Aos.refresh();
    Aos.init({duration: 1000});  
  }, [])

  return (
    <div>
      {/* <Chat/> */}
      <Navbar/>

      <section className="introducao" id="intro">
        <span className="logoMobile"></span>
        <h1
          id="developer"
          data-aos="slide-right"
        >
          <span>De</span>veloper
        </h1>
        <h1
          id="design"
          data-aos="slide-left"
        >
          <span>De</span>signer
        </h1>
      </section>

      <section className="aboutMe" id="sobre">
        <img src={AboutMe} alt="Foto para o sobre mim" data-aos="slide-up"/>

        <div data-aos="slide-up">
          <h2><span>Sobre</span> mim</h2>
          <p>Olá, me chamo Igor Braz. Realizo projetos como designer freelancer, desde o começo do ano de 2020, com minha minha página <a href="https://www.instagram.com/igorcbrazdesign/" target="_blank" rel="noreferrer">IgorcbrazDesign</a> no instagram. Antes com foco apenas no mundo do design, mas agora sigo estudando e aplicando meus conhecimentos no mundo da programação, com familiaridades no frontend (Html, Css, ReactJs...) e buscando ampliar as barreiras em busca do desenvolvimento fullstack</p>
        </div>    
      </section>

      <section id="imagens">
        <Frase frase="Muito além de apenas" destaque="Imagens"/>
        <Portfolio isImages/>
      </section>

      <section id="sites">
        <Frase frase="Muito além de apenas" destaque="Sites"/>
        <Portfolio isSites/>
      </section>

      <section id="perguntas">
        <Frase frase="Perguntas" destaque="Frequentes" invertColors/>
        <ListQuestions/>
      </section>

      <Frase frase="Vamos fazer um projeto" destaque="Juntos ?" isFinal/>
    </div>
  );
}

export default App;
