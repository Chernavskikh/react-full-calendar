import { calcWeeksInMonth } from '../components/CalendarWrapper'

test('expect weeks in month calculates correctly', () => {
    expect(calcWeeksInMonth('01/09/2013')).toBe(6);
    expect(calcWeeksInMonth('30/08/2020')).toBe(6);
    expect(calcWeeksInMonth('12/12/2020')).toBe(5);
    expect(calcWeeksInMonth('01/02/2021')).toBe(4);
    expect(calcWeeksInMonth('01/05/2021')).toBe(6);
    expect(calcWeeksInMonth('01/09/2021')).toBe(5);
});
