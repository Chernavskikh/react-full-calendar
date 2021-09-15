import { DateTime } from 'luxon';

const text = 'WRAPPER'
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dt = DateTime.fromFormat('01/09/2021', 'dd/MM/yyyy');
const month = dt.month;

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

const calendarWrapper = () => {
    return (
        <div className="calendar-wrapper">
            <div className="calendar-header">
                { weekDays.map(function (item) {
                    return (<span key={item}>{item}</span>)
                })}
            </div>
            {text}
            {month}
        </div>
    )
}

export default calendarWrapper
