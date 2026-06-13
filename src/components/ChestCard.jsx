import { useEffect, useRef } from 'react'
import { formatCountdown, formatElapsed, formatDuration } from '../utils/time.js'
import { playAlert } from '../utils/sound.js'
import { stagesForLevel, stageId, findStage, stageLabel } from '../utils/stages.js'
import '../styles/ChestCard.css'

// Card de um baú: mostra o nível, a fase escolhida para farmar
// e o cronômetro de cooldown daquele nível de baú.
//
// Este componente é "burro" de propósito: ele não guarda estado próprio
// do timer. Quem manda é o App (via props). Esse padrão se chama
// "lifting state up" — o estado fica no pai para poder ser salvo
// no localStorage em um lugar só.
function ChestCard({
  timer,
  isNext,
  isDragging,
  average,
  now,
  soundOn,
  volume,
  onDrop,
  onReset,
  onRemove,
  onChangeStage,
  onSetCustom,
  onDragStart,
  onDragEnd,
  onDropCard,
}) {
  const stage = findStage(timer.stageId)
  const options = stagesForLevel(timer.chestLevel)

  const remainingMs = timer.endsAt ? timer.endsAt - now : 0
  const isCounting = timer.endsAt !== null && remainingMs > 0
  const isReady = !isCounting

  // Detecta o MOMENTO em que o timer zera para tocar o alerta uma única vez.
  // useRef guarda o valor anterior sem causar re-renderização.
  const wasCounting = useRef(isCounting)
  useEffect(() => {
    if (wasCounting.current && isReady && soundOn) {
      playAlert(volume)
    }
    wasCounting.current = isCounting
  }, [isCounting, isReady, soundOn, volume])

  // Quanto do cooldown já passou (0 a 1), para a barra de progresso.
  const progress = isCounting ? 1 - remainingMs / timer.durationMs : 1

  const classes = ['chest-card']
  if (isReady) classes.push('chest-card--ready')
  else if (isNext) classes.push('chest-card--next')
  if (isDragging) classes.push('chest-card--dragging')

  return (
    <article
      className={classes.join(' ')}
      // Para reordenar: o card é a ZONA DE SOLTAR. O onDragOver com
      // preventDefault é obrigatório — sem ele o navegador não permite
      // soltar nada aqui.
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDropCard(timer.id)}
    >
      <header className="chest-card__header">
        {/* Alça de arrasto: só ela inicia o drag, então o select e os
            botões continuam clicáveis normalmente. */}
        <span
          className="chest-card__grip"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = 'move'
            e.dataTransfer.setData('text/plain', timer.id)
            onDragStart(timer.id)
          }}
          onDragEnd={onDragEnd}
          title="Arraste para reordenar"
          aria-label="Arraste para reordenar"
        >
          ⠿
        </span>
        <h2 className="chest-card__title">
          Baú Lv {timer.chestLevel}
          {isNext && !isReady && <span className="chest-card__next-badge">⭐ próximo</span>}
        </h2>
        <button
          type="button"
          className="chest-card__remove"
          onClick={() => onRemove(timer.id)}
          title="Remover este baú"
        >
          ✕
        </button>
      </header>

      <label className="chest-card__label">
        Fase para farmar
        <select
          className="chest-card__select"
          value={timer.stageId}
          onChange={(e) => onChangeStage(timer.id, e.target.value)}
        >
          {options.map((s) => (
            <option key={stageId(s)} value={stageId(s)}>
              {stageLabel(s)}
            </option>
          ))}
        </select>
      </label>

      <p className="chest-card__stage-info">
        {stage
          ? `Inimigos Lv ${stage.enemy_level}${
              stage.is_act_boss ? ' · Chefe de Ato' : ''
            } · drop ${stage.boss_chest_drop_percent}%`
          : '—'}
      </p>

      {/* Contagem CRESCENTE desde o último "Baú dropou!" deste card.
          Antes do primeiro drop fica "—" (lastDropAt é null). Serve para
          medir o intervalo real de um baú para o outro, por card. */}
      <p className="chest-card__elapsed">
        ⏱ Desde o último drop: {timer.lastDropAt ? formatElapsed(now - timer.lastDropAt) : '—'}
      </p>

      {/* Média real entre os SEUS drops deste nível (precisa de 2+ drops
          com intervalo plausível). Sempre renderizada — quando não há dados
          mostra "—" — para todos os cards ficarem com a MESMA altura.
          O botão "usar" adota a média como cooldown só deste card. */}
      <p className="chest-card__avg">
        {average ? (
          <>
            📊 Média real: <strong>{formatDuration(average.avgMs)}</strong> ({average.samples}{' '}
            {average.samples === 1 ? 'intervalo' : 'intervalos'})
            {timer.customMs == null ? (
              <button
                type="button"
                className="chest-card__avg-btn"
                title="Usar a média como cooldown deste card"
                onClick={() => onSetCustom(timer.id, Math.round(average.avgMs))}
              >
                usar
              </button>
            ) : (
              <button
                type="button"
                className="chest-card__avg-btn"
                title="Voltar a usar a duração padrão"
                onClick={() => onSetCustom(timer.id, null)}
              >
                usando {formatDuration(timer.customMs)} · voltar ao padrão
              </button>
            )}
          </>
        ) : (
          <span className="chest-card__avg--empty">📊 Média real: — (marque alguns drops)</span>
        )}
      </p>

      <p className="chest-card__time">{isReady ? 'PRONTO!' : formatCountdown(remainingMs)}</p>

      {/* <progress> é a barra de progresso nativa do HTML.
          Usamos ela (em vez de uma div com largura inline)
          para manter todo o visual no arquivo CSS. */}
      <progress className="chest-card__progress" value={progress} max="1" />

      <footer className="chest-card__actions">
        <button
          type="button"
          className="chest-card__drop"
          onClick={() => onDrop(timer.id)}
          disabled={isCounting}
        >
          Baú dropou!
        </button>
        <button type="button" className="chest-card__reset" onClick={() => onReset(timer.id)}>
          Reset
        </button>
      </footer>
    </article>
  )
}

export default ChestCard
