import React, { useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import CalendarBody from './CalendarBody';

export const calcWeeksInMonth = (dt) => {
    const firstDayOfMonth = dt.startOf('month');
    const lastDayOfMonth = dt.endOf('month');

    const firstDayOfGrid = firstDayOfMonth.startOf('week');
    const lastVisibleDay = lastDayOfMonth
        .endOf('week')
        .startOf('month')
        .equals(firstDayOfMonth.startOf('month'))
        ? lastDayOfMonth.endOf('week')
        : lastDayOfMonth;

    const totalDays = lastVisibleDay.diff(firstDayOfGrid, 'days').days + 1;
    return Math.ceil(totalDays / 7);
};

export const generateMonthDays = (dt, userTimeZone) => {
    const weeksInMonth = calcWeeksInMonth(dt);
    const firstDayOfGrid = dt.startOf('month').startOf('week');
    const totalDays = weeksInMonth * 7;

    return Array.from({ length: totalDays }, (_, i) => {
        const dayDate = firstDayOfGrid.plus({ days: i });
        return {
            date: dayDate.toFormat('dd'),
            isoDate: dayDate.toISODate(),
            isToday: dayDate.toISODate() === userTimeZone.toISODate(),
        };
    }).reduce((weeks, day, index) => {
        if (index % 7 === 0) weeks.push([]);
        weeks[weeks.length - 1].push(day);
        return weeks;
    }, []);
};

const CalendarWrapper = () => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // initial data
    const dt = DateTime.local().setZone('Europe/Kiev');
    let [userTimeZone, setTimezone] = useState(dt);
    let [selectedMonthDt, setSelectedMonth] = useState(dt.startOf('month'));
    const nextMonth = useMemo(
        () => selectedMonthDt.plus({ month: 1 }),
        [selectedMonthDt]
    );
    const prevMonth = useMemo(
        () => selectedMonthDt.minus({ month: 1 }),
        [selectedMonthDt]
    );
    const months = useMemo(() => {
        if (selectedMonthDt && userTimeZone) {
            return generateMonthDays(selectedMonthDt, userTimeZone);
        }
    }, [selectedMonthDt, userTimeZone]);

    const changeTimeZoneClick = (gmtValue) => {
        const newDt = dt.setZone(gmtValue);
        setTimezone(newDt);
    };

    const goToMonth = (val) => {
        setSelectedMonth(val);
    };

    return (
        <div className="calendar-wrapper">
            <div className="calendar-nav">
                <button
                    className="btn"
                    onClick={() => goToMonth(prevMonth)}
                    type="button"
                >
                    <span className="arrow">&#x2039;</span>{' '}
                    {prevMonth.monthLong}{' '}
                </button>
                <div className="month">
                    <span className="month-display">
                        {selectedMonthDt.monthLong} {selectedMonthDt.year}
                    </span>
                </div>
                <button
                    className="btn"
                    onClick={() => goToMonth(nextMonth)}
                    type="button"
                >
                    {nextMonth.monthLong}{' '}
                    <span className="arrow">&#x203A;</span>
                </button>
            </div>
            <div className="calendar-header">
                {weekDays.map(function (item) {
                    return <span key={item}>{item}</span>;
                })}
            </div>
            {months ? <CalendarBody weeks={months} /> : null}
            <div className={'zone-btns'}>
                <div className={'zone-btns-nav'}>
                    <button
                        className="btn"
                        type="button"
                        onClick={() => changeTimeZoneClick('Europe/Kiev')}
                    >
                        Kyiv <br /> GMT+3
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={() => changeTimeZoneClick('Australia/Sydney')}
                    >
                        Sydney <br /> GMT+10
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={() => changeTimeZoneClick('Pacific/Honolulu')}
                    >
                        Honolulu <br /> GMT-10
                    </button>
                </div>
                <p>* in some cases user's timezone affects today's date</p>
            </div>
        </div>
    );
};

export default CalendarWrapper;
