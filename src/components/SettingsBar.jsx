import { playAlert } from '../utils/sound.js'
import '../styles/SettingsBar.css'

// Barra de configurações globais: duração padrão do cooldown,
// som ligado/desligado, volume e ações gerais.
function SettingsBar({ settings, onChange, onResetAll }) {
  return (
    <section className="settings">
      <label className="settings__field">
        Duração padrão (min)
        <input
          className="settings__input"
          type="number"
          min="1"
          max="120"
          value={settings.durationMin}
          onChange={(e) => onChange({ ...settings, durationMin: Number(e.target.value) || 1 })}
        />
      </label>

      <label className="settings__field">
        Nível do herói
        <input
          className="settings__input"
          type="number"
          min="1"
          max="120"
          placeholder="opcional"
          value={settings.heroLevel}
          onChange={(e) => onChange({ ...settings, heroLevel: e.target.value })}
        />
      </label>

      <label className="settings__field settings__field--checkbox">
        <input
          type="checkbox"
          checked={settings.soundOn}
          onChange={(e) => onChange({ ...settings, soundOn: e.target.checked })}
        />
        Alerta sonoro
      </label>

      <label className="settings__field">
        Volume
        <input
          className="settings__input"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.volume}
          onChange={(e) => onChange({ ...settings, volume: Number(e.target.value) })}
        />
      </label>

      <button type="button" className="settings__button" onClick={() => playAlert(settings.volume)}>
        🔊 Testar som
      </button>
      <button
        type="button"
        className="settings__button settings__button--danger"
        onClick={onResetAll}
      >
        Resetar todos
      </button>
    </section>
  )
}

export default SettingsBar
