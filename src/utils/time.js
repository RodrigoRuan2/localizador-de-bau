// Converte milissegundos em texto "MM:SS" para o display do cronômetro.
// Math.max(0, ...) garante que nunca mostramos tempo negativo.
export function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Hora local "HH:MM:SS" para o histórico de eventos.
export function formatClock(timestamp) {
  return new Date(timestamp).toLocaleTimeString('pt-BR')
}

// Tempo decorrido para contagens CRESCENTES (ex.: tempo na fase).
// Mostra "05:32" e, passando de uma hora, "1h05:32".
export function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const mmss = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return hours > 0 ? `${hours}h${mmss}` : mmss
}

// Duração legível para textos: "12m40s" ou "13m".
export function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return seconds > 0 ? `${minutes}m${String(seconds).padStart(2, '0')}s` : `${minutes}m`
}
