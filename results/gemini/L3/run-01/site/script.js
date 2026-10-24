document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------------
       SPA Routing & Screen Reader Navigation Management
       ------------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('data-target');
            
            // Update Navigation Attributes
            navLinks.forEach(nav => nav.removeAttribute('aria-current'));
            e.target.setAttribute('aria-current', 'page');

            // Toggle Page Visibility
            sections.forEach(section => {
                section.setAttribute('hidden', 'true');
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(targetId);
            targetSection.removeAttribute('hidden');
            targetSection.classList.add('active');

            // Shift focus to the main heading of the newly visible section
            const heading = targetSection.querySelector('h1, h2');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
            }
        });
    });

    /* -------------------------------------------------------------
       Search Announcements (Live Regions)
       ------------------------------------------------------------- */
    window.announceSearch = function() {
        const announcement = document.getElementById('search-announcement');
        const searchInput = document.getElementById('courseSearch').value;
        announcement.textContent = `Search results updated for: ${searchInput || 'All courses'}.`;
    };

    /* -------------------------------------------------------------
       Accessible Form Validation & Error Handling
       ------------------------------------------------------------- */
    const regForm = document.getElementById('courseRegForm');
    let triggerElement = null;

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        let firstInvalidElement = null;

        // Reset all errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('[aria-invalid="true"]').forEach(el => el.setAttribute('aria-invalid', 'false'));

        // Validate Name
        const nameField = document.getElementById('studentName');
        if (nameField.value.trim() === '') {
            isValid = false;
            nameField.setAttribute('aria-invalid', 'true');
            document.getElementById('studentNameError').textContent = 'Error: Full Name is required.';
            if (!firstInvalidElement) firstInvalidElement = nameField;
        }

        // Validate ID
        const idField = document.getElementById('studentID');
        if (idField.value.trim() === '') {
            isValid = false;
            idField.setAttribute('aria-invalid', 'true');
            document.getElementById('studentIDError').textContent = 'Error: Student ID Number is required.';
            if (!firstInvalidElement) firstInvalidElement = idField;
        }

        // Validate Course Selection
        const courseField = document.getElementById('courseSelect');
        if (courseField.value === '') {
            isValid = false;
            courseField.setAttribute('aria-invalid', 'true');
            document.getElementById('courseSelectError').textContent = 'Error: You must select a course.';
            if (!firstInvalidElement) firstInvalidElement = courseField;
        }

        // Handle Result
        if (!isValid) {
            // Shift focus to the first field with an error
            firstInvalidElement.focus();
        } else {
            // Success - Open Modal
            triggerElement = document.activeElement;
            openModal();
            regForm.reset();
        }
    });

    /* -------------------------------------------------------------
       Accessible Modal Dialog (Focus Trapping & Keyboard Events)
       ------------------------------------------------------------- */
    const modalBackdrop = document.getElementById('registrationModal');
    const modalDialog = document.querySelector('.modal-dialog');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Get all focusable elements inside the modal
    const getFocusableElements = () => {
        return modalDialog.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
    };

    const openModal = () => {
        modalBackdrop.removeAttribute('hidden');
        // Focus the modal wrapper to read the title and description via ARIA attributes
        modalDialog.focus();
        // Prevent scrolling on the body behind the modal
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalBackdrop.setAttribute('hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to the element that triggered the modal
        if (triggerElement) {
            triggerElement.focus();
        }
    };

    closeModalBtn.addEventListener('click', closeModal);

    // Trap focus inside modal
    modalBackdrop.addEventListener('keydown', (e) => {
        const focusableElements = getFocusableElements();
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === 'Escape') {
            closeModal();
            e.preventDefault();
        } else if (e.key === 'Tab') {
            // Shift + Tab
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable || document.activeElement === modalDialog) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                // Regular Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
});