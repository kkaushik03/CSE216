// Navigation logic
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Dummy filter function
function filterCourses() {
    const searchInput = document.getElementById('searchInput').value;
    const deptFilter = document.getElementById('departmentFilter').value;
    // In a real app, this would filter the DOM elements or data array.
    console.log(`Filtering for: ${searchInput} in ${deptFilter}`);
    alert('Filter applied visually (Mock functionality).');
}

// Registration and Modal logic
function handleRegistration(event) {
    event.preventDefault(); // Prevent form submission page reload
    
    // Show confirmation modal
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'flex';
    
    // Reset form
    document.getElementById('regForm').reset();
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}