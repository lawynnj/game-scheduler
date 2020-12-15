import React, { useEffect, useState } from "react";

export default function Results({ settings, vote }) {
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [buyIn, setBuyIn] = useState(null);
  useEffect(() => {
    if (vote) {
      const tmp = JSON.parse(vote);
      setEventDate(tmp.eventDate);
      setEventTime(tmp.eventTime);
      setBuyIn(tmp.buyIn);
    }
  }, [vote]);
  console.log(buyIn);
  console.log(eventDate);
  console.log(eventTime);

  return (
    <div>
      <div>
        Date:
        <ol>
          {settings.dateOptions.map((date) => (
            <li>
              {date.date} - {date.votes}{" "}
              {eventDate === date.date ? "(You voted)" : null}
            </li>
          ))}
        </ol>
      </div>
      <div>
        Time:
        <ol>
          {settings.timeOptions.map((time) => (
            <li>
              {time.time} - {time.votes}{" "}
              {eventTime === time.time ? "(You voted)" : null}
            </li>
          ))}
        </ol>
      </div>
      <div>
        Date:
        <ol>
          {settings.buyInOptions.map((_buyIn) => (
            <li>
              {_buyIn.amount} - {_buyIn.votes}{" "}
              {buyIn === _buyIn.amount.toString() ? "(You voted)" : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
