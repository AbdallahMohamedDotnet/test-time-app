// Main JavaScript - Core functionality and utilities

class ExamApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.examData = {};
        this.initializeApp();
    }

    initializeApp() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('examApp_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.navigateToPage('dashboard');
        }
    }

    // Navigation
    navigateToPage(page, data = {}) {
        this.currentPage = page;
        this.examData = { ...this.examData, ...data };
        
        switch (page) {
            case 'dashboard':
                window.location.href = 'dashboard.html';
                break;
            case 'exam':
                localStorage.setItem('examApp_currentExam', JSON.stringify(data));
                window.location.href = 'exam.html';
                break;
            case 'result':
                localStorage.setItem('examApp_examResult', JSON.stringify(data));
                window.location.href = 'result.html';
                break;
            case 'add-user':
                window.location.href = 'add-user.html';
                break;
            case 'add-exam':
                window.location.href = 'add-exam.html';
                break;
            case 'login':
                this.logout();
                break;
        }
    }

    // Authentication
    login(userData) {
        this.currentUser = userData;
        localStorage.setItem('examApp_user', JSON.stringify(userData));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('examApp_user');
        localStorage.removeItem('examApp_currentExam');
        localStorage.removeItem('examApp_examResult');
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('examApp_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastId = 'toast_' + Date.now();
        const toastHtml = `
            <div class="toast toast-custom toast-${type} fade show" id="${toastId}" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <div class="d-flex align-items-center">
                            <i class="fas ${this.getToastIcon(type)} me-2"></i>
                            ${message}
                        </div>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);

        // Auto remove toast
        setTimeout(() => {
            const toastElement = document.getElementById(toastId);
            if (toastElement) {
                toastElement.remove();
            }
        }, duration);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // Utility Functions
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        return password && password.length >= 6;
    }

    // Loading States
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('loading');
        }
    }

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('loading');
        }
    }

    // Animation Utilities
    animateValue(element, start, end, duration = 1000) {
        const startTime = performance.now();
        
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(start + (end - start) * progress);
            element.textContent = currentValue + (element.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };
        
        requestAnimationFrame(updateValue);
    }

    // Local Storage Helpers
    saveToStorage(key, data) {
        try {
            localStorage.setItem(`examApp_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    getFromStorage(key) {
        try {
            const data = localStorage.getItem(`examApp_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting from storage:', error);
            return null;
        }
    }

    removeFromStorage(key) {
        try {
            localStorage.removeItem(`examApp_${key}`);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }

    // API Simulation
    async simulateApiCall(duration = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // Mock Data
    getMockExams() {
        return [
            {
                id: '1',
                title: 'JavaScript Fundamentals',
                description: 'Test your knowledge of JavaScript basics, variables, functions, and ES6 features.',
                duration: 30,
                totalQuestions: 15,
                difficulty: 'Easy',
                category: 'Programming',
            },
            {
                id: '2',
                title: 'React Development',
                description: 'Advanced React concepts including hooks, context, and performance optimization.',
                duration: 45,
                totalQuestions: 20,
                difficulty: 'Medium',
                category: 'Frontend',
            },
            {
                id: '3',
                title: 'Database Design',
                description: 'SQL queries, database normalization, and relational database concepts.',
                duration: 60,
                totalQuestions: 25,
                difficulty: 'Hard',
                category: 'Backend',
                completed: true,
                score: 85,
            },
            {
                id: '4',
                title: 'CSS & Styling',
                description: 'Modern CSS, Flexbox, Grid, and responsive design principles.',
                duration: 40,
                totalQuestions: 18,
                difficulty: 'Medium',
                category: 'Frontend',
            },
        ];
    }

    getMockQuestions() {
        return [
            {
                id: '1',
                text: 'What is the correct way to declare a variable in JavaScript ES6?',
                options: ['var myVar = 5;', 'let myVar = 5;', 'const myVar = 5;', 'All of the above'],
                correctAnswer: 3,
                category: 'Variables'
            },
            {
                id: '2',
                text: 'Which method is used to add an element to the end of an array?',
                options: ['push()', 'pop()', 'shift()', 'unshift()'],
                correctAnswer: 0,
                category: 'Arrays'
            },
            {
                id: '3',
                text: 'What does the "this" keyword refer to in JavaScript?',
                options: ['The global object', 'The current function', 'The object that calls the function', 'It depends on the context'],
                correctAnswer: 3,
                category: 'Functions'
            },
            {
                id: '4',
                text: 'Which of the following is NOT a primitive data type in JavaScript?',
                options: ['string', 'number', 'object', 'boolean'],
                correctAnswer: 2,
                category: 'Data Types'
            },
            {
                id: '5',
                text: 'What is the purpose of the useState hook in React?',
                options: ['To manage component state', 'To handle side effects', 'To create refs', 'To optimize performance'],
                correctAnswer: 0,
                category: 'React Hooks'
            }
        ];
    }

    getMockUsers() {
        return [
            {
                id: '1',
                fullName: 'John Doe',
                email: 'john@example.com',
                role: 'User',
                dateAdded: '2024-01-15',
                status: 'Active'
            },
            {
                id: '2',
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                role: 'Admin',
                dateAdded: '2024-01-10',
                status: 'Active'
            },
            {
                id: '3',
                fullName: 'Mike Johnson',
                email: 'mike@example.com',
                role: 'User',
                dateAdded: '2024-01-20',
                status: 'Inactive'
            }
        ];
    }
}

// Initialize the app
const app = new ExamApp();

// Make app globally available
window.examApp = app;