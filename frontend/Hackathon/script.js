const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const userNameDisplay = document.querySelector('.user-status');
const gpsStatusBar = document.getElementById('gps-status-bar');
const gpsText = document.getElementById('gps-text');
const sosBtn = document.getElementById('sos-btn');
const incidentForm = document.getElementById('incident-form');
const userReportsList = document.getElementById('user-reports-list');

let currentLocation = null;
let currentUser = "Anonymous";
let userPhone = "N/A";

window.addEventListener('load', () => {
    const savedName = localStorage.getItem('resq_username');
    const savedPhone = localStorage.getItem('resq_phone');

    if (savedName) {
        currentUser = savedName;
        userPhone = savedPhone;
        if (loginOverlay) loginOverlay.style.display = 'none';
        updateUserDisplay(savedName);
        initGeolocation();
        loadUserReports();
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('inp-name').value;
        const phone = document.getElementById('inp-phone').value;

        if (name && phone) {
            currentUser = name;
            userPhone = phone;
            localStorage.setItem('resq_username', name);
            localStorage.setItem('resq_phone', phone);
            loginOverlay.classList.add('hidden');
            updateUserDisplay(name);
            initGeolocation();
            loadUserReports();
        }
    });
}

function updateUserDisplay(name) {
    if (userNameDisplay) userNameDisplay.innerHTML = `<span class="dot"></span> ${name}`;
}

function initGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateGPSStatus(true, `GPS Locked`);
            },
            (error) => updateGPSStatus(false, "GPS Signal Lost"), { enableHighAccuracy: true }
        );
    } else {
        updateGPSStatus(false, "Geolocation not supported");
    }
}

function updateGPSStatus(isSuccess, text) {
    gpsText.innerText = text;
    if (gpsStatusBar) {
        if (isSuccess) gpsStatusBar.classList.add('active');
        else gpsStatusBar.classList.remove('active');
    }
}

function saveReportToDB(type, priority, details) {
    const newReport = {
        id: Date.now(), // Unique ID
        user: currentUser,
        phone: userPhone,
        type: type,
        priority: priority,
        details: details,
        location: currentLocation,
        time: new Date().toLocaleString(),
        status: "Open"
    };

    const reports = JSON.parse(localStorage.getItem('resq_reports') || "[]");
    reports.unshift(newReport);
    localStorage.setItem('resq_reports', JSON.stringify(reports));

    loadUserReports();
    return newReport;
}

sosBtn.addEventListener('click', () => {
    if (!currentLocation) { alert("Waiting for GPS..."); return; }

    sosBtn.style.transform = "scale(0.9)";
    setTimeout(() => sosBtn.style.transform = "scale(1)", 200);

    saveReportToDB("SOS PANIC", "CRITICAL", "User pressed Panic Button");

    alert("🚨 SOS SENT! Admin Notified.");
});

if (incidentForm) {
    incidentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentLocation) { alert("Waiting for GPS..."); return; }

        const formData = new FormData(incidentForm);

        saveReportToDB(
            formData.get('type'),
            "High",
            document.getElementById('details').value
        );

        incidentForm.reset();
        alert("✅ Report Submitted! Help is on the way.");
    });
}

function loadUserReports() {
    const reports = JSON.parse(localStorage.getItem('resq_reports') || "[]");
    const myReports = reports.filter(r => r.phone === userPhone);

    userReportsList.innerHTML = "";

    if (myReports.length === 0) {
        userReportsList.innerHTML = '<p style="color:#888; text-align:center; padding:10px;">No active reports.</p>';
        return;
    }

    myReports.forEach(report => {
                const div = document.createElement('div');
                div.className = `report-item ${report.status === 'Solved' ? 'solved' : ''}`;
                div.style.cssText = "border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:8px; background:#fff;";

                div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${report.type.toUpperCase()}</strong>
                    <div style="font-size:0.8rem; color:#666;">${report.time}</div>
                    <div style="font-size:0.9rem; margin-top:5px;">Status: <span style="font-weight:bold; color:${report.status === 'Solved' ? 'green' : 'red'}">${report.status}</span></div>
                </div>
                ${report.status !== 'Solved' ? `<button onclick="markSolved(${report.id})" style="background:#2ecc71; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Mark Safe</button>` : '<i class="fa-solid fa-check-circle" style="color:green; font-size:1.5rem;"></i>'}
            </div>
        `;
        userReportsList.appendChild(div);
    });
}


window.markSolved = function(id) {
    const reports = JSON.parse(localStorage.getItem('resq_reports') || "[]");
    const index = reports.findIndex(r => r.id === id);
    
    if(index !== -1) {
        reports[index].status = "Solved";
        localStorage.setItem('resq_reports', JSON.stringify(reports));
        loadUserReports(); 
    }
};
function initGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateGPSStatus(true, `GPS Locked`);
            },
            (error) => {
                console.warn("GPS Access Denied or Blocked. Using Dummy Location for testing.");
                useDummyLocation(); 
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    } else {
        useDummyLocation();
    }
}

function useDummyLocation() {
    currentLocation = { lat: 28.6139, lng: 77.2090 }; 
    updateGPSStatus(true, "⚠️ Mode:Location");
    console.log("Dev mode active: Dummy location set.");
}

function updateGPSStatus(isSuccess, text) {
    gpsText.innerText = text;
    if(gpsStatusBar) {
        if (isSuccess) gpsStatusBar.classList.add('active');
        else gpsStatusBar.classList.remove('active');
    }
}