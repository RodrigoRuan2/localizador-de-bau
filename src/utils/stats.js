// Estatísticas calculadas a partir do SEU histórico de drops.
// A ideia: em vez de chutar se o cooldown é 12, 13 ou 14 minutos,
// medimos o intervalo real entre os drops que você marcou.

// Limites de sanidade: intervalos fora desta faixa são descartados.
// Menos de 5 min não é um ciclo de drop real, e mais de 45 min
// provavelmente significa que você fechou o jogo ou esqueceu de marcar.
const MIN_INTERVALO_MS = 5 * 60 * 1000
const MAX_INTERVALO_MS = 45 * 60 * 1000

// Recebe a lista de timestamps dos drops de um nível de baú e devolve
// { avgMs, samples } — média dos intervalos válidos e quantos foram usados.
// Devolve null quando ainda não há dados suficientes (menos de 2 drops).
export function averageDropInterval(timestamps) {
  if (!timestamps || timestamps.length < 2) return null

  const intervalos = []
  for (let i = 1; i < timestamps.length; i++) {
    const delta = timestamps[i] - timestamps[i - 1]
    if (delta >= MIN_INTERVALO_MS && delta <= MAX_INTERVALO_MS) {
      intervalos.push(delta)
    }
  }
  if (intervalos.length === 0) return null

  const soma = intervalos.reduce((acumulado, valor) => acumulado + valor, 0)
  return { avgMs: soma / intervalos.length, samples: intervalos.length }
}
