import {
  META_HEROIS,
  META_TIMES,
  META_PET,
  META_FARM,
  META_SOURCE,
  META_CURATED_AT,
} from '../data/meta.js'
import '../styles/Meta.css'

// Seção recolhível com o meta atual do jogo (heróis, time, pet, farm).
// Conteúdo curado/traduzido de guias da comunidade — mesmo padrão das
// novidades do jogo (fonte + data de curadoria).
function Meta() {
  return (
    <details className="meta">
      <summary className="meta__summary">⚔️ Estratégia & meta (TBH)</summary>

      <p className="meta__note">
        Curado e traduzido de guias da comunidade ·{' '}
        <a href={META_SOURCE} target="_blank" rel="noreferrer">
          fonte
        </a>{' '}
        · atualizado em {META_CURATED_AT}
      </p>

      <h3 className="meta__titulo">Heróis em destaque</h3>
      <ul className="meta__lista">
        {META_HEROIS.map((h) => (
          <li key={h.nome} className="meta__heroi">
            <span className={`meta__tier meta__tier--${h.tier.toLowerCase()}`}>{h.tier}</span>
            <span>
              <strong>{h.nome}</strong> — {h.papel}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="meta__titulo">Melhores times</h3>
      <ul className="meta__lista">
        {META_TIMES.map((t) => (
          <li key={t.nome} className="meta__time">
            <strong>{t.nome}:</strong> {t.comp}
            <span className="meta__obs"> — {t.obs}</span>
          </li>
        ))}
      </ul>

      <h3 className="meta__titulo">Pet</h3>
      <p className="meta__pet">🐉 {META_PET}</p>

      <h3 className="meta__titulo">Dicas de farm</h3>
      <ul className="meta__lista">
        {META_FARM.map((dica) => (
          <li key={dica}>{dica}</li>
        ))}
      </ul>
    </details>
  )
}

export default Meta
