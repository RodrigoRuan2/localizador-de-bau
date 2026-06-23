import { memo, useState } from 'react'
import {
  CHEST_LEVELS,
  DIFFICULTIES,
  allStages,
  difficultyName,
  stageId,
  stageName,
} from '../utils/stages.js'
import iconGuia from '../assets/icon-guia.png'
import '../styles/StageGuide.css'

// Remove acentos e põe em minúsculas, para a busca encontrar
// "Cânion" mesmo que você digite "canion". O normalize('NFD') separa
// a letra do acento, e o replace apaga só os acentos.
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Classe CSS conforme a chance de drop: verde (alta), dourado (média),
// vermelho (baixa). Facilita bater o olho na tabela.
function classeDaChance(percentual) {
  if (percentual >= 80) return 'stage-guide__drop stage-guide__drop--alta'
  if (percentual >= 40) return 'stage-guide__drop stage-guide__drop--media'
  return 'stage-guide__drop stage-guide__drop--baixa'
}

// Guia de consulta com as 120 fases do jogo e suas chances de baú.
// Usa <details>/<summary>, o "acordeão" nativo do HTML: abre e fecha
// sem precisarmos de nenhum estado React para isso.
function StageGuide() {
  const [dificuldade, setDificuldade] = useState('todas')
  const [nivelBau, setNivelBau] = useState('todos')
  const [busca, setBusca] = useState('')

  const fases = allStages().filter((s) => {
    if (dificuldade !== 'todas' && s.difficulty !== dificuldade) return false
    if (nivelBau !== 'todos' && s.boss_chest_level !== Number(nivelBau)) return false
    if (busca) {
      // Procura tanto no nome em português quanto no original em inglês
      const alvo = normalizar(`${stageName(s)} ${s.name}`)
      if (!alvo.includes(normalizar(busca))) return false
    }
    return true
  })

  return (
    <details className="stage-guide">
      <summary className="stage-guide__summary">
        <img className="stage-guide__summary-icon" src={iconGuia} alt="" /> Guia de fases — chances
        de baú
      </summary>

      <div className="stage-guide__filters">
        <label className="stage-guide__field">
          Dificuldade
          <select
            className="stage-guide__select"
            value={dificuldade}
            onChange={(e) => setDificuldade(e.target.value)}
          >
            <option value="todas">Todas</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {difficultyName({ difficulty: d })}
              </option>
            ))}
          </select>
        </label>

        <label className="stage-guide__field">
          Nível do baú
          <select
            className="stage-guide__select"
            value={nivelBau}
            onChange={(e) => setNivelBau(e.target.value)}
          >
            <option value="todos">Todos</option>
            {CHEST_LEVELS.map((lv) => (
              <option key={lv} value={lv}>
                Lv {lv}
              </option>
            ))}
          </select>
        </label>

        <label className="stage-guide__field stage-guide__field--busca">
          Buscar fase
          <input
            className="stage-guide__input"
            type="search"
            placeholder="Ex.: cemitério, faraó..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
      </div>

      <p className="stage-guide__count">
        {fases.length} de {allStages().length} fases
      </p>

      <div className="stage-guide__scroll">
        <table className="stage-guide__table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Dificuldade</th>
              <th>Local</th>
              <th>Inimigos</th>
              <th>Baú</th>
              <th>Chance</th>
            </tr>
          </thead>
          <tbody>
            {fases.map((s) => (
              <tr key={stageId(s)}>
                <td>{stageName(s)}</td>
                <td>{difficultyName(s)}</td>
                <td>
                  A{s.act}-{s.stage}
                </td>
                <td>Lv {s.enemy_level}</td>
                <td>Lv {s.boss_chest_level}</td>
                <td>
                  <span className={classeDaChance(s.boss_chest_drop_percent)}>
                    {s.boss_chest_drop_percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fases.length === 0 && (
          <p className="stage-guide__empty">Nenhuma fase encontrada com esses filtros.</p>
        )}
      </div>
    </details>
  )
}

// memo(): a tabela de 120 fases não depende do relógio do App. Sem memo, ela
// re-renderizaria 2x/s junto com os cronômetros. Como só muda quando os
// filtros internos mudam, memo evita esse trabalho desperdiçado.
export default memo(StageGuide)
