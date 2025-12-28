let currentView = 'dashboard';

window.addEventListener('load', () => {
    refreshAll();
});

function switchView(viewName, menuElement) {

    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    menuElement.classList.add('active');

    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');

    const viewId = `view-${viewName}`;
    const selectedView = document.getElementById(viewId);
    if (selectedView) selectedView.style.display = 'block';

    const titles = {
        'dashboard': 'Live Incident Monitor',
        'units': 'Active Units Status',
        'analytics': 'Performance Analytics'
    };
    document.getElementById('page-title').innerText = titles[viewName];

    if (viewName === 'dashboard') loadAdminReports();
    if (viewName === 'units') loadUnitsData();
    if (viewName === 'analytics') loadAnalyticsData();

    if (window.innerWidth <= 768) toggleSidebar();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function refreshAll() {
    loadAdminReports();

    const activeView = document.querySelector('.view-section[style*="block"]');
    if (activeView && activeView.id === 'view-units') loadUnitsData();
    if (activeView && activeView.id === 'view-analytics') loadAnalyticsData();

    console.log("Data Refreshed");
}

function loadAdminReports() {
    const reports = JSON.parse(localStorage.getItem('resq_reports') || "[]");

    // Update Stats
    document.getElementById('stat-total').innerText = reports.length;
    document.getElementById('stat-active').innerText = reports.filter(r => r.status === 'Open').length;
    document.getElementById('stat-solved').innerText = reports.filter(r => r.status === 'Solved').length;

    const tbody = document.querySelector('#reports-table tbody');
    tbody.innerHTML = "";

    if (reports.length === 0) {
        tbody.innerHTML = "<tr><td colspan='8' style='text-align:center; padding: 20px;'>No incidents reported yet.</td></tr>";
        return;
    }

    reports.forEach(report => {
                const row = document.createElement('tr');

                // Generate Maps Link
                const mapLink = report.location ?
                    `https://www.google.com/maps?q=${report.location.lat},${report.location.lng}` :
                    "#";

                const badgeClass = report.status === 'Open' ? 'bg-red' : 'bg-green';

                row.innerHTML = `
            <td>${report.time.split(',')[1] || report.time}</td>
            <td><strong>${report.user}</strong></td>
            <td>${report.phone}</td>
            <td><span style="text-transform:capitalize">${report.type}</span></td>
            <td style="max-width: 200px; overflow:hidden; text-overflow:ellipsis;">${report.details || "N/A"}</td>
            <td>
                <a href="${mapLink}" target="_blank" class="btn-loc">
                    <i class="fa-solid fa-location-arrow"></i> Map
                </a>
            </td>
            <td><span class="badge ${badgeClass}">${report.status}</span></td>
            <td>
                ${report.status === 'Open' 
                    ? `<button onclick="toggleStatus(${report.id})" class="btn-solve"><i class="fa-solid fa-check"></i> Solve</button>` 
                    : '<span style="color:#aaa; font-size:0.85rem;"><i class="fa-solid fa-lock"></i> Closed</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

window.toggleStatus = function(id) {
    const reports = JSON.parse(localStorage.getItem('resq_reports') || "[]");
    const index = reports.findIndex(r => r.id === id);
    if(index !== -1) {
        reports[index].status = reports[index].status === "Open" ? "Solved" : "Open";
        localStorage.setItem('resq_reports', JSON.stringify(reports));
        loadAdminReports();
    }
};

function loadUnitsData() {
    const units = [
        { id: "P-101", type: "Police Patrol", status: "Busy", loc: "Sector 4", eta: "5 min" },
        { id: "A-202", type: "Ambulance", status: "Available", loc: "Hospital HQ", eta: "0 min" },
        { id: "F-305", type: "Fire Engine", status: "Available", loc: "Fire Station 1", eta: "0 min" },
        { id: "P-104", type: "Police Bike", status: "Patrolling", loc: "Main Market", eta: "12 min" },
        { id: "A-205", type: "Ambulance", status: "Busy", loc: "Highway 44", eta: "25 min" }
    ];

    const tbody = document.getElementById('units-body');
    tbody.innerHTML = "";

    units.forEach(unit => {
        let statusColor = unit.status === "Available" ? "#2ecc71" : "#e74c3c";
        const row = `
            <tr>
                <td><strong>${unit.id}</strong></td>
                <td>${unit.type}</td>
                <td><span style="color:${statusColor}; font-weight:bold;">${unit.status}</span></td>
                <td>${unit.loc}</td>
                <td>${unit.eta}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadAnalyticsData() {
    const reports = JSON.parse(localStorage.getItem('resq_reports') || "[]");
    
    // Count Types
    let counts = { "accident": 0, "medical": 0, "fire": 0, "crime": 0 };
    reports.forEach(r => {
        if(counts[r.type] !== undefined) counts[r.type]++;
        else counts[r.type] = 1;
    });

    const total = reports.length || 1; 
    const chartDiv = document.getElementById('chart-types');
    chartDiv.innerHTML = "";

    for (const [type, count] of Object.entries(counts)) {
        const percentage = Math.round((count / total) * 100);
        
        let color = '#3498db';
        if(type === 'fire') color = '#e74c3c';
        if(type === 'medical') color = '#2ecc71';
        if(type === 'crime') color = '#9b59b6';

        chartDiv.innerHTML += `
            <div class="bar-wrapper">
                <div class="bar-header">
                    <span style="text-transform:capitalize; font-weight:600;">${type}</span>
                    <span>${count} (${percentage}%)</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width:${percentage}%; background:${color};"></div>
                </div>
            </div>
        `;
    }
}
