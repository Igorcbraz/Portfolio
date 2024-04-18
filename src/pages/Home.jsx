import React from 'react'

import { Navbar } from '../Components/Navbar'
import { TextSection } from '../Components/TextSection'
import { Portfolio } from '../Components/Portfolio'
import { Stepper } from '../Components/Stepper'

import AboutMe from '../Images/aboutMe.jpg'

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
      />
      <section className='aboutMe' id='sobre'>
        <img src={AboutMe} alt='Foto para o sobre mim' data-aos='slide-up' />

        <div data-aos='slide-up'>
          <h2>
            <span>Sobre</span>
            mim
          </h2>
          <p>
            Como desenvolvedor de sistemas com 2 anos de experiência, sou especializado em Javascript e tenho habilidades em desenvolvimento Full Stack com ênfase em NodeJS, ReactJS e VueJS. Meu conhecimento também inclui bancos de dados relacionais e não-relacionais, bem como o controle de versionamento com Git.
          </p>
          <p>
            Estou comprometido em desenvolver soluções de alta qualidade e disponibilidade, seguindo práticas e melhores padrões de arquitetura, e estou sempre buscando novas maneiras de aprimorar meu trabalho.
          </p>
          <p>
            Disposto a aprender novas tecnologias e metodologias, bem como a compartilhar meu conhecimento com colegas de equipe. Tenho experiência em trabalhar em equipe para acompanhar correções e melhorias contínuas, além de ferramentas em apoio à gestão de projetos e produtos, como Github, Jira e Confluence.
          </p>
        </div>
      </section>
      <section id='experiencias'>
        <TextSection title='Minhas' subtitle='Experiências' />
        <div className='experience'>
          <div className='containerExp'>
            <Stepper status='completed'>
              <span className='headerStep'>
                <h3>Full Stack Software Developer</h3>
                <p className='company'>Grupo Raotes</p>
              </span>
              <span>
                <p className='caption'>Tempo Integral</p>
                <p className='caption'>nov de 2022 - Atualmente</p>
              </span>
              <p>
                Desempenho o desenvolvimento do sistema WebGR, software de gestão empresarial, auxilia nas atividades de visitas técnicas, comerciais e vendas, da mesma forma, em fluxos de atendimento. Lidando com as seguintes atribuições:
              </p>
              <ul>
                <li>Desenvolvimento FrontEnd (Vuejs, Quasarjs)</li>
                <li>Desenvolvimento BackEnd (NodeJS, Sequelize)</li>
                <li>Desenvolvimento de app híbrido (QuasarJs, React Native)</li>
                <li>Banco de dados (PostgreSQL)</li>
                <li>Serviços em nuvem (Digital Ocean, Central Server e AWS)</li>
                <li>Ferramentas gestão de projetos (Jira e Confluence)</li>
                <li>Testes Unitários ( Jest )</li>
                <li>Versionamento (Git e Github)</li>
                <li>Integração com sistemas de terceiros</li>
              </ul>
            </Stepper>
            <Stepper status='active'>
              <span className='headerStep'>
                <h3>Desenvolvedor Freelancer</h3>
                <p className='company'>Grupo Raotes</p>
              </span>
              <span>
                <p className='caption'>Freelancer</p>
                <p className='caption'>ago de 2022 - out de 2022</p>
              </span>
              <p>
                Desenvolvimento do projeto, gerador de propostas de serviço, para o sistema WebGR. Objetivo de atender clientes prestadores de serviços, realizando o fluxo completo de vendas iniciado na criação da proposta até a venda efetiva.
              </p>
              <p>Realizo tais tarefas:</p>
              <ul>
                <li>API REST</li>
                <li>Versionamento de código com Git e GitHub</li>
                <li>Desenvolvimento Frontend com Vue e Quasar lidando com boas práticas</li>
                <li>Desenvolvimento Backend com NodeJs e ORM Sequelize</li>
                <li>Mecanismo de criação de documentos Word totalmente dinâmicos (DocxJs)</li>
              </ul>
            </Stepper>
            <Stepper />
          </div>
        </div>
      </section>
      <section id='projetos'>
        <TextSection title='Destaque de' subtitle='Projetos' />
        <Portfolio isSites />
      </section>
      <TextSection title='Vamos fazer um projeto' subtitle='Juntos ?' isFinal />
    </div>
  )
}
