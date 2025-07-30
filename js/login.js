// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordIcon = document.getElementById('passwordIcon');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');

    // Password toggle functionality
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        if (type === 'text') {
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
        } else {
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
        }
    });

    // Form validation
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            examApp.showToast('Email is required', 'error');
            emailInput.focus();
            return false;
        }

        if (!examApp.validateEmail(email)) {
            examApp.showToast('Please enter a valid email address', 'error');
            emailInput.focus();
            return false;
        }

        if (!password) {
            examApp.showToast('Password is required', 'error');
            passwordInput.focus();
            return false;
        }

        if (!examApp.validatePassword(password)) {
            examApp.showToast('Password must be at least 6 characters long', 'error');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Show loading state
        loginText.classList.add('d-none');
        loginSpinner.classList.remove('d-none');
        loginBtn.disabled = true;

        try {
            // Simulate API call
            await examApp.simulateApiCall(1000);

            // Mock authentication logic
            let userType = null;
            let userName = '';

            if (email === 'admin@exam.com' && password === 'admin123') {
                userType = 'admin';
                userName = 'Administrator';
            } else if (email === 'user@exam.com' && password === 'user123') {
                userType = 'user';
                userName = 'Student User';
            }

            if (userType) {
                const userData = {
                    email: email,
                    name: userName,
                    type: userType,
                    loginTime: new Date().toISOString()
                };

                examApp.login(userData);
                examApp.showToast(`Welcome back, ${userName}!`, 'success');
                
                // Navigate to dashboard
                setTimeout(() => {
                    examApp.navigateToPage('dashboard');
                }, 1000);

            } else {
                examApp.showToast('Invalid email or password. Please try again.', 'error');
            }

        } catch (error) {
            examApp.showToast('An error occurred. Please try again.', 'error');
            console.error('Login error:', error);
        } finally {
            // Hide loading state
            loginText.classList.remove('d-none');
            loginSpinner.classList.add('d-none');
            loginBtn.disabled = false;
        }
    });

    // Demo credential click handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('.bg-light')) {
            const demoSection = e.target.closest('.bg-light');
            const userDemo = demoSection.querySelector('p:nth-child(2)');
            const adminDemo = demoSection.querySelector('p:nth-child(3)');

            if (e.target.closest('p') === userDemo) {
                emailInput.value = 'user@exam.com';
                passwordInput.value = 'user123';
                emailInput.dispatchEvent(new Event('input'));
                passwordInput.dispatchEvent(new Event('input'));
            } else if (e.target.closest('p') === adminDemo) {
                emailInput.value = 'admin@exam.com';
                passwordInput.value = 'admin123';
                emailInput.dispatchEvent(new Event('input'));
                passwordInput.dispatchEvent(new Event('input'));
            }
        }
    });

    // Input validation feedback
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !examApp.validateEmail(email)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    passwordInput.addEventListener('blur', function() {
        const password = this.value.trim();
        if (password && !examApp.validatePassword(password)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Remove validation classes on input
    emailInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });

    passwordInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });

    // Check if already logged in
    const currentUser = examApp.getCurrentUser();
    if (currentUser) {
        examApp.navigateToPage('dashboard');
    }

    // Add fade-in animation
    document.querySelector('.card').classList.add('fade-in');
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, check auth status
        const currentUser = examApp.getCurrentUser();
        if (currentUser) {
            examApp.navigateToPage('dashboard');
        }
    }
});