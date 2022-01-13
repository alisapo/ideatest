import React from 'react';
import axios from 'axios';

import styles from './scss/app.module.scss';
import './scss/checkboxes.module.scss';
import Plane from './scss/plane.svg';

interface ITickets {
  arrival_date: string;
  arrival_time: string;
  carrier: string;
  departure_date: string;
  departure_time: string;
  destination: string;
  destination_name: string;
  origin: string;
  origin_name: string;
  price: number;
  stops: number;
}

function App() {
  const [tickets, setTickets] = React.useState<ITickets[] | null>(null);
  const months: string[] = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
  ];
  const [filteredTickets, setFilteredTickets] = React.useState<ITickets[] | null>(null);
  const [stops, setStops] = React.useState<(number | undefined)[]>([]);

  React.useEffect(() => {
    axios.get('/tickets.json')
      .then(res => setTickets(res.data.tickets))
      .catch(err => console.log(err))
  }, [])

  const chooseStops = (id: number) => {
    const newStops: (number | undefined)[] = [];
    let newFilteredTickets: any[] | null = [];

    if (stops.length > 0 && stops.includes(id)) {
      const d = stops.splice(stops.findIndex((stop) => { return stop === id }), 1);
      newStops.push(...stops);

      if (filteredTickets && stops.length) {
        newFilteredTickets.push(...filteredTickets?.filter(
          (ticket: any) => {
            return ticket.stops !== id
        }))
      }

      if (!stops.length) newFilteredTickets = null;
    } else {
      newStops.push(...stops, id);

      if (filteredTickets && tickets) {
        newFilteredTickets.push(
          ...filteredTickets,
          ...tickets.filter((ticket: ITickets) => { return ticket.stops === id })
        )
      } else if (!filteredTickets && tickets) {
        newFilteredTickets.push(...tickets.filter(
          (tick: ITickets) => { return tick.stops === id })
        )
      }
    }

    setStops(newStops)
    setFilteredTickets(newFilteredTickets)
  }

  const chooseAllTickets = () => {
    setStops([])
    setFilteredTickets(null)
  }

  const date = (str: string) => {
    const a: string = str.split('.').reverse().join(', ');
    const b: Date = new Date(a)
    return `${b.getDate()} ${months[b.getMonth()]} ${b.getFullYear()}`
  }

  if (filteredTickets) {
    var allTickets: ITickets[] | null = filteredTickets
  } else {
    allTickets = tickets
  }

  return (
    <section>
      <aside>
        <h3>Валюта</h3>
        <ul className={styles.currency}>
          <li>RUB</li>
          <li>USD</li>
          <li>EUR</li>
        </ul>
        <h3>Количество пересадок</h3>
        <ul className={styles.filters}>
          <li>
            <input type="checkbox" name="all" id="all"
              onChange={chooseAllTickets}
              checked={stops.length ? false : true}
            />
            <label htmlFor="all">Все</label>
          </li>
          <li>
            <input type="checkbox" name="without" id="without"
              onChange={() => chooseStops(+0)}
              checked={stops.includes(+0) ? true : false}
            />
            <label htmlFor="without">Без пересадок</label>
          </li>
          <li>
            <input type="checkbox" name="one" id="one"
              onChange={() => chooseStops(+1)}
              checked={stops.includes(+1) ? true : false}
            />
            <label htmlFor="one">1 пересадка</label>
          </li>
          <li>
            <input type="checkbox" name="two" id="two"
              onChange={() => chooseStops(2)}
              checked={stops.includes(2) ? true : false}
            />
            <label htmlFor="two">2 пересадки</label>
          </li>
          <li>
            <input type="checkbox" name="three" id="three"
              onChange={() => chooseStops(3)}
              checked={stops.includes(3) ? true : false}
            />
            <label htmlFor="three">3 пересадки</label>
          </li>
        </ul>
      </aside>
      {allTickets ?
        <ul className={styles.list}>
          {allTickets.map((ticket: ITickets, index: number) => {
            return (
              <li
                className={styles.ticket}
                key={ticket.carrier + index}
              >
                <div className={styles.carrier}>
                  <div>{ticket.carrier}</div>
                  <button className={styles.price}>Купить за {ticket.price} руб.</button>
                </div>
                <div className={styles.punkt}>
                  <div className={styles.times}>
                    <div className={styles.time}>{ticket.departure_time}</div>
                    <div className={styles.stop}>
                      <div className={styles.stops}>{ticket.stops} пересадки</div>
                      <img className={styles.plane} src={Plane} alt="plane" />
                    </div>
                    <div className={styles.time}>{ticket.arrival_time}</div>
                  </div>
                  <div className={styles.punkts}>
                    <div className={styles.departure}>
                      <div className={styles.place}>
                        <div className={styles.code}>{ticket.origin},&nbsp;</div>
                        <div className={styles.punktname}>{ticket.origin_name}</div>
                      </div>
                      <div className={styles.date}>{date(ticket.departure_date)}</div>
                    </div>
                    <div className={styles.destination}>
                      <div className={styles.place}>
                        <div className={styles.code}>{ticket.destination},&nbsp;</div>
                        <div className={styles.punktname}>{ticket.destination_name}</div>
                      </div>
                      <div className={styles.date}>{date(ticket.arrival_date)}</div>
                    </div>
                  </div>
                </div>
              </li>)
          })}
        </ul>
        : <span className={styles.noresults}>Пока нет результатов</span>}
    </section>
  );
}

export default App;
