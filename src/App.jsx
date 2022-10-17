import Aos from 'aos'

import { useEffect } from 'react'
import { Navbar } from './Components/Navbar/Navbar'
import { Frase } from './Components/Frase/Frase'
import { Portfolio } from './Components/Portfolio/Portfolio'
import { Stacks } from './Components/Stacks/Stacks'

import AboutMe from './Images/aboutMe.webp'

import './styles/index.css'

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000 })
  }, [])

  return (
    <>
      {/* <Chat/> */}
      <Navbar />

      <Frase
        frase='De'
        destaque='veloper'
        secondDestaque='signer'
        invertColors
        intro
      />

      <section className='aboutMe' id='sobre'>
        <img src={AboutMe} alt='Foto para o sobre mim' data-aos='slide-up' />

        <div data-aos='slide-up'>
          <h2>
            <span>Sobre</span>
            {' '}
            mim
          </h2>
          <p>
            Olá, me chamo Igor Braz. Estou habituado com o desenvolvimento Javascript,
            com suas bibliotecas e frameworks, sou Técnico em
            Desenvolvimentos de Sistemas e almejo trazer
            soluções desafiadoras e eficazes ao mercado de
            trabalho com a base de conhecimento que já adquirir e procuro ampliar.
          </p>
          <p>
            Realizava projetos como designer freelancer, com minha minha página
            {' '}
            <a href='https://www.instagram.com/igorcbrazdesign/' target='_blank' rel='noreferrer'>IgorcbrazDesign</a>
            {' '}
            no Instagram.
          </p>
        </div>
      </section>

      <section id='sites'>
        <Frase frase='Muito além de apenas' destaque='Sites' />
        <Portfolio isSites />
      </section>

      <section id='imagens'>
        <Frase frase='Muito além de apenas' destaque='Imagens' />
        <Portfolio isImages />
      </section>

      <section id='perguntas'>
        <Frase frase='Tecnologias' destaque='& Stacks' invertColors />
        <Stacks />
      </section>

      <Frase frase='Vamos fazer um projeto' destaque='Juntos ?' isFinal />
    </>
  )
}

export default App
