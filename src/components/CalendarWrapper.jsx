import React from 'react';
import { DateTime } from 'luxon';
import CalendarBody from './CalendarBody';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dt = DateTime.fromFormat('01/09/2021', 'dd/MM/yyyy');

export const calcWeeksInMonth = (date) => {
    const dt = DateTime.fromFormat(date, 'dd/MM/yyyy');
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

export const generateMonthDays = (weeksCount) => {
    const monthDays = [];
    let dayDate = dt.startOf('week')

    for (let perWeek = 0; perWeek < weeksCount; perWeek++) {
        const week = [];

        for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
                date: dayDate.toISODate(),
            });

            // get next day
            dayDate = dayDate.plus({days: 1})
        }

        monthDays.push(week)
    }

    return monthDays
}

const fullCalendarDates = generateMonthDays(calcWeeksInMonth('01/09/2021'))

const calendarWrapper = () => {
    return (
        <div className="calendar-wrapper">
            <div className="calendar-header">
                { weekDays.map(function (item) {
                    return (<span key={item}>{item}</span>)
                })}
            </div>
            <CalendarBody weeks={fullCalendarDates} />
        </div>
    )
}

export default calendarWrapper
