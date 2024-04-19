import React from 'react'

import { Navbar } from '../Components/Navbar'
import { TextSection } from '../Components/TextSection'
import { VerticalTab } from '../Components/VerticalTab'
import { GithubLogo } from '../Components/Logo/GithubLogo'

import { Links } from '../constants/Links'
import { Experiences } from '../constants/Experiences'

import AboutMe from '../Images/aboutMe.jpg'
import Site1 from '../Images/site1.png'
import Site2 from '../Images/site2.png'
import Site3 from '../Images/site3.png'

import '../styles/home.css'

export function Home() {
  return (
    <div>
      <Navbar />
      <TextSection
        title='De'
        subtitle='veloper'
        highlight='signer'
        invertTextColors
        introduction
        id='home'
      />
      <section className='aboutMe' id='sobre'>
        <img src={AboutMe} alt='Foto para o sobre mim' data-aos='slide-up' />

        <div data-aos='slide-up'>
          <span id='aboutMeIntroduction'>
            Quem sou
          </span>
          <h2>
            <span>Igor</span>
            Costa Braz
          </h2>
          <h3>
            - Fullstack Developer
          </h3>
          <p>
            Como desenvolvedor de sistemas com 2 anos de experiência, sou especializado em Javascript e tenho habilidades em desenvolvimento Full Stack com ênfase em NodeJS, ReactJS e VueJS. Meu conhecimento também inclui bancos de dados relacionais e não-relacionais, bem como o controle de versionamento com Git.
          </p>
          <p>
            Estou comprometido em desenvolver soluções de alta qualidade e disponibilidade, seguindo práticas e melhores padrões de arquitetura, e estou sempre buscando novas maneiras de aprimorar meu trabalho.
          </p>
          <p>
            Disposto a aprender novas tecnologias e metodologias, bem como a compartilhar meu conhecimento com colegas de equipe. Tenho experiência em trabalhar em equipe para acompanhar correções e melhorias contínuas, além de ferramentas em apoio à gestão de projetos e produtos, como Github, Jira e Confluence.
          </p>
          <a
            href={Links.curriculum}
            target='_blank'
            rel='noopener noreferrer'
          >
            Veja meu currículo
          </a>
        </div>
      </section>
      <section>
        <TextSection title='Minhas' subtitle='Experiências' id='experiencias' />
        <VerticalTab experiences={Experiences} />
      </section>
      <section>
        <TextSection title='Destaque de' subtitle='Projetos' id='projetos' />
        <div className='portfolio' data-aos='zoom-out-down'>
          <a
            href={Links.projects[0]}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={Site1} alt='Imagem do website par ao templo enkoji' />
          </a>
          <a
            href={Links.projects[1]}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={Site2} alt='Início da plataforma Gitfest' />
          </a>
          <a
            href={Links.projects[2]}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={Site3} alt='Site para controle de finanças, dtmoney' />
          </a>
          <div>
            <GithubLogo color='#E3AA5F' />
          </div>
        </div>
      </section>
      <TextSection title='Vamos fazer um projeto' subtitle='Juntos ?' isFinal />
    </div>
  )
}
