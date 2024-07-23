document.addEventListener('DOMContentLoaded', () => {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarBody = document.getElementById('calendarBody');

    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar(month, year) {
        calendarBody.innerHTML = '';
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        calendarTitle.textContent = `${year}년 ${month + 1}월`;

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    const cell = document.createElement('td');
                    const cellText = document.createTextNode('');
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const cell = document.createElement('td');
                    const cellText = document.createTextNode(date);
                    cell.appendChild(cellText);

                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add('today');
                    }

                    if (j === 0 || j === 6) {
                        cell.classList.add('weekend');
                    }

                  
                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
        }
    }


    prevMonth.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonth.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    renderCalendar(currentMonth, currentYear);
});
