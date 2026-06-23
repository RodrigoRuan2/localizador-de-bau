import { useState } from 'react'
import { CHEST_LEVELS, stagesForLevel, stageName, difficultyName } from '../utils/stages.js'
import { averageDropInterval } from '../utils/stats.js'
import { formatDuration } from '../utils/time.js'
import iconRota from '../assets/icon-rota.png'
import '../styles/RoutePlanner.css'

// Planejador de rota: o jogador escolhe quais NÍVEIS de baú quer farmar
// e o app monta a rotação, sugerindo a melhor fase de cada um.
//
// "Melhor fase" = maior chance de drop; em caso de empate, a de inimigos
// mais fracos (clear mais rápido). O jogo não expõe o tempo de clear, então
// usamos o nível dos inimigos como proxy de velocidade — honestidade > número
// inventado.
function RoutePlanner({ dropHistory, defaultMin, heroLevel, onCreateRoute, children, footer }) {
  const [selected, setSelected] = useState([])

  // Nível do herói como número (0 = não informado, então não filtramos nada).
  const hl = Number(heroLevel) || 0

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
      // Se o nível do herói foi informado, só consideramos fases que ele
      // consegue clarear (inimigos <= nível do herói). Entre as clareáveis,
      // a melhor é a de maior % de drop.
      const clareaveis = hl > 0 ? stages.filter((s) => s.enemy_level <= hl) : stages
      const best = clareaveis[0] ?? stages[0] // se nenhuma clareável, mostra a meta
      const fastest = [...(clareaveis.length ? clareaveis : stages)].sort(
        (a, b) => a.enemy_level - b.enemy_level
      )[0]
      const avg = averageDropInterval(dropHistory[level])
      // Herói baixo demais até para a fase mais fácil deste nível de baú
      const tooHard = hl > 0 && clareaveis.length === 0
      // "Ritmo de clear" pela regra dos 2-3 hits do meta: a folga entre o seu
      // nível e o dos inimigos indica se o kill é rápido demais (gear fraco),
      // no ponto ideal, ou lento. É uma ESTIMATIVA — não medimos o seu dano.
      const folga = hl - best.enemy_level
      const ritmo =
        hl === 0 || tooHard
          ? null
          : folga >= 20
            ? { tipo: 'rapido', texto: 'clear muito rápido — o gear pode vir fraco' }
            : folga >= 6
              ? { tipo: 'bom', texto: 'bom ritmo de farm (perto dos 2-3 golpes)' }
              : { tipo: 'lento', texto: 'kill pode ser lento — o ideal é matar em 2-3 golpes' }
      return { level, best, fastest, avg, tooHard, ritmo }
    })
    .sort((a, b) => a.best.enemy_level - b.best.enemy_level)

  return (
    <details className="route-planner">
      <summary className="route-planner__summary">
        <img className="route-planner__summary-icon" src={iconRota} alt="" /> Planejador de rota
      </summary>

      {/* Configurações globais (duração, nível do herói, som, tema...). Vêm do
          App como children: ele continua dono dos dados; o planejador só as
          "abriga" no topo, já que nível do herói e duração alimentam a rota. */}
      {children && <div className="route-planner__settings">{children}</div>}

      <p className="route-planner__hint">
        Escolha os níveis de baú que quer farmar. O app sugere a melhor fase de cada um (maior
        chance de drop e clear mais rápido) e monta a rotação.
        {hl > 0
          ? ` Considerando o herói Lv ${hl} e a "regra dos 2-3 hits" do meta: o ideal é farmar onde você mata os inimigos em 2-3 golpes (clear rápido + gear relevante). Cada fase mostra o ritmo estimado de clear.`
          : ' Dica: preencha o "Nível do herói" acima para o app estimar o ritmo de clear (regra dos 2-3 hits do meta).'}
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
                  {item.tooHard && (
                    <span className="route-planner__warn">
                      ⚠ Seu herói (Lv {hl}) ainda não clareia esta fase (inimigos Lv{' '}
                      {item.best.enemy_level}) — suba de nível antes.
                    </span>
                  )}
                  {item.ritmo && (
                    <span className={`route-planner__ritmo route-planner__ritmo--${item.ritmo.tipo}`}>
                      🎯 {item.ritmo.texto}
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

      {/* Slot do rodapé: o App injeta aqui o "Adicionar baú" (criar timer
          manualmente). O planejador não sabe o que é — só posiciona. */}
      {footer && <div className="route-planner__footer">{footer}</div>}
    </details>
  )
}

export default RoutePlanner
