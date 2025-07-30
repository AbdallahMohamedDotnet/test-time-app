// Dashboard Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const userRoleText = document.getElementById('userRoleText');
    const addUserBtn = document.getElementById('addUserBtn');
    const addExamBtn = document.getElementById('addExamBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const examsContainer = document.getElementById('examsContainer');

    let currentUser = null;
    let exams = [];

    // Initialize dashboard
    function initializeDashboard() {
        currentUser = examApp.getCurrentUser();
        
        if (!currentUser) {
            examApp.navigateToPage('login');
            return;
        }

        setupUserInterface();
        loadExams();
        setupEventListeners();
    }

    // Setup user interface based on user type
    function setupUserInterface() {
        if (currentUser.type === 'admin') {
            userRoleText.textContent = 'Administrator Panel';
            addUserBtn.classList.remove('d-none');
            addExamBtn.classList.remove('d-none');
        } else {
            userRoleText.textContent = 'Student Portal';
        }
    }

    // Load exams
    async function loadExams() {
        try {
            // Simulate API call
            await examApp.simulateApiCall(500);
            
            exams = examApp.getMockExams();
            renderExams();
            
        } catch (error) {
            examApp.showToast('Error loading exams', 'error');
            console.error('Error loading exams:', error);
        }
    }

    // Render exams
    function renderExams() {
        if (!exams || exams.length === 0) {
            examsContainer.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div class="empty-title">No Exams Available</div>
                        <div class="empty-description">There are no exams available at the moment.</div>
                    </div>
                </div>
            `;
            return;
        }

        examsContainer.innerHTML = '';
        
        exams.forEach(exam => {
            const examCard = createExamCard(exam);
            examsContainer.appendChild(examCard);
        });
    }

    // Create exam card
    function createExamCard(exam) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';

        const difficultyClass = getDifficultyClass(exam.difficulty);
        const completedBadge = exam.completed ? 
            `<div class="mt-2"><small class="text-success fw-medium">Score: ${exam.score}%</small></div>` : '';

        col.innerHTML = `
            <div class="card exam-card h-100">
                <div class="card-header d-flex justify-content-between align-items-start">
                    <h5 class="card-title mb-0 fw-bold">${exam.title}</h5>
                    <span class="badge difficulty-badge ${difficultyClass}">${exam.difficulty}</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <p class="card-text text-muted mb-3">${exam.description}</p>
                    
                    <div class="row text-muted mb-3 small">
                        <div class="col-6">
                            <i class="fas fa-clock me-1"></i>
                            ${exam.duration} min
                        </div>
                        <div class="col-6">
                            <i class="fas fa-question-circle me-1"></i>
                            ${exam.totalQuestions} questions
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-light text-dark border">${exam.category}</span>
                        ${completedBadge}
                    </div>
                    
                    <div class="mt-auto">
                        <button class="btn ${exam.completed ? 'btn-outline-primary' : 'btn-primary'} w-100" 
                                onclick="startExam('${exam.id}')">
                            ${exam.completed ? 'Retake Exam' : 'Start Exam'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    // Get difficulty class
    function getDifficultyClass(difficulty) {
        switch (difficulty) {
            case 'Easy': return 'difficulty-easy';
            case 'Medium': return 'difficulty-medium';
            case 'Hard': return 'difficulty-hard';
            default: return 'difficulty-easy';
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        addUserBtn.addEventListener('click', () => {
            examApp.navigateToPage('add-user');
        });

        addExamBtn.addEventListener('click', () => {
            examApp.navigateToPage('add-exam');
        });

        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                examApp.logout();
            }
        });
    }

    // Global function to start exam
    window.startExam = function(examId) {
        const exam = exams.find(e => e.id === examId);
        if (exam) {
            examApp.navigateToPage('exam', { 
                examId: examId,
                examTitle: exam.title,
                duration: exam.duration * 60, // Convert to seconds
                totalQuestions: exam.totalQuestions
            });
        } else {
            examApp.showToast('Exam not found', 'error');
        }
    };

    // Refresh exams
    function refreshExams() {
        loadExams();
    }

    // Search functionality (if needed)
    function searchExams(query) {
        const filteredExams = exams.filter(exam => 
            exam.title.toLowerCase().includes(query.toLowerCase()) ||
            exam.description.toLowerCase().includes(query.toLowerCase()) ||
            exam.category.toLowerCase().includes(query.toLowerCase())
        );
        
        exams = filteredExams;
        renderExams();
    }

    // Initialize dashboard
    initializeDashboard();

    // Add animations
    setTimeout(() => {
        document.querySelectorAll('.exam-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('slide-up');
        });
    }, 100);
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