import { useEffect } from 'react';

import Imagem1 from '../../Images/imagem1.png';
import Imagem2 from '../../Images/imagem2.png';
import Imagem3 from '../../Images/imagem3.png';
import Imagem4 from '../../Images/imagem4.png';

import Site1 from '../../Images/site1.png';
import Site2 from '../../Images/site2.png';
import Site3 from '../../Images/site3.png';

import Aos from 'aos';

import './portfolio.css';


export function Portfolio(props){
    useEffect(() => {
        Aos.refresh();
        Aos.init({duration: 1000});
      }, [])

    return(
        <>
            { props.isImages && (
                <div className="portfolio" data-aos="zoom-out-up">
                    <img src={Imagem1} alt="Primeira Imagem portfólio"/>
                    <img src={Imagem2} alt="Segunda Imagem portfólio"/>
                    <img src={Imagem1} alt="Terceira Imagem portfólio"/>
                    <img src={Imagem4} alt="Quarta Imagem portfólio"/>
                </div>
            )}
            { props.isSites && (
                <div className="portfolio" data-aos="zoom-out-down">
                    <img src={Site1} alt="Primeira Imagem sites"/>
                    <img src={Site2} alt="Segunda Imagem sites"/>
                    <img src={Site3} alt="Terceira Imagem sites"/>
                    <div></div>
                </div>
            )}
        </>
    );      
}