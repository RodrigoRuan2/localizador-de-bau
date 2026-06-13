import { useState } from 'react'
import { CHEST_LEVELS } from '../utils/stages.js'
import '../styles/AddChest.css'

// Formulário para adicionar um novo card de baú.
// É permitido repetir o mesmo nível: quem farma em mais de uma fase
// (ou em mais de uma conta) pode querer dois cronômetros de Lv 30.
function AddChest({ onAdd }) {
  const [level, setLevel] = useState(CHEST_LEVELS[0])

  function handleSubmit(event) {
    event.preventDefault() // impede o recarregamento padrão da página
    onAdd(Number(level))
  }

  return (
    <form className="add-chest" onSubmit={handleSubmit}>
      <label className="add-chest__label">
        Nível do baú
        <select
          className="add-chest__select"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          {CHEST_LEVELS.map((lv) => (
            <option key={lv} value={lv}>
              Lv {lv}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="add-chest__button">
        + Adicionar baú
      </button>
    </form>
  )
}

export default AddChest
