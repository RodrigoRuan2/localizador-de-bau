import { memo } from 'react'
import { UPDATES } from '../data/updates.js'
import '../styles/Updates.css'

// Seção recolhível de novidades (changelog). Lista as atualizações do app,
// da mais recente para a mais antiga. Usa <details>/<summary> — o acordeão
// nativo do HTML — igual ao Guia de fases e ao Planejador de rota.
function Updates() {
  return (
    <details className="updates">
      <summary className="updates__summary">📢 Atualizações</summary>

      <ol className="updates__list">
        {UPDATES.map((u) => (
          <li key={u.date + u.title} className="updates__entry">
            <div className="updates__head">
              <span className="updates__date">{u.date}</span>
              <strong className="updates__title">{u.title}</strong>
              {u.novo && <span className="updates__badge">novo</span>}
            </div>
            <ul className="updates__items">
              {u.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </details>
  )
}

// memo(): changelog estático sem props — não precisa redesenhar com o relógio.
export default memo(Updates)
