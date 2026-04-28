// Inside frontend/js/teacher/dashboard.js

async function loadTeacherDashboard() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        // Fetch teacher specific profile
        const response = await fetch('http://localhost:5000/api/teacher/dashboard-data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            renderTeacherUI(data);
        }
    } catch (error) {
        console.error("Error connecting to Teacher API:", error);
    }
}

function renderTeacherUI(data) {
    // 1. Update Name & Profile
    // Note: We use "Dr." or "Prof." prefix for teachers as seen in the image
    const fullName = data.name || "Professor";
    document.getElementById('teacher-name-header').innerText = `Dr. ${fullName}`;
    document.getElementById('welcome-teacher').innerText = `Dr. ${fullName.split(' ')[0]}`;
    document.getElementById('teacher-profile-pic').src = `https://ui-avatars.com/api/?name=${fullName}&background=1e3a5f&color=fff`;

    // 2. Update Stats
    document.getElementById('dept-name').innerText = data.department || "General Faculty";
    document.getElementById('total-students-count').innerText = data.totalStudents || "0";
    document.getElementById('pending-tasks').innerText = data.pendingAssignments || "0";

    // 3. Logic for Dynamic Classes (Optional)
    // If you have a loop to show classes, you would inject them into #classes-list
}

document.addEventListener('DOMContentLoaded', loadTeacherDashboard);