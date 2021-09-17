import React from 'react';

const calendarBody = ({ weeks }) => {
    return (
        <div className="calendar-body">
            { weeks.map(function (week) {
                return <div className="calendar-week" key={week[0].date}>
                    {
                        week.map(function (day) {
                            return <span className={`calendar-day ${day.isToday ? 'current' : ''}`} key={day.date}>{day.date}</span>
                        })
                    }
                </div>
            })}
        </div>
    )
}

export default calendarBody
