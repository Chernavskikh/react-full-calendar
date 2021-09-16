import React from 'react';

const calendarBody = ({ days }) => {
    return (
        <div className="calendar-week">
            { days.map(function (item) {
                return (<span className="calendar-day" key={item}>{item}</span>)
            })}
        </div>
    )
}

export default calendarBody
