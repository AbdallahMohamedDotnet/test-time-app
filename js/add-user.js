// Add User Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const addUserForm = document.getElementById('addUserForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const roleSelect = document.getElementById('role');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordIcon = document.getElementById('passwordIcon');
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserText = document.getElementById('addUserText');
    const addUserSpinner = document.getElementById('addUserSpinner');
    const userCount = document.getElementById('userCount');
    const usersContainer = document.getElementById('usersContainer');

    let users = [];

    // Initialize page
    function initializePage() {
        const currentUser = examApp.getCurrentUser();
        
        if (!currentUser) {
            examApp.navigateToPage('login');
            return;
        }

        if (currentUser.type !== 'admin') {
            examApp.showToast('Access denied. Admin privileges required.', 'error');
            examApp.navigateToPage('dashboard');
            return;
        }

        loadUsers();
        setupEventListeners();
    }

    // Load users
    async function loadUsers() {
        try {
            // Simulate API call
            await examApp.simulateApiCall(500);
            
            users = examApp.getMockUsers();
            renderUsers();
            
        } catch (error) {
            examApp.showToast('Error loading users', 'error');
            console.error('Error loading users:', error);
        }
    }

    // Render users
    function renderUsers() {
        userCount.textContent = users.length;
        
        if (users.length === 0) {
            usersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="empty-title">No Users Found</div>
                    <div class="empty-description">Start by adding your first user account.</div>
                </div>
            `;
            return;
        }

        usersContainer.innerHTML = '';
        
        users.forEach(user => {
            const userCard = createUserCard(user);
            usersContainer.appendChild(userCard);
        });
    }

    // Create user card
    function createUserCard(user) {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-card';

        const statusClass = user.status === 'Active' ? 'status-active' : 'status-inactive';
        const roleClass = user.role === 'Admin' ? 'bg-primary' : 'bg-secondary';
        const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();

        userDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center flex-grow-1">
                    <div class="user-avatar me-3">
                        ${initials}
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">${user.fullName}</h6>
                        <p class="mb-1 text-muted small">${user.email}</p>
                        <div class="d-flex gap-2">
                            <span class="badge role-badge ${roleClass}">${user.role}</span>
                            <span class="badge role-badge ${statusClass}">${user.status}</span>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <small class="text-muted">Added: ${user.dateAdded}</small>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteUser('${user.id}')" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        return userDiv;
    }

    // Setup event listeners
    function setupEventListeners() {
        backBtn.addEventListener('click', () => {
            examApp.navigateToPage('dashboard');
        });

        // Password toggle
        togglePasswordBtn.addEventListener('click', () => {
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

        // Generate password
        generatePasswordBtn.addEventListener('click', () => {
            const password = generateRandomPassword();
            passwordInput.value = password;
            passwordInput.type = 'text';
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
            examApp.showToast('Password generated successfully!', 'success');
        });

        // Form submission
        addUserForm.addEventListener('submit', handleFormSubmit);

        // Input validation
        emailInput.addEventListener('blur', validateEmail);
        passwordInput.addEventListener('blur', validatePassword);
    }

    // Generate random password
    function generateRandomPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // Validate form
    function validateForm() {
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!fullName) {
            examApp.showToast('Full name is required', 'error');
            fullNameInput.focus();
            return false;
        }

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

        // Check if email already exists
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            examApp.showToast('Email already exists', 'error');
            emailInput.focus();
            return false;
        }

        return true;
    }

    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        if (email && !examApp.validateEmail(email)) {
            emailInput.classList.add('is-invalid');
        } else {
            emailInput.classList.remove('is-invalid');
        }
    }

    // Validate password
    function validatePassword() {
        const password = passwordInput.value.trim();
        if (password && !examApp.validatePassword(password)) {
            passwordInput.classList.add('is-invalid');
        } else {
            passwordInput.classList.remove('is-invalid');
        }
    }

    // Handle form submit
    async function handleFormSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        // Show loading state
        addUserText.classList.add('d-none');
        addUserSpinner.classList.remove('d-none');
        addUserBtn.disabled = true;

        try {
            // Simulate API call
            await examApp.simulateApiCall(1000);

            const newUser = {
                id: examApp.generateId(),
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                role: roleSelect.value,
                dateAdded: new Date().toISOString().split('T')[0],
                status: 'Active'
            };

            users.unshift(newUser);
            renderUsers();

            examApp.showToast(`User ${newUser.fullName} has been added successfully!`, 'success');

            // Reset form
            addUserForm.reset();

        } catch (error) {
            examApp.showToast('Error adding user', 'error');
            console.error('Error adding user:', error);
        } finally {
            // Hide loading state
            addUserText.classList.remove('d-none');
            addUserSpinner.classList.add('d-none');
            addUserBtn.disabled = false;
        }
    }

    // Delete user (global function)
    window.deleteUser = function(userId) {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
            users = users.filter(u => u.id !== userId);
            renderUsers();
            examApp.showToast('User deleted successfully', 'success');
        }
    };

    // Initialize page
    initializePage();

    // Add animations
    document.querySelector('.container-fluid').classList.add('fade-in');
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, check auth status
        const currentUser = examApp.getCurrentUser();
        if (!currentUser) {
            examApp.navigateToPage('login');
        }
    }
});