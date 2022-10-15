import Modal from 'react-modal'
import emailjs from 'emailjs-com'

import { useState } from 'react'
import { Logos } from '../Logos/Logos'

import './listQuestion.css'

export function ListQuestions() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [numQuestion, setNumQuestion] = useState(0)

  function sendQuestion(event) {
    event.preventDefault()

    emailjs.sendForm('portifolioEmail', 'template_enrcnle', event.target, 'user_iuW0qAeAvjfUaxmAOFfHT')
      .then(() => {
        alert('Pergunta enviada com sucesso ! Muito Obrigado :)')
      }, (error) => {
        alert(error.message)
      })

    event.target.reset()
  }

  function openQuestion(questionNum) {
    setModalIsOpen(true)
    setNumQuestion(questionNum)
  }

  return (
    <div className='list-questions row d-flex justify-content-center' data-aos='zoom-out-up'>
      <div className='questions mb-5 col-12 col-sm-6'>
        <button type='button' onClick={() => openQuestion(1)}>
          Quais serviços você oferece ?
          <Logos isQuestion />
        </button>
        <button type='button' onClick={() => openQuestion(2)}>
          Qual o valor dos projetos ?
          <Logos isQuestion />
        </button>
        <button type='button' onClick={() => openQuestion(3)}>
          Como funciona a criação dos projetos ?
          <Logos isQuestion />
        </button>
        <button type='button' onClick={() => openQuestion(4)}>
          Como funciona o pagamento ?
          <Logos isQuestion />
        </button>
      </div>

      <div className='duvida col-12 col-sm-6'>
        <form className='enviar-duvida' onSubmit={sendQuestion}>
          <div className='header'>
            <div>
              <h3>Ainda com dúvidas ?</h3>
              <p>Envie sua pergunta</p>
            </div>
            <svg xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink' ariaHidden='true' role='img' width='3em' height='3em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 16 16'>
              <g fill='#fee7c9'><path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25c.09-.656.54-1.134 1.342-1.134c.686 0 1.314.343 1.314 1.168c0 .635-.374.927-.965 1.371c-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486c.609-.463 1.244-.977 1.244-2.056c0-1.511-1.276-2.241-2.673-2.241c-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927c0-.552-.42-.94-1.029-.94c-.584 0-1.009.388-1.009.94c0 .533.425.927 1.01.927z' /></g>
            </svg>
          </div>

          <input type='text' placeholder='Nome do instagram para a resposta' name='name' />
          <textarea rows='5' name='message' placeholder='Conteúdo da dúvida' />
          <button type='submit'>Enviar</button>
        </form>
      </div>

      <div className='modalQuestionDiv'>
        <Modal
          isOpen={modalIsOpen}
          preventScroll
          aria={{
            labelledby: 'heading',
            describedby: 'full_description',
          }}
          id='modalQuestion'
        >
          {numQuestion === 1 ? (
            <button type='button' onClick={() => setModalIsOpen(false)}>
              <p>
                No mundo do design trabalho com artes voltadas para streamers
                (overlays, distintivos, facecam, banners...) e com interface para websites.
                Logo no mundo da programação sigo com o desenvolvimento de sites.
                Sendo eles landing pages com html, css e javascript ou sites no modelo
                SPA (Single Page Application) com reactJs.
              </p>
              <Logos isClose />
            </button>
          ) : numQuestion === 2 ? (
            <button type='button' onClick={() => setModalIsOpen(false)}>
              <p>
                Para formular o valor final é necessário saber qual a dificuldade
                e nível de tempo disponível para realização do projeto, por tanto,
                para fazer o orçamento é necessário somente entrar em contato,
                principalmente pelo instagram.
              </p>
              <Logos isClose />
            </button>
          ) : numQuestion === 3 ? (
            <button type='button' onClick={() => setModalIsOpen(false)}>
              <p>
                Após as ideias dos projeto forem transparecidas de maneira causal e descontraída,
                iremos torna-las objetivas e claras para ambas as partes.
                Com a confirmação do cliente que  as informações estão corretas seguimos para
                formulação do preço. Neste ponto, para o andamento do projeto é necessário o
                pagamento de 30% do valor final, como ponto de segurança para ambos,
                com o sucesso na etapa anterior o desenvolvimento do projeto é iniciado e
                atualizações constantes sobre ele serão enviadas para o cliente.
              </p>
              <Logos isClose />
            </button>
          ) : (
            <button type='button' onClick={() => setModalIsOpen(false)}>
              <p>
                O pagamento pode ser realizado via Pix, Ted, Paypal ou Mercado Pago.
              </p>
              <Logos isClose />
            </button>
          )}
        </Modal>
      </div>
    </div>
  )
}
