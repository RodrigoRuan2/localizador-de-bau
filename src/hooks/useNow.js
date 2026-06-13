import { useEffect, useState } from 'react'

// Hook customizado que devolve o horário atual (Date.now())
// e força o componente a re-renderizar a cada `intervalMs`.
//
// Por que isso existe? Um cronômetro precisa "andar" sozinho na tela,
// mas o React só redesenha quando algum estado muda. Então criamos um
// estado (`now`) que muda a cada meio segundo — e todo componente que
// usa este hook se atualiza junto, fazendo o countdown andar.
export function useNow(intervalMs = 500) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    // Função de limpeza: quando o componente sai da tela,
    // paramos o setInterval para não vazar memória.
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
