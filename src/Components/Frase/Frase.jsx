import { useEffect } from "react";
import Aos from 'aos';

import './frase.css'

export function Frase(props){
    useEffect(() => {
        Aos.refresh();
        Aos.init({duration: 1000});
      }, [])

    return(
        <>
            { !props.invertColors ? (
                <section className="frase-imagens">
                    <h1
                    data-aos="fade-down"
                    >
                    {props.frase} <span>{props.destaque}</span>
                    </h1>
                    {props.isFinal && (
                        <a href="https://www.instagram.com/igorcbrazdesign/" target="_blank" rel="noreferrer" data-aos="fade-down">
                            <button>Entre em Contato</button>
                        </a>
                    )}
                </section>
            ) : (
                <section className="frase-imagens">
                    <h1
                    data-aos="fade-down"
                    >
                     <span>{props.frase}</span> {props.destaque}
                    </h1>
                </section>
            )}
        </>
    );
}