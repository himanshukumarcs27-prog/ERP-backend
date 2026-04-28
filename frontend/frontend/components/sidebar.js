// frontend/components/sidebar.js

function loadSidebar(role) {
    let links = '';
    
    if (role === 'admin') {
        links = `
            <a href="dashboard.html" class="nav-item active"><i class='bx bxs-dashboard'></i> Overview</a>
            <a href="users.html" class="nav-item"><i class='bx bxs-user'></i> Manage Users</a>
        `;
    } else if (role === 'student') {
        links = `
            <a href="dashboard.html" class="nav-item active"><i class='bx bxs-dashboard'></i> Dashboard</a>
            <a href="courses.html" class="nav-item"><i class='bx bxs-book'></i> My Courses</a>
        `;
    }

    const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <span class="logo-text">EduLearn ERP</span>
            </div>
            <nav class="sidebar-nav">${links}</nav>
        </aside>
    `;

    document.getElementById('sidebar-placeholder').innerHTML = sidebarHTML;
}