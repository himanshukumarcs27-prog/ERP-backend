async function initAdminDashboard() {
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 403) {
            alert("Access Denied: You are not an admin!");
            window.location.href = '../auth/login.html';
        }

        const stats = await response.json();
        // Update stats on the cards here...
        
    } catch (err) {
        console.error("Admin API Error:", err);
    }
}

document.addEventListener('DOMContentLoaded', initAdminDashboard);