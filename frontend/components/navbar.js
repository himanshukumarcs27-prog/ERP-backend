// frontend/components/navbar.js

function loadNavbar() {
    const navbarHTML = `
        <header class="top-header">
            <div class="search-container">
                <i class='bx bx-search'></i>
                <input type="text" placeholder="Search...">
            </div>
            <div class="header-actions">
                <div class="user-info">
                    <img src="https://ui-avatars.com/api/?name=User" id="nav-profile-pic">
                    <span id="nav-username">Loading...</span>
                    <i class='bx bx-chevron-down'></i>
                </div>
                <div class="icon-group">
                    <i class='bx bx-bell'></i>
                    <i class='bx bx-envelope'></i>
                    <i class='bx bx-cog'></i>
                </div>
            </div>
        </header>
    `;

    // Inject the navbar into the placeholder element
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        navbarPlaceholder.innerHTML = navbarHTML;
    }
}

// Automatically run when script is loaded
loadNavbar();