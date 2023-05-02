import Aos from 'aos'

import { useEffect } from 'react'
import { Navbar } from './Components/Navbar/Navbar'
import { Frase } from './Components/Frase/Frase'
import { Portfolio } from './Components/Portfolio/Portfolio'
// import { ListQuestions } from './Components/ListQuestions/ListQuestions'
import { Stepper } from './Components/Stepper/Stepper'

import AboutMe from './Images/aboutMe.jpg'

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
            Como desenvolvedor de sistemas com 1 ano de experiência, sou especializado em Javascript e tenho habilidades em desenvolvimento Full Stack com ênfase em NodeJS, ReactJS e VueJS. Meu conhecimento também inclui bancos de dados relacionais e não-relacionais, bem como o controle de versionamento com Git.
          </p>
          <p>
            Estou comprometido em desenvolver soluções de alta qualidade e disponibilidade, seguindo práticas e melhores padrões de arquitetura, e estou sempre buscando novas maneiras de aprimorar meu trabalho.
          </p>
          <p>
            Sempre disposto a aprender novas tecnologias e metodologias, bem como a compartilhar meu conhecimento com colegas de equipe. Tenho experiência em trabalhar em equipe para acompanhar correções e melhorias contínuas, bem como em ferramentas de apoio à gestão de projetos e produtos, como o Github.
          </p>
        </div>
      </section>

      <section id='experiencias'>
        <Frase frase='Minhas' destaque='Experiências' />
        <div className='experience'>
          <div className='containerExp'>
            <Stepper status='completed'>
              <span className='headerStep'>
                <h3>Full Stack Software Engineer</h3>
                <p className='company'>Grupo Raotes</p>
              </span>
              <span>
                <p className='caption'>out de 2022 - Atualmente</p>
              </span>
              <p>
                Atuo na resolução de problemas por meio da programação, com a oportunidade de conhecer arquiteturas e ciclo de vida de um software profissional, assim como habilidades de comunicação em meio ao time e tratamento na relação de prazos e entregas.
              </p>
            </Stepper>
            <Stepper status='active'>
              <span className='headerStep'>
                <h3>Estagiário de desenvolvimento</h3>
                <p className='company'>Grupo Raotes</p>
              </span>
              <span>
                <p className='caption'>ago de 2022 - out de 2022</p>
              </span>
              <p>
                Atuo na resolução de problemas por meio da programação, com a oportunidade de conhecer arquiteturas e ciclo de vida de um software profissional, assim como habilidades de comunicação em meio ao time e tratamento na relação de prazos e entregas.
              </p>
            </Stepper>
            <Stepper />
          </div>
        </div>
      </section>

      <section id='projetos'>
        <Frase frase='Destaque de' destaque='Projetos' />
        <Portfolio isSites />
      </section>

      {/* <section id='tecnologias'>
        <Frase frase='Principais' destaque='Tecnologias' />
        <ListQuestions />
      </section> */}

      <Frase frase='Vamos fazer um projeto' destaque='Juntos ?' isFinal />
    </>
  )
}

export default App
