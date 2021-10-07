import { useEffect } from "react";
import { Navbar } from "./Components/Navbar/Navbar";

import Aos from 'aos';
import 'aos/dist/aos.css';

import './styles/index.css'

function App() {
  useEffect(() => {
    Aos.refresh();
    Aos.init({duration: 1000});
  }, [])

  return (
    <div>
      <Navbar/>
      <section className="introducao">
        <h1 
          id="developer" 
          data-aos="slide-right"
          //className="animate__animated animate__backInLeft"
        >
          <span>De</span>veloper
        </h1>
        <h1 
          id="design"
          data-aos="slide-left"
          // className="animate__animated animate__backInRight"
        >
          <span>De</span>signer
        </h1>
      </section>
    
      <section className="frase-imagens">
        <h1
          data-aos="fade-down"
        >
          Muito além de apenas <span>Imagens</span>
        </h1>
      </section>
    </div>
  );
}

export default App;
