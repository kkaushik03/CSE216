document.addEventListener('DOMContentLoaded', () => {
    // Navigation routing
    const navLinks = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update aria-current and active classes on nav
            navLinks.forEach(nav => {
                nav.classList.remove('active');
                nav.removeAttribute('aria-current');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-current', 'page');

            // Hide all pages, update aria-hidden attributes
            pages.forEach(page => {
                page.classList.remove('active');
                page.setAttribute('hidden', 'true');
            });

            // Show selected page
            const targetId = e.target.getAttribute('data-target');
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.removeAttribute('hidden');
                
                // Accessibility best practice: focus the heading of the new page
                const heading = targetPage.querySelector('h1, h2');
                if(heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus();
                }
            }
        });
    });

    // Mock filter functionality
    window.applyFilters = () => {
        const searchVal = document.getElementById('searchInput').value;
        const deptVal = document.getElementById('departmentFilter').value;
        console.log(`Filtering UI... Search: "${searchVal}", Dept: "${deptVal}"`);
        // In a fully integrated app, this would hide/show .course-card elements
    };

    // Registration Form & Modal handling (with focus management)
    const form = document.getElementById('registrationForm');
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.getElementById('closeModalBtn');
    let previouslyFocusedElement;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Save the element that triggered the modal for later
        previouslyFocusedElement = document.activeElement;
        
        // Open modal
        modal.removeAttribute('hidden');
        
        // Focus inside the modal for screen readers and keyboard users
        closeBtn.focus();
        
        // Reset form
        form.reset();
    });

    // Close Modal functionality
    const closeModal = () => {
        modal.setAttribute('hidden', 'true');
        // Return focus to where it was before opening the modal
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    };

    closeBtn.addEventListener('click', closeModal);

    // Trap focus inside modal when it is open (Accessibility best practice)
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'Tab') {
            // Since this modal only has one focusable element (the close button),
            // prevent tab from leaving the modal.
            e.preventDefault();
            closeBtn.focus();
        }
    });
});