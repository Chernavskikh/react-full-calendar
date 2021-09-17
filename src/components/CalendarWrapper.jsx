import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import CalendarBody from './CalendarBody';

export const calcWeeksInMonth = (dt) => {
    const firstDayOfMonth = dt.startOf('month')
    const lastDayOfMonth = dt.endOf('month')
    const startWeek = firstDayOfMonth.weekNumber;
    const endWeek = lastDayOfMonth.weekNumber;

    if (endWeek < startWeek) {
        // Yearly overlaps, month is either DEC or JAN
        if (firstDayOfMonth.month === 1) {
            // January
            return endWeek + 1;
        } else {
            // December
            if (lastDayOfMonth.weekday === 7) {
                // Sunday is last day of year
                return endWeek - startWeek + 1;
            } else {
                // Sunday is NOT last day of year
                return firstDayOfMonth.weekYear - startWeek + 1;
            }
        }
    } else {
        return endWeek - startWeek + 1;
    }
}

export const generateMonthDays = (dt) => {
    const weeksCount = calcWeeksInMonth(dt)
    const monthDays = [];
    let selectedDt = dt;
    let dayDate = dt.startOf('month').startOf('week')

    for (let perWeek = 0; perWeek < weeksCount; perWeek++) {
        const week = [];

        for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
                date: dayDate.toFormat('dd'),
                isToday: dayDate.toISODate() === selectedDt.toISODate() // compare day with selected zone
            });

            // get next day
            dayDate = dayDate.plus({days: 1})
        }

        monthDays.push(week)
    }

    return monthDays
}

const CalendarWrapper = () => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dt = DateTime.local().setZone('Europe/Kiev');

    let [currentDayDt, setTimezone ] = useState(dt)
    let [currentMonthDays, setMonthDays ] = useState(() => {
        return generateMonthDays(currentDayDt)
    })

    // TODO: learn how to call second hook correctly if first state value was changed
    useEffect(() => {
        setMonthDays(generateMonthDays(currentDayDt))
    })

    const changeTimeZoneClick = (gmtValue) => {
        const newDt = dt.setZone(gmtValue)
        setTimezone(newDt)
    }

    return (
        <div className="calendar-wrapper">
            <h4>{currentDayDt.monthLong} {currentDayDt.toFormat('dd MM yyyy')}</h4>
            <div>
                <button type="button" onClick={() => changeTimeZoneClick('Europe/Kiev')}>Kyiv GMT+3</button>
                <button type="button" onClick={() => changeTimeZoneClick( 'Australia/Sydney')}>Sydney GMT+10</button>
                <button type="button" onClick={() => changeTimeZoneClick('Pacific/Honolulu')}>Honolulu GMT-10</button>
            </div>
            <div className="calendar-header">
                { weekDays.map(function (item) {
                    return (<span key={item}>{item}</span>)
                })}
            </div>
            <CalendarBody weeks={currentMonthDays} />
        </div>
    )
}

export default CalendarWrapper
