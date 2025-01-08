// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeGallery();
    initializeContactForm();
    initializeLightbox();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove background color based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll;
    });
}

// Gallery functionality
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Show/hide gallery items based on filter
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // Add animation class
                        setTimeout(() => {
                            item.classList.add('fade-in');
                        }, 0);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            });
        });
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showError(field, 'This field is required');
                } else {
                    clearError(field);
                }
            });

            // Email validation
            const emailField = contactForm.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    showError(emailField, 'Please enter a valid email address');
                }
            }

            if (isValid) {
                try {
                    // Here you would typically send the form data to a server
                    // For now, we'll just simulate a successful submission
                    await simulateFormSubmission(contactForm);
                    
                    showSuccess('Thank you for your message. We will contact you soon.');
                    contactForm.reset();
                } catch (error) {
                    showError(null, 'There was an error submitting the form. Please try again.');
                }
            }
        });

        // Real-time validation
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    showError(field, 'This field is required');
                } else {
                    clearError(field);
                }
            });
        });
    }
}

// Initialize lightbox for gallery
function initializeLightbox() {
    const galleryLinks = document.querySelectorAll('.gallery-item a');
    
    if (galleryLinks.length) {
        galleryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = link.getAttribute('href');
                const title = link.getAttribute('data-title');
                showLightbox(imgSrc, title);
            });
        });
    }
}

// Utility functions
function showError(field, message) {
    clearError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (field) {
        field.classList.add('error');
        field.parentNode.appendChild(errorDiv);
    } else {
        // Show general error message
        const formElement = document.querySelector('.contact-form');
        if (formElement) {
            formElement.insertBefore(errorDiv, formElement.firstChild);
        }
    }
}

function clearError(field) {
    if (field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const formElement = document.querySelector('.contact-form');
    if (formElement) {
        formElement.insertBefore(successDiv, formElement.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Simulate form submission (remove in production)
function simulateFormSubmission(form) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

// Custom lightbox functionality
function showLightbox(imgSrc, title) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imgSrc}" alt="${title}">
            ${title ? `<p class="lightbox-title">${title}</p>` : ''}
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox when clicking outside or on close button
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox') || 
            e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    });
    
    // Close lightbox with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
        }
    });
}

function closeLightbox(lightbox) {
    lightbox.remove();
    document.body.style.overflow = '';
}