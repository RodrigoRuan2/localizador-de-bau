import { memo, useState } from 'react'
import {
  MARKET_TABS,
  MARKET_SOURCE,
  MARKET_COLLECTED_AT,
  MARKET_CURRENCY,
} from '../data/market.js'
import '../styles/MarketTop.css'

// Seção PRINCIPAL: o Mercado Steam do TBH, em ABAS (Mais vendidos, Materiais,
// Acessórios, Equipamentos, Vale a pena vender). Os dados são coletados fora do
// navegador por scripts/coletar-mercado.mjs (npm run mercado) e só LIDOS aqui.

// CDN das imagens dos itens. O JSON guarda só o CAMINHO do ícone (dado cru);
// aqui montamos a URL completa. "/64fx64f" pede uma versão já redimensionada.
const STEAM_IMG = 'https://community.cloudflare.steamstatic.com/economy/image'
const imagemDoItem = (icone) => (icone ? `${STEAM_IMG}/${icone}/64fx64f` : null)

function MarketTop() {
  // Aba ativa (começa na primeira, "Mais vendidos"). É estado de UI puro — com
  // o memo() lá embaixo, só re-renderiza ao trocar de aba, não a cada tique
  // do relógio dos cronômetros.
  const [abaAtiva, setAbaAtiva] = useState(MARKET_TABS[0].id)
  const aba = MARKET_TABS.find((t) => t.id === abaAtiva) ?? MARKET_TABS[0]

  return (
    <section className="market" aria-labelledby="market-titulo">
      <h2 id="market-titulo" className="market__title">
        💰 Mercado (TBH)
      </h2>

      <p className="market__note">
        Volume e preço das últimas 24h ·{' '}
        <a href={MARKET_SOURCE} target="_blank" rel="noreferrer">
          Mercado na Steam
        </a>{' '}
        · coletado em {MARKET_COLLECTED_AT}
      </p>

      <div className="market__tabs" role="tablist" aria-label="Categorias do mercado">
        {MARKET_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === abaAtiva}
            className={t.id === abaAtiva ? 'market__tab market__tab--ativa' : 'market__tab'}
            onClick={() => setAbaAtiva(t.id)}
          >
            {t.titulo}
          </button>
        ))}
      </div>

      {aba.itens.length === 0 ? (
        <p className="market__vazio">
          Nenhuma venda registrada nesta categoria nas últimas 24h.
        </p>
      ) : (
        <ol className="market__list">
          {aba.itens.map((item, i) => {
            const img = imagemDoItem(item.icone)
            return (
              <li key={item.hash} className="market__row">
                <span className="market__rank">{i + 1}</span>

                <span className="market__thumb">
                  {img ? (
                    // alt="" de propósito: o nome do item já está ao lado.
                    <img className="market__img" src={img} alt="" width="40" height="40" />
                  ) : (
                    <span className="market__img market__img--vazio" aria-hidden="true">
                      📦
                    </span>
                  )}
                </span>

                <span className="market__name">{item.nome}</span>

                <span className="market__price">
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
      )}

      <p className="market__legend">
        {aba.id === 'vale-a-pena'
          ? `Os itens mais caros que de fato venderam nas últimas 24h — quem tem preço alto E procura. Preço em ${MARKET_CURRENCY}.`
          : `Ordenado pelo volume vendido em 24h. Preço em ${MARKET_CURRENCY}. Muito volume ≠ muito valor: materiais vendem em quantidade por centavos; itens raros valem mais, mas vendem pouco.`}
      </p>
    </section>
  )
}

export default memo(MarketTop)
