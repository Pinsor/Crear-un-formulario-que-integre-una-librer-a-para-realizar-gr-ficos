const colorSchemes = {
    vibrant: {
        name: '🌈 Vibrante',
        colors: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
    },
    ocean: {
        name: '🌊 Océano',
        colors: ['#0077be', '#00a8e8', '#00c9ff', '#7dd3fc', '#38bdf8', '#0284c7']
    },
    forest: {
        name: '🌲 Bosque',
        colors: ['#22c55e', '#16a34a', '#15803d', '#84cc16', '#65a30d', '#4d7c0f']
    },
    sunset: {
        name: '🌅 Atardecer',
        colors: ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#7c3aed']
    },
    pastel: {
        name: '🎨 Pastel',
        colors: ['#fecaca', '#fed7aa', '#fef08a', '#d9f99d', '#bbf7d0', '#bfdbfe']
    },
    dark: {
        name: '🌑 Oscuro',
        colors: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db']
    }
};

const examples = {
    sales: {
        title: 'Ventas Mensuales 2025',
        labels: 'Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sept, Oct, Novi, Dici',
        values: '45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 85641, 48965, 25869, 48659'
    },
    expenses: {
        title: 'Gastos por Departamento',
        labels: 'TI, Marketing, Ventas, RRHH, Operaciones, Logística',
        values: '25000, 18000, 32000, 12000, 28000, 15000'
    },
    users: {
        title: 'Usuarios Activos por Región',
        labels: 'Norte, Sur, Este, Oeste, Centro',
        values: '1250, 890, 1450, 1120, 1680'
    },
    performance: {
        title: 'Índice de Rendimiento por Equipo',
        labels: 'Equipo A, Equipo B, Equipo C, Equipo D, Equipo E',
        values: '92, 88, 95, 85, 90'
    }
};

let myChart = null;
let currentScheme = 'vibrant';
let chartHistory = [];

function initColorSchemes() {
    const container = document.getElementById('colorSchemes');
    Object.keys(colorSchemes).forEach(key => {
        const scheme = colorSchemes[key];
        const div = document.createElement('div');
        div.className = `color-scheme ${key === currentScheme ? 'active' : ''}`;
        div.onclick = () => selectColorScheme(key);
        div.innerHTML = `
            <div class="color-preview">
                ${scheme.colors.slice(0, 3).map(color => `<span style="background: ${color}"></span>`).join('')}
            </div>
            <div>${scheme.name}</div>
        `;
        container.appendChild(div);
    });
}

function selectColorScheme(scheme) {
    currentScheme = scheme;
    document.querySelectorAll('.color-scheme').forEach(el => {
        el.classList.remove('active');
    });
    event.target.closest('.color-scheme').classList.add('active');
}

function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
}

function generateChart() {
    const title = document.getElementById('chartTitle').value;
    const type = document.getElementById('chartType').value;
    const labelsText = document.getElementById('chartLabels').value;
    const valuesText = document.getElementById('chartValues').value;

    if (!title || !labelsText || !valuesText) {
        showAlert('Por favor complete todos los campos', 'error');
        return;
    }

    const labels = labelsText.split(',').map(l => l.trim());
    const values = valuesText.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (labels.length !== values.length) {
        showAlert('El número de etiquetas debe coincidir con los valores', 'error');
        return;
    }

    const colors = colorSchemes[currentScheme].colors;
    const bgColors = labels.map((_, i) => colors[i % colors.length] + 'CC');
    const borderColors = labels.map((_, i) => colors[i % colors.length]);

    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

    const chartType = type === 'horizontalBar' ? 'bar' : type;
    const indexAxis = type === 'horizontalBar' ? 'y' : 'x';

    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: indexAxis,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: false
                }
            },
            scales: ['pie', 'doughnut', 'radar', 'polarArea'].includes(type) ? {} : {
                y: {
                    beginAtZero: true
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });

    document.getElementById('currentTitle').textContent = `📈 ${title}`;
    updateStats(values);
    updateTable(labels, values);
    
    chartHistory.unshift({
        title,
        type,
        labels: labelsText,
        values: valuesText,
        scheme: currentScheme,
        timestamp: new Date().toLocaleString()
    });
    
    if (chartHistory.length > 10) chartHistory.pop();

    showAlert('¡Gráfico generado exitosamente!', 'success');
}

function updateStats(values) {
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="value">${total.toLocaleString()}</div>
            <div class="label">Total</div>
        </div>
        <div class="stat-card">
            <div class="value">${avg.toFixed(1)}</div>
            <div class="label">Promedio</div>
        </div>
        <div class="stat-card">
            <div class="value">${max.toLocaleString()}</div>
            <div class="label">Máximo</div>
        </div>
        <div class="stat-card">
            <div class="value">${min.toLocaleString()}</div>
            <div class="label">Mínimo</div>
        </div>
    `;
}

function updateTable(labels, values) {
    const tbody = document.getElementById('dataTableBody');
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;

    tbody.innerHTML = labels.map((label, i) => {
        const value = values[i];
        const percentage = ((value / total) * 100).toFixed(1);
        const diff = value - avg;
        const diffText = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
        return `
            <tr>
                <td>${label}</td>
                <td><strong>${value.toLocaleString()}</strong></td>
                <td>${percentage}%</td>
                <td>${diffText}</td>
            </tr>
        `;
    }).join('');
}

function loadExample(type) {
    const example = examples[type];
    document.getElementById('chartTitle').value = example.title;
    document.getElementById('chartLabels').value = example.labels;
    document.getElementById('chartValues').value = example.values;
    showAlert(`Ejemplo "${example.title}" cargado`, 'success');
}

function clearForm() {
    document.getElementById('chartTitle').value = '';
    document.getElementById('chartLabels').value = '';
    document.getElementById('chartValues').value = '';
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    document.getElementById('currentTitle').textContent = '📈 Vista Previa';
    document.getElementById('statsGrid').innerHTML = '';
    document.getElementById('dataTableBody').innerHTML = `
        <tr><td colspan="4" class="empty-state">
            <div><p>📊 No hay datos para mostrar</p>
            <small>Ingrese datos y genere un gráfico</small></div>
        </td></tr>
    `;
    showAlert('Formulario limpiado', 'success');
}

function exportChart() {
    if (!myChart) {
        showAlert('Primero genere un gráfico', 'error');
        return;
    }
    const url = myChart.toBase64Image();
    const link = document.createElement('a');
    link.download = 'grafico.png';
    link.href = url;
    link.click();
    showAlert('Gráfico exportado exitosamente', 'success');
}

function toggleHistory() {
    if (chartHistory.length === 0) {
        showAlert('No hay gráficos en el historial', 'error');
        return;
    }
    
    const historyHtml = chartHistory.map((item, i) => `
        <div class="history-item" onclick="loadFromHistory(${i})">
            <strong>${item.title}</strong>
            <small>${item.timestamp} • ${item.type}</small>
        </div>
    `).join('');
    
    showAlert('Función de historial disponible - ' + chartHistory.length + ' gráficos guardados', 'success');
}

function loadFromHistory(index) {
    const item = chartHistory[index];
    document.getElementById('chartTitle').value = item.title;
    document.getElementById('chartType').value = item.type;
    document.getElementById('chartLabels').value = item.labels;
    document.getElementById('chartValues').value = item.values;
    currentScheme = item.scheme;
    selectColorScheme(item.scheme);
    generateChart();
}

// Inicializar
initColorSchemes();
loadExample('sales');
