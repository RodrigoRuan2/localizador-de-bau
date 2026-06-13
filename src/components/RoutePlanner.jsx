import { useState } from 'react'
import { CHEST_LEVELS, stagesForLevel, stageName, difficultyName } from '../utils/stages.js'
import { averageDropInterval } from '../utils/stats.js'
import { formatDuration } from '../utils/time.js'
import '../styles/RoutePlanner.css'

// Planejador de rota: o jogador escolhe quais NÍVEIS de baú quer farmar
// e o app monta a rotação, sugerindo a melhor fase de cada um.
//
// "Melhor fase" = maior chance de drop; em caso de empate, a de inimigos
// mais fracos (clear mais rápido). O jogo não expõe o tempo de clear, então
// usamos o nível dos inimigos como proxy de velocidade — honestidade > número
// inventado.
function RoutePlanner({ dropHistory, defaultMin, onCreateRoute }) {
  const [selected, setSelected] = useState([])

  // Liga/desliga um nível na seleção. Repare que NÃO mutamos o array:
  // criamos um novo a cada clique (filter/spread). Mutar o estado direto
  // é o erro nº 1 de quem começa em React — o React não "vê" a mudança.
  function toggle(level) {
    setSelected((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  // A rota é estado DERIVADO: recalculada a cada render a partir da seleção.
  // Ordenada do clear mais rápido (inimigos fracos) para o mais lento.
  const route = selected
    .map((level) => {
      const stages = stagesForLevel(level)
      const best = stages[0] // maior % de drop (empate → inimigo mais fraco)
      const fastest = [...stages].sort((a, b) => a.enemy_level - b.enemy_level)[0]
      const avg = averageDropInterval(dropHistory[level])
      return { level, best, fastest, avg }
    })
    .sort((a, b) => a.best.enemy_level - b.best.enemy_level)

  return (
    <details className="route-planner">
      <summary className="route-planner__summary">🗺️ Planejador de rota</summary>

      <p className="route-planner__hint">
        Escolha os níveis de baú que quer farmar. O app sugere a melhor fase de cada um (maior
        chance de drop e clear mais rápido) e monta a rotação.
      </p>

      <div className="route-planner__levels">
        {CHEST_LEVELS.map((lv) => (
          <button
            key={lv}
            type="button"
            className={
              selected.includes(lv)
                ? 'route-planner__chip route-planner__chip--on'
                : 'route-planner__chip'
            }
            onClick={() => toggle(lv)}
            aria-pressed={selected.includes(lv)}
          >
            Lv {lv}
          </button>
        ))}
      </div>

      {route.length > 0 && (
        <>
          <ol className="route-planner__route">
            {route.map((item, index) => (
              <li key={item.level} className="route-planner__step">
                <span className="route-planner__order">{index + 1}</span>
                <div className="route-planner__step-body">
                  <strong>Baú Lv {item.level}</strong> → {stageName(item.best)}
                  <span className="route-planner__meta">
                    {difficultyName(item.best)} A{item.best.act}-{item.best.stage} · drop{' '}
                    {item.best.boss_chest_drop_percent}% · inimigos Lv {item.best.enemy_level}
                  </span>
                  {item.avg && (
                    <span className="route-planner__avg">
                      ⏱ seu cooldown real: ~{formatDuration(item.avg.avgMs)} ({item.avg.samples}{' '}
                      {item.avg.samples === 1 ? 'intervalo' : 'intervalos'})
                    </span>
                  )}
                  {item.fastest.enemy_level < item.best.enemy_level &&
                    item.fastest.boss_chest_drop_percent >= 40 && (
                      <span className="route-planner__alt">
                        ⚡ clear mais rápido: {stageName(item.fastest)} (inimigos Lv{' '}
                        {item.fastest.enemy_level}, drop {item.fastest.boss_chest_drop_percent}%)
                      </span>
                    )}
                </div>
              </li>
            ))}
          </ol>

          <p className="route-planner__coverage">
            {route.length === 1
              ? `Com só 1 baú você fica ~${defaultMin} min parado esperando o cooldown. Adicione mais níveis para não ficar ocioso.`
              : `Rotacione entre as ${route.length} fases na ordem acima: ao dropar um baú, pule para a próxima fase enquanto o cooldown (~${defaultMin} min) corre. Quanto mais baús na rota, menos tempo parado.`}
          </p>

          <button
            type="button"
            className="route-planner__create"
            onClick={() => onCreateRoute(route.map((item) => ({ level: item.level, stage: item.best })))}
          >
            ➕ Criar cronômetros desta rota
          </button>
        </>
      )}
    </details>
  )
}

export default RoutePlanner
