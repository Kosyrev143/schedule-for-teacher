import React from 'react';
import { useLocation } from "react-router-dom";
import './css/ScheduleTable.css';

const daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
];

function ScheduleTable() {
    const location = useLocation();
    const { response } = location.state || {};
    const { surname } = location.state || {};

    // Group the schedule data by day of the week
    const groupByDay = (data) => {
        return daysOfWeek.reduce((acc, day) => {
            acc[day] = data.cells.filter(item => item.day_of_week === day);
            return acc;
        }, {});
    };

    // Fill the rows to ensure there are 6 rows for each day, even if some are empty
    const fillTableRows = (rows) => {
        const filledRows = [];
        for (let i = 1; i <= 6; i++) {
            const row = rows.find(item => parseInt(item.pair_number, 10) === i) || {
                pair_number: i,
                subject: '-',
                group: '-',
                auditorium: '-',
            };
            filledRows.push(row);
        }
        return filledRows;
    };

    // Group rows by day
    const groupedRows = groupByDay(response);

    return (
        <div className="schedule-table-container">
            <div className="schedule-table-header">
                <h2>Преподаватель: {surname}</h2>
            </div>
            <div className="tables">
                {daysOfWeek.map((day) => (
                    <div key={day} className="table-wrapper">
                        <h3 className="day-heading">{day}</h3>
                        <table className="schedule-table">
                            <thead>
                            <tr>
                                <th>Номер пары</th>
                                <th>Предмет</th>
                                <th>Группа</th>
                                <th>Аудитория</th>
                            </tr>
                            </thead>
                            <tbody>
                            {fillTableRows(groupedRows[day]).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.pair_number}</td>
                                    <td>{item.subject}</td>
                                    <td>{item.group}</td>
                                    <td>{item.auditorium}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ScheduleTable;
