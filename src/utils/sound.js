// Alerta sonoro feito com a Web Audio API, nativa do navegador.
// Vantagem: não precisamos de nenhum arquivo .mp3 no projeto —
// o navegador gera a onda sonora na hora.

let audioContext = null

function getContext() {
  // Criamos o AudioContext uma única vez e reaproveitamos (lazy init).
  // Navegadores só permitem criar áudio depois de uma interação do usuário,
  // então isso roda na primeira vez que um botão é clicado.
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function beep(ctx, startTime, frequency, duration, volume) {
  const oscillator = ctx.createOscillator() // gera a onda (o "tom")
  const gain = ctx.createGain() // controla o volume

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  oscillator.connect(gain)
  gain.connect(ctx.destination)

  // Sobe e desce o volume suavemente para o beep não "estalar"
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02)
  gain.gain.linearRampToValueAtTime(0, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

// Dois beeps ascendentes: "baú pronto!"
export function playAlert(volume = 0.5) {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    beep(ctx, now, 880, 0.18, volume)
    beep(ctx, now + 0.25, 1320, 0.3, volume)
  } catch {
    // Se o navegador bloquear o áudio, o app continua funcionando sem som.
  }
}
