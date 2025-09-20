const availableTables = [
    { number: 1, reservations: [] },
    { number: 2, reservations: [] },
    { number: 3, reservations: [] },
    { number: 4, reservations: [] },
    { number: 5, reservations: [] },
    { number: 6, reservations: [] },
    { number: 7, reservations: [] },
    { number: 8, reservations: [] },
    { number: 9, reservations: [] },
    { number: 10, reservations: [] },
    { number: 11, reservations: [] },
    { number: 12, reservations: [] },
];

document.addEventListener('DOMContentLoaded', () => {
    renderTables();
    document.getElementById('reserveButton').addEventListener('click', reserveTable);
    document.getElementById('reportButton').addEventListener('click', generateReport);
});

function renderTables() {
    const availableTablesDiv = document.getElementById('availableTables');
    const occupiedTablesDiv = document.getElementById('occupiedTables');

    availableTablesDiv.innerHTML = '';
    occupiedTablesDiv.innerHTML = '';

    availableTables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';
        tableDiv.innerHTML = `
            <img src="img.jpeg" alt="Mesa ${table.number}">
            <div class="table-name">Mesa ${table.number}</div>
        `;

        if (table.reservations.length === 0) {
            // Disponible
            const reserveButton = document.createElement('button');
            reserveButton.textContent = 'Reservar';
            reserveButton.onclick = () => reserveTableByNumber(table.number);
            tableDiv.appendChild(reserveButton);
            availableTablesDiv.appendChild(tableDiv);
        } else {
            // Ocupada en algunos horarios
            const infoDiv = document.createElement('div');
            infoDiv.className = "reservation-info";
            infoDiv.innerHTML = "<strong>Reservas:</strong><br>";

            table.reservations.forEach((r, index) => {
                const resDiv = document.createElement('div');
                resDiv.className = "reservation-entry";
                resDiv.innerHTML = `${r.cliente} - ${r.fecha} a las ${r.hora} `;

                // Botón liberar reserva
                const freeButton = document.createElement('button');
                freeButton.textContent = 'Liberar';
                freeButton.className = 'free-btn'; // para darle estilo distinto
                freeButton.onclick = () => freeReservation(table.number, index);

                resDiv.appendChild(freeButton);
                infoDiv.appendChild(resDiv);
            });

            const reserveButton = document.createElement('button');
            reserveButton.textContent = 'Reservar otro horario';
            reserveButton.onclick = () => reserveTableByNumber(table.number);

            tableDiv.appendChild(infoDiv);
            tableDiv.appendChild(reserveButton);
            occupiedTablesDiv.appendChild(tableDiv);
        }
    });
}

function reserveTableByNumber(number) {
    const table = availableTables.find(t => t.number === number);
    if (table) {
        const name = prompt("Nombre del cliente:");
        const date = prompt("Fecha de reserva (YYYY-MM-DD):");
        const time = prompt("Hora de reserva (HH:MM):");

        if (name && date && time) {
            const exists = table.reservations.some(r => r.fecha === date && r.hora === time);
            if (exists) {
                alert("Esa mesa ya está reservada en ese horario.");
                return;
            }

            table.reservations.push({ cliente: name, fecha: date, hora: time });
            alert(`Mesa ${number} reservada para ${name} el ${date} a las ${time}.`);
            renderTables();
        } else {
            alert("Debes ingresar todos los datos.");
        }
    } else {
        alert('Mesa no existe.');
    }
}

function reserveTable() {
    const nameInput = document.getElementById('customerName');
    const tableInput = document.getElementById('tableNumber');
    const dateInput = document.getElementById('reservationDate');
    const timeInput = document.getElementById('reservationTime');

    const customerName = nameInput.value.trim();
    const tableNumber = parseInt(tableInput.value);
    const reservationDate = dateInput.value;
    const reservationTime = timeInput.value;

    if (!customerName || isNaN(tableNumber) || !reservationDate || !reservationTime) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const table = availableTables.find(t => t.number === tableNumber);

    if (!table) {
        alert('La mesa no existe.');
    } else {
        const exists = table.reservations.some(r => r.fecha === reservationDate && r.hora === reservationTime);
        if (exists) {
            alert("Esa mesa ya está reservada en ese horario.");
            return;
        }

        table.reservations.push({
            cliente: customerName,
            fecha: reservationDate,
            hora: reservationTime
        });

        alert(`Mesa ${tableNumber} reservada para ${customerName} el ${reservationDate} a las ${reservationTime}.`);

        nameInput.value = '';
        tableInput.value = '';
        dateInput.value = '';
        timeInput.value = '';

        renderTables();
    }
}

function freeReservation(tableNumber, reservationIndex) {
    const table = availableTables.find(t => t.number === tableNumber);
    if (table) {
        const confirmDelete = confirm("¿Seguro que quieres liberar esta reserva?");
        if (confirmDelete) {
            table.reservations.splice(reservationIndex, 1);
            alert(`Reserva eliminada de la Mesa ${tableNumber}.`);
            renderTables();
        }
    }
}

function generateReport() {
    const reportOutput = document.getElementById('reportOutput');
    let reportText = '📋 Reporte de Reservas:\n\n';

    let hasReservations = false;
    availableTables.forEach(table => {
        if (table.reservations.length > 0) {
            hasReservations = true;
            reportText += `Mesa ${table.number}:\n`;
            table.reservations.forEach(r => {
                reportText += `   - ${r.cliente}: ${r.fecha} a las ${r.hora}\n`;
            });
            reportText += '\n';
        }
    });

    if (!hasReservations) {
        reportText = 'No hay reservas registradas.';
    }

    reportOutput.textContent = reportText;
}
