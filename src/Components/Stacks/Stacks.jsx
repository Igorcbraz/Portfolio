import { Logos } from '../Logos/Logos'

import Nodejs from '../../Images/nodejs.png'
import Reactjs from '../../Images/reactjs.png'
import Imagem3 from '../../Images/imagem3.webp'

import './stacks.css'

export function Stacks() {
  return (
    <div className='stacks' data-aos='zoom-out-up'>
      <div>
        <img src={Nodejs} alt='Primeira Imagem portfólio' />
        <span>
          <h3>Nodejs</h3>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem quidem consequatur,
            cum iure ut molestiae cupiditate maiores, vitae distinctio placeat ipsum
            magnam nulla laudantium alias saepe veniam ad asperiores! Officia!
          </p>
        </span>
      </div>
      <div>
        <img src={Reactjs} alt='Segunda Imagem portfólio' />
        <span>
          <h3>Nodejs</h3>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem quidem consequatur,
            cum iure ut molestiae cupiditate maiores, vitae distinctio placeat ipsum
            magnam nulla laudantium alias saepe veniam ad asperiores! Officia!
          </p>
        </span>
      </div>
      <div>
        <img id='img3' src={Imagem3} alt='Terceira Imagem portfólio' />
      </div>
      <div>
        <Logos isGithub githubColor='#E3AA5F' />
      </div>
    </div>
  )
}
