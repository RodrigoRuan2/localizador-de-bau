import { useEffect, useState } from 'react'
import ChestCard from './components/ChestCard.jsx'
import AddChest from './components/AddChest.jsx'
import SettingsBar from './components/SettingsBar.jsx'
import EventLog from './components/EventLog.jsx'
import StageGuide from './components/StageGuide.jsx'
import RoutePlanner from './components/RoutePlanner.jsx'
import Updates from './components/Updates.jsx'
import GameUpdates from './components/GameUpdates.jsx'
import Meta from './components/Meta.jsx'
import { useNow } from './hooks/useNow.js'
import { stagesForLevel, stageId } from './utils/stages.js'
import { averageDropInterval } from './utils/stats.js'
import { formatDuration } from './utils/time.js'
import bauIcon from './assets/bau.png'
import './styles/App.css'

// Chaves usadas no localStorage (prefixadas para não colidir com outros sites)
const STORAGE_TIMERS = 'tbh-timers'
const STORAGE_SETTINGS = 'tbh-settings'
const STORAGE_DROPS = 'tbh-drop-history'

const DEFAULT_SETTINGS = {
  durationMin: 14, // cooldown médio observado pela comunidade (12–14 min)
  soundOn: true,
  volume: 0.5,
  theme: 'roxo', // 'roxo' (cyberpunk) ou 'cinza' (monocromático)
  heroLevel: '', // nível do herói; vazio = não filtra fases por nível
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
    loadFromStorage(STORAGE_TIMERS, []).map((t) => {
      const base = { lastDropAt: null, customMs: null, ...t }
      // Se o timer aponta para uma fase que não é mais farmável (ex.: um
      // chefe de ato salvo por uma versão antiga), repontamos para a
      // melhor fase válida daquele nível.
      const validos = stagesForLevel(base.chestLevel).map(stageId)
      if (!validos.includes(base.stageId)) {
        base.stageId = validos[0]
      }
      return base
    })
  )

  // ID do card sendo arrastado no momento (null = ninguém arrastando)
  const [dragId, setDragId] = useState(null)
  // O spread "{ ...DEFAULT_SETTINGS, ...salvo }" garante que campos novos
  // (tema, nível do herói) apareçam mesmo em configurações salvas por
  // versões antigas, sem perder o que o usuário já tinha ajustado.
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...loadFromStorage(STORAGE_SETTINGS, {}),
  }))
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

  // Aplica o tema trocando a classe do <body>. O <body> não é renderizado
  // pelo React (vive no index.html), então mexemos nele direto via efeito.
  // O CSS (global.css) é quem define as cores e o fundo de cada classe.
  useEffect(() => {
    document.body.classList.remove('tema-roxo', 'tema-cinza')
    document.body.classList.add(`tema-${settings.theme}`)
  }, [settings.theme])

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
      lastDropAt: null, // horário do último "Baú dropou!" (null = nenhum ainda)
      customMs: null, // cooldown personalizado deste card (null = usa o padrão)
    }
  }

  // Um cronômetro por nível: o cooldown do baú de chefe é GLOBAL por nível
  // no jogo (pegar um Lv 40 põe TODOS os Lv 40 em cooldown, não importa a
  // fase). Por isso bloqueamos níveis repetidos — dois timers do mesmo nível
  // dariam a falsa impressão de cooldowns independentes.
  function handleAdd(chestLevel) {
    setTimers((prev) =>
      prev.some((t) => t.chestLevel === chestLevel) ? prev : [...prev, novoTimer(chestLevel)]
    )
  }

  // Cria os cronômetros de uma rota planejada, pulando níveis que já estão
  // na tela (pra não duplicar). route = [{ level, stage }, ...].
  function handleCreateRoute(route) {
    setTimers((prev) => {
      const jaExistem = new Set(prev.map((t) => t.chestLevel))
      const novos = route
        .filter((item) => !jaExistem.has(item.level))
        .map((item) => novoTimer(item.level, stageId(item.stage)))
      if (novos.length === 0) return prev
      return [...prev, ...novos]
    })
    addEvent(`Rota criada: ${route.map((item) => `Lv ${item.level}`).join(' → ')}`)
  }

  function handleDrop(id) {
    const timer = timers.find((t) => t.id === id)
    if (!timer) return
    const agora = Date.now()
    const durationMs = timer.customMs ?? settings.durationMin * 60 * 1000
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, endsAt: agora + durationMs, durationMs, lastDropAt: agora } : t
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
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, stageId: newStageId } : t)))
  }

  // Reordena a lista quando um card é solto sobre outro. dragId é o card
  // que estava sendo arrastado; targetId é onde foi solto.
  function handleDropCard(targetId) {
    setTimers((prev) => {
      if (dragId == null || dragId === targetId) return prev
      const from = prev.findIndex((t) => t.id === dragId)
      const to = prev.findIndex((t) => t.id === targetId)
      if (from === -1 || to === -1) return prev
      const copia = [...prev]
      const [movido] = copia.splice(from, 1) // remove da posição antiga
      copia.splice(to, 0, movido) // insere na nova
      return copia
    })
    setDragId(null)
  }

  function handleSetCustom(id, ms) {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, customMs: ms } : t)))
  }

  // Níveis já na rotação — usado para o AddChest desabilitar repetidos.
  const usedLevels = timers.map((t) => t.chestLevel)

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
        <h1 className="app__title">
          <img className="app__title-icon" src={bauIcon} alt="" /> Localizador de Baú
        </h1>
        <p className="app__subtitle">
          Cronômetro de drop de baús — TBH: Task Bar Hero. Quando um baú dropar, clique em
          "Baú dropou!" e rotacione para outra fase enquanto o cooldown corre.
        </p>
      </header>

      <SettingsBar settings={settings} onChange={setSettings} onResetAll={handleResetAll} />
      <RoutePlanner
        dropHistory={dropHistory}
        defaultMin={settings.durationMin}
        heroLevel={settings.heroLevel}
        onCreateRoute={handleCreateRoute}
      />
      <AddChest usedLevels={usedLevels} onAdd={handleAdd} />

      {timers.length === 0 ? (
        <p className="app__empty">
          Nenhum baú na rotação ainda. Adicione o nível de baú que você está farmando. 👆
        </p>
      ) : (
        <main className="app__grid">
          {timers.map((timer) => (
            <ChestCard
              key={timer.id}
              timer={timer}
              isNext={timer.id === nextId}
              isDragging={timer.id === dragId}
              average={averageDropInterval(dropHistory[timer.chestLevel])}
              onSetCustom={handleSetCustom}
              now={now}
              soundOn={settings.soundOn}
              volume={settings.volume}
              onDrop={handleDrop}
              onReset={handleReset}
              onRemove={handleRemove}
              onChangeStage={handleChangeStage}
              onDragStart={setDragId}
              onDragEnd={() => setDragId(null)}
              onDropCard={handleDropCard}
            />
          ))}
        </main>
      )}

      <StageGuide />
      <Meta />
      <Updates />
      <GameUpdates />
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
