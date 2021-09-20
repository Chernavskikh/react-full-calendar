import React, { useState, useMemo } from 'react';
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

export const generateMonthDays = (dt, userTimeZone) => {
    console.log({userTimeZone})
    const weeksCount = calcWeeksInMonth(dt)
    const monthDays = [];
    let dayDate = dt.startOf('month').startOf('week')

    for (let perWeek = 0; perWeek < weeksCount; perWeek++) {
        const week = [];

        for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
                date: dayDate.toFormat('dd'),
                isToday: dayDate.toISODate() === userTimeZone.toISODate() // compare day with selected zone
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

    // initial data
    const dt = DateTime.local().setZone('Europe/Kiev')
    //state
    let [userTimeZone, setTimezone ] = useState(dt)
    let [selectedMonthDt, setSelectedMonth ] = useState(dt.startOf('month'))
    const nextMonth = useMemo(() => selectedMonthDt.plus({month: 1}), [selectedMonthDt]);
    const prevMonth = useMemo(() => selectedMonthDt.minus({month: 1}), [selectedMonthDt]);
    const months = useMemo(() => {
        if (selectedMonthDt && userTimeZone) {
            return generateMonthDays(selectedMonthDt, userTimeZone);
        }
    },[selectedMonthDt, userTimeZone])

    const changeTimeZoneClick = (gmtValue) => {
        const newDt = dt.setZone(gmtValue)
        setTimezone(newDt)
    }

    const goToMonth = (val) => {
        setSelectedMonth(val)
    }

    return (
        <div className="calendar-wrapper">
            <div>
                <button type="button" onClick={() => changeTimeZoneClick('Europe/Kiev')}>Kyiv GMT+3</button>
                <button type="button" onClick={() => changeTimeZoneClick( 'Australia/Sydney')}>Sydney GMT+10</button>
                <button type="button" onClick={() => changeTimeZoneClick('Pacific/Honolulu')}>Honolulu GMT-10</button>
            </div>
            <small>(in some cases user's timezone affects today's date)</small>

            <div className="calendar-nav">
                <button onClick={() => goToMonth(prevMonth)} type="button">{prevMonth.monthLong}</button>
                <h4>{selectedMonthDt.monthLong}</h4>
                <button onClick={() => goToMonth(nextMonth)} type="button">{nextMonth.monthLong}</button>
            </div>
            <div className="calendar-header">
                { weekDays.map(function (item) {
                    return (<span key={item}>{item}</span>)
                })}
            </div>
            {months ? <CalendarBody weeks={months} /> : ''}
        </div>
    )
}

export default CalendarWrapper
