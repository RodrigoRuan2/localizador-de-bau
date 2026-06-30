import { memo } from 'react'
import {
  GAME_UPDATES,
  GAME_UPDATE_SOURCE,
  GAME_UPDATES_CURATED_AT,
} from '../data/game-updates.js'
import '../styles/GameUpdates.css'

// Seção recolhível com as atualizações do JOGO (TBH), resumidas e traduzidas
// das notas oficiais da Steam. Mesmo padrão visual do changelog do app.
function GameUpdates() {
  return (
    <details className="game-updates">
      <summary className="game-updates__summary">🎮 Atualizações do jogo (TBH)</summary>

      <p className="game-updates__note">
        Resumos traduzidos das notas oficiais ·{' '}
        <a href={GAME_UPDATE_SOURCE} target="_blank" rel="noreferrer">
          fonte na Steam
        </a>{' '}
        · lista atualizada em {GAME_UPDATES_CURATED_AT}
      </p>

      <ol className="game-updates__list">
        {GAME_UPDATES.map((u) => (
          <li key={u.date + u.title} className="game-updates__entry">
            <div className="game-updates__head">
              <span className="game-updates__date">{u.date}</span>
              <strong className="game-updates__title">{u.title}</strong>
              {u.novo && <span className="game-updates__badge">novo</span>}
            </div>
            {u.intro && <p className="game-updates__intro">{u.intro}</p>}
            {u.items && (
              <ul className="game-updates__items">
                {u.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </details>
  )
}

// memo(): notas do jogo estáticas sem props — renderiza uma vez, não segue o relógio.
export default memo(GameUpdates)
