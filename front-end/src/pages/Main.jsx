import { useState, useEffect } from 'react';
import produtosServices from '../services/produtos'


const Main = () => {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        produtosServices.getAll().then((produtos) => setProdutos(produtos));
    }, [])

    console.log(produtos)
    return (
        <main>
            <article className="menu">
                <button>CLIENTES</button>
                <button>PRODUTOS</button>
            </article>
            <div>
                <ul>{produtos.map(produto => {
                    return (
                        <li className='produto' key={produto.id}>
                            <img width='100px' src='../../public/1693181735531-BERMUD.jpg' alt={produto.descricao} />
                            <div className='descricao'>
                                <div>{produto.nome}</div>
                                <div>{produto.categoria}</div>
                                <div>{produto.descricao}</div>
                                <div>Preço: {produto.preco}</div>
                            </div>
                        </li>
                    )
                })}
                </ul>
            </div>
        </main>
    )
}


export default Main;