import { memo } from 'react'
import {
  MARKET_TOP,
  MARKET_SOURCE,
  MARKET_COLLECTED_AT,
  MARKET_CURRENCY,
} from '../data/market.js'
import '../styles/MarketTop.css'

// Seção PRINCIPAL: ranking dos itens mais vendidos do Mercado Steam do TBH.
// Os dados são coletados fora do navegador por scripts/coletar-mercado.mjs
// (npm run mercado) e só LIDOS aqui — o componente é "burro": recebe a lista
// pronta e desenha.
//
// Envolto em memo() (ver export no fim): como não recebe props, ele só
// renderiza UMA vez. Sem isso, o relógio do App (que muda a cada 0,5s)
// forçaria estas 15 imagens a redesenhar à toa duas vezes por segundo.

// A CDN de imagens dos itens da Steam. O JSON guarda só o CAMINHO do ícone
// (dado cru, intocado); aqui na camada de apresentação montamos a URL completa.
// "/64fx64f" pede uma versão já redimensionada (mais leve) à própria Steam.
const STEAM_IMG = 'https://community.cloudflare.steamstatic.com/economy/image'
const imagemDoItem = (icone) => (icone ? `${STEAM_IMG}/${icone}/64fx64f` : null)

function MarketTop() {
  return (
    <section className="market" aria-labelledby="market-titulo">
      <h2 id="market-titulo" className="market__title">
        💰 Mais vendidos no Mercado
      </h2>

      <p className="market__note">
        Volume e preço das últimas 24h ·{' '}
        <a href={MARKET_SOURCE} target="_blank" rel="noreferrer">
          Mercado na Steam
        </a>{' '}
        · coletado em {MARKET_COLLECTED_AT}
      </p>

      <ol className="market__list">
        {MARKET_TOP.map((item, i) => {
          const img = imagemDoItem(item.icone)
          return (
            <li key={item.hash} className="market__row">
              <span className="market__rank">{i + 1}</span>

              <span className="market__thumb">
                {img ? (
                  // alt="" de propósito: o nome do item já está ao lado, então a
                  // imagem é decorativa e não precisa ser lida pelo leitor de tela.
                  <img
                    className="market__img"
                    src={img}
                    alt=""
                    width="40"
                    height="40"
                  />
                ) : (
                  <span className="market__img market__img--vazio" aria-hidden="true">
                    📦
                  </span>
                )}
              </span>

              <span className="market__name">{item.nome}</span>

              <span className="market__price">
                {/* Preferimos o preço mediano (média das vendas recentes). Se o
                    item não vendeu o bastante, a Steam não calcula a mediana —
                    aí caímos no menor preço à venda. */}
                {item.precoMediano ?? item.menorPreco ?? '—'}
              </span>

              <span className="market__volume">
                {item.volume24h > 0 ? (
                  <>
                    {item.volume24h.toLocaleString('pt-BR')}
                    <span className="market__volume-label"> vendas</span>
                  </>
                ) : (
                  <span className="market__volume-zero">sem vendas 24h</span>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      <p className="market__legend">
        Ordenado pelo volume vendido em 24h. Preço em {MARKET_CURRENCY}. Muito volume
        ≠ muito valor: materiais vendem em quantidade por centavos; itens raros valem
        mais, mas vendem pouco.
      </p>
    </section>
  )
}

export default memo(MarketTop)
