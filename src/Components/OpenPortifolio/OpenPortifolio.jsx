export function OpenPortifolio({image, link, secondButton, secondLink, isVideo, srcVideo}){
    return(
        <div className="portifolio-open">
            <div>
                <a href={link} target="_blank" rel="noreferrer">
                    <button>Acessar Projeto</button>
                </a>
                                
                { secondButton && (
                    <a href={secondLink} target="_blank" rel="noreferrer">
                        <button>Acessar Repositório</button>
                    </a>
                )}
            </div>

            { !isVideo ? (
                <img src={image} alt="Imagem completa do portifólio"/>    
            ) : (
                <video controls>
                    <source src={srcVideo} type="video/mp4"></source>
                    Your browser does not support the video tag.
                </video>
            )}          
        </div>
    );
}