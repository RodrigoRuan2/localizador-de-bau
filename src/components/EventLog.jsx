import { formatClock } from '../utils/time.js'
import '../styles/EventLog.css'

// Histórico simples dos últimos eventos (drops e timers prontos).
// Útil para o jogador conferir "quando mesmo dropou o Lv 30?".
function EventLog({ events }) {
  if (events.length === 0) {
    return null
  }

  return (
    <section className="event-log">
      <h2 className="event-log__title">Eventos</h2>
      <ul className="event-log__list">
        {events.map((event) => (
          <li key={event.id} className="event-log__item">
            <span className="event-log__time">{formatClock(event.at)}</span> {event.text}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default EventLog
