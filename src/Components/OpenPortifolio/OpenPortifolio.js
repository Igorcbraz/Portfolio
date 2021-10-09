export function OpenPortifolio({image}){
    return(
        <div className="portifolio-open">
            <div>
                <a href="https://www.behance.net/gallery/113447237/Overlay-Igorcbraz_Design" target="_blank" rel="noreferrer">
                    <button>Acessar Projeto</button>
                </a>
            </div>

            <img src={image} alt="Imagem completa do portifólio"/>                   
        </div>
    );
}