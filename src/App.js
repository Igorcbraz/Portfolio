import { useEffect } from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import { Frase } from "./Components/Frase/Frase";
import { Portfolio } from "./Components/Portfolio/Portfolio";
import { Chat } from "./Components/Chat/Chat";

import Aos from 'aos';
import 'aos/dist/aos.css';

import './styles/index.css';

function App() {
  useEffect(() => {
    Aos.refresh();
    Aos.init({duration: 1000});  
  }, [])

  return (
    <div>
      <Chat/>
      <Navbar/>

      <section className="introducao" id="intro">
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

      <Frase frase="Muito além de apenas" destaque="Imagens"/>
      <Portfolio isImages/>
      <Frase frase="Muito além de apenas" destaque="Sites"/>
      <Portfolio isSites/>
      <Frase frase="Perguntas" destaque="Frequentes" invertColors/>

      <div className="list-questions">
        <button>Quais serviços você oferece ? 
        <svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 0C11.3647 0 11.7144 0.144866 11.9723 0.402728C12.2301 0.660591 12.375 1.01033 12.375 1.375V9.625H20.625C20.9897 9.625 21.3394 9.76987 21.5973 10.0277C21.8551 10.2856 22 10.6353 22 11C22 11.3647 21.8551 11.7144 21.5973 11.9723C21.3394 12.2301 20.9897 12.375 20.625 12.375H12.375V20.625C12.375 20.9897 12.2301 21.3394 11.9723 21.5973C11.7144 21.8551 11.3647 22 11 22C10.6353 22 10.2856 21.8551 10.0277 21.5973C9.76987 21.3394 9.625 20.9897 9.625 20.625V12.375H1.375C1.01033 12.375 0.660591 12.2301 0.402728 11.9723C0.144866 11.7144 0 11.3647 0 11C0 10.6353 0.144866 10.2856 0.402728 10.0277C0.660591 9.76987 1.01033 9.625 1.375 9.625H9.625V1.375C9.625 1.01033 9.76987 0.660591 10.0277 0.402728C10.2856 0.144866 10.6353 0 11 0V0Z" fill="#F3F3F3"/>
        </svg>
        </button>
      </div>

    </div>
  );
}

export default App;
