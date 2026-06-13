import { useEffect, useState } from 'react'
import ChestCard from './components/ChestCard.jsx'
import AddChest from './components/AddChest.jsx'
import SettingsBar from './components/SettingsBar.jsx'
import EventLog from './components/EventLog.jsx'
import StageGuide from './components/StageGuide.jsx'
import RoutePlanner from './components/RoutePlanner.jsx'
import { useNow } from './hooks/useNow.js'
import { stagesForLevel, stageId } from './utils/stages.js'
import { averageDropInterval } from './utils/stats.js'
import { formatDuration } from './utils/time.js'
import './styles/App.css'

// Chaves usadas no localStorage (prefixadas para não colidir com outros sites)
const STORAGE_TIMERS = 'tbh-timers'
const STORAGE_SETTINGS = 'tbh-settings'
const STORAGE_DROPS = 'tbh-drop-history'

const DEFAULT_SETTINGS = {
  durationMin: 14, // cooldown médio observado pela comunidade (12–14 min)
  soundOn: true,
  volume: 0.5,
}

// Lê do localStorage com segurança: se o dado estiver corrompido
// ou não existir, devolve o valor padrão em vez de quebrar o app.
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function App() {
  // useState com FUNÇÃO (lazy initializer): o localStorage só é lido
  // uma vez, na primeira renderização — não a cada atualização de tela.
  // O spread "{ padrões, ...t }" é uma migração leve: timers salvos por
  // versões antigas do app ganham os campos novos sem quebrar nada.
  const [timers, setTimers] = useState(() =>
    loadFromStorage(STORAGE_TIMERS, []).map((t) => ({
      enteredAt: Date.now(),
      customMs: null,
      ...t,
    }))
  )
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_SETTINGS, DEFAULT_SETTINGS)
  )
  const [events, setEvents] = useState([])

  // Histórico de drops por nível de baú: { "30": [timestamp, ...] }.
  // É daqui que calculamos a média REAL entre os seus drops —
  // seus dados valem mais que qualquer chute de 12/13/14 minutos.
  const [dropHistory, setDropHistory] = useState(() => loadFromStorage(STORAGE_DROPS, {}))

  // "Relógio" global: re-renderiza o app 2x por segundo
  // para os countdowns andarem na tela.
  const now = useNow(500)

  // Sempre que timers ou settings mudarem, salvamos no localStorage.
  // Guardamos o TIMESTAMP em que o timer termina (endsAt), não o tempo
  // restante. Assim, se você der F5 ou fechar o navegador, o cronômetro
  // continua certo: basta recalcular endsAt - agora.
  useEffect(() => {
    localStorage.setItem(STORAGE_TIMERS, JSON.stringify(timers))
  }, [timers])

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(STORAGE_DROPS, JSON.stringify(dropHistory))
  }, [dropHistory])

  function addEvent(text) {
    setEvents((prev) => [{ id: crypto.randomUUID(), at: Date.now(), text }, ...prev].slice(0, 20))
  }

  // Cria o objeto de um timer novo. forcedStageId permite indicar uma
  // fase específica (usado pelo planejador de rota); sem ele, escolhe a
  // melhor fase do nível (maior % de drop).
  function novoTimer(chestLevel, forcedStageId = null) {
    return {
      id: crypto.randomUUID(),
      chestLevel,
      stageId: forcedStageId ?? stageId(stagesForLevel(chestLevel)[0]),
      endsAt: null, // null = sem countdown rodando (baú disponível)
      durationMs: 0,
      enteredAt: Date.now(), // início da contagem de "tempo na fase"
      customMs: null, // cooldown personalizado deste card (null = usa o padrão)
    }
  }

  function handleAdd(chestLevel) {
    setTimers((prev) => [...prev, novoTimer(chestLevel)])
  }

  // Cria de uma vez os cronômetros de uma rota planejada.
  // route = [{ level, stage }, ...] vindo do RoutePlanner.
  function handleCreateRoute(route) {
    setTimers((prev) => [...prev, ...route.map((item) => novoTimer(item.level, stageId(item.stage)))])
    addEvent(`Rota criada: ${route.map((item) => `Lv ${item.level}`).join(' → ')}`)
  }

  function handleDrop(id) {
    const timer = timers.find((t) => t.id === id)
    if (!timer) return
    const agora = Date.now()
    const durationMs = timer.customMs ?? settings.durationMin * 60 * 1000
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, endsAt: agora + durationMs, durationMs, enteredAt: agora } : t
      )
    )
    // Registra o drop no histórico do nível (máximo de 50 por nível,
    // o suficiente para a média sem crescer para sempre).
    setDropHistory((prev) => {
      const lista = [...(prev[timer.chestLevel] ?? []), agora].slice(-50)
      return { ...prev, [timer.chestLevel]: lista }
    })
    addEvent(`Baú Lv ${timer.chestLevel} dropou — próximo em ${formatDuration(durationMs)}`)
  }

  function handleReset(id) {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, endsAt: null } : t)))
  }

  function handleResetAll() {
    setTimers((prev) => prev.map((t) => ({ ...t, endsAt: null })))
    addEvent('Todos os cronômetros foram resetados')
  }

  function handleRemove(id) {
    setTimers((prev) => prev.filter((t) => t.id !== id))
  }

  function handleChangeStage(id, newStageId) {
    // Trocar de fase reinicia o "tempo na fase" — você acabou de chegar nela
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, stageId: newStageId, enteredAt: Date.now() } : t))
    )
  }

  function handleSetCustom(id, ms) {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, customMs: ms } : t)))
  }

  // Quando há mais de um baú do MESMO nível, numeramos os cards
  // (nº 1, nº 2...) para diferenciar os cronômetros na tela.
  // Isso é estado derivado: calculado a cada renderização, não guardado.
  const totalPorNivel = {}
  for (const t of timers) {
    totalPorNivel[t.chestLevel] = (totalPorNivel[t.chestLevel] ?? 0) + 1
  }
  const vistosPorNivel = {}

  // Próximo da rotação: entre os cards que estão CONTANDO, qual fica
  // pronto primeiro? Também é estado derivado — recalculado a cada tick.
  let nextId = null
  let menorRestante = Infinity
  for (const t of timers) {
    if (t.endsAt && t.endsAt > now && t.endsAt - now < menorRestante) {
      menorRestante = t.endsAt - now
      nextId = t.id
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">📦 Localizador de Baú</h1>
        <p className="app__subtitle">
          Cronômetro de drop de baús — TBH: Task Bar Hero. Quando um baú dropar, clique em
          "Baú dropou!" e rotacione para outra fase enquanto o cooldown corre.
        </p>
      </header>

      <SettingsBar settings={settings} onChange={setSettings} onResetAll={handleResetAll} />
      <RoutePlanner
        dropHistory={dropHistory}
        defaultMin={settings.durationMin}
        onCreateRoute={handleCreateRoute}
      />
      <AddChest onAdd={handleAdd} />

      {timers.length === 0 ? (
        <p className="app__empty">
          Nenhum baú na rotação ainda. Adicione o nível de baú que você está farmando. 👆
        </p>
      ) : (
        <main className="app__grid">
          {timers.map((timer) => {
            vistosPorNivel[timer.chestLevel] = (vistosPorNivel[timer.chestLevel] ?? 0) + 1
            const slot =
              totalPorNivel[timer.chestLevel] > 1 ? vistosPorNivel[timer.chestLevel] : null
            return (
            <ChestCard
              key={timer.id}
              timer={timer}
              slot={slot}
              isNext={timer.id === nextId}
              average={averageDropInterval(dropHistory[timer.chestLevel])}
              onSetCustom={handleSetCustom}
              now={now}
              soundOn={settings.soundOn}
              volume={settings.volume}
              onDrop={handleDrop}
              onReset={handleReset}
              onRemove={handleRemove}
              onChangeStage={handleChangeStage}
            />
            )
          })}
        </main>
      )}

      <StageGuide />
      <EventLog events={events} />

      <footer className="app__footer">
        Dados das 120 fases extraídos do jogo · inspirado em{' '}
        <a href="https://feroddev.github.io/tbh-codown/" target="_blank" rel="noreferrer">
          tbh-codown
        </a>
      </footer>
    </div>
  )
}

export default App
