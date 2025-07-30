// Add Exam Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const examConfigForm = document.getElementById('examConfigForm');
    const examTitleInput = document.getElementById('examTitle');
    const examDescriptionInput = document.getElementById('examDescription');
    const examCategoryInput = document.getElementById('examCategory');
    const examDurationInput = document.getElementById('examDuration');
    const examDifficultySelect = document.getElementById('examDifficulty');
    const questionCountSpan = document.getElementById('questionCount');
    const durationDisplaySpan = document.getElementById('durationDisplay');
    const difficultyBadge = document.getElementById('difficultyBadge');
    const createExamBtn = document.getElementById('createExamBtn');
    const createExamText = document.getElementById('createExamText');
    const createExamSpinner = document.getElementById('createExamSpinner');

    const questionForm = document.getElementById('questionForm');
    const questionTextInput = document.getElementById('questionText');
    const questionCategoryInput = document.getElementById('questionCategory');
    const optionsContainer = document.getElementById('optionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsCount = document.getElementById('questionsCount');
    const questionsContainer = document.getElementById('questionsContainer');

    let examData = {
        title: '',
        description: '',
        category: '',
        duration: 30,
        difficulty: 'Easy',
        questions: []
    };

    let currentQuestion = {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: ''
    };

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

        setupInterface();
        setupEventListeners();
    }

    // Setup interface
    function setupInterface() {
        createOptionInputs();
        updateSummary();
        updateQuestionsDisplay();
    }

    // Create option inputs
    function createOptionInputs() {
        optionsContainer.innerHTML = '';
        
        for (let i = 0; i < 4; i++) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'd-flex align-items-center mb-2';
            optionDiv.innerHTML = `
                <div class="me-3">
                    <input type="radio" name="correctAnswer" value="${i}" id="correct${i}" 
                           ${i === 0 ? 'checked' : ''} class="form-check-input">
                    <label for="correct${i}" class="form-check-label small">Option ${i + 1}</label>
                </div>
                <input type="text" class="form-control" placeholder="Enter option ${i + 1}" 
                       data-option="${i}" value="${currentQuestion.options[i]}">
            `;
            optionsContainer.appendChild(optionDiv);
        }

        // Add event listeners to option inputs
        optionsContainer.querySelectorAll('input[type="text"]').forEach((input, index) => {
            input.addEventListener('input', (e) => {
                currentQuestion.options[index] = e.target.value;
            });
        });

        optionsContainer.querySelectorAll('input[type="radio"]').forEach((radio, index) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    currentQuestion.correctAnswer = index;
                }
            });
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        backBtn.addEventListener('click', () => {
            examApp.navigateToPage('dashboard');
        });

        // Exam config form listeners
        examTitleInput.addEventListener('input', (e) => {
            examData.title = e.target.value;
            updateSummary();
        });

        examDescriptionInput.addEventListener('input', (e) => {
            examData.description = e.target.value;
            updateSummary();
        });

        examCategoryInput.addEventListener('input', (e) => {
            examData.category = e.target.value;
            updateSummary();
        });

        examDurationInput.addEventListener('input', (e) => {
            examData.duration = parseInt(e.target.value) || 30;
            updateSummary();
        });

        examDifficultySelect.addEventListener('change', (e) => {
            examData.difficulty = e.target.value;
            updateSummary();
        });

        // Question form listeners
        questionTextInput.addEventListener('input', (e) => {
            currentQuestion.text = e.target.value;
        });

        questionCategoryInput.addEventListener('input', (e) => {
            currentQuestion.category = e.target.value;
        });

        addQuestionBtn.addEventListener('click', addQuestion);
        createExamBtn.addEventListener('click', createExam);
    }

    // Update summary
    function updateSummary() {
        questionCountSpan.textContent = examData.questions.length;
        durationDisplaySpan.textContent = examData.duration;
        
        difficultyBadge.textContent = examData.difficulty;
        difficultyBadge.className = `badge ${getDifficultyClass(examData.difficulty)}`;
        
        // Enable/disable create button
        const canCreate = examData.title.trim() && 
                         examData.description.trim() && 
                         examData.category.trim() && 
                         examData.questions.length >= 5;
        
        createExamBtn.disabled = !canCreate;
    }

    // Get difficulty class
    function getDifficultyClass(difficulty) {
        switch (difficulty) {
            case 'Easy': return 'bg-success';
            case 'Medium': return 'bg-warning';
            case 'Hard': return 'bg-danger';
            default: return 'bg-success';
        }
    }

    // Validate question
    function validateQuestion() {
        if (!currentQuestion.text.trim()) {
            examApp.showToast('Question text is required', 'error');
            questionTextInput.focus();
            return false;
        }

        if (!currentQuestion.category.trim()) {
            examApp.showToast('Question category is required', 'error');
            questionCategoryInput.focus();
            return false;
        }

        if (currentQuestion.options.some(option => !option.trim())) {
            examApp.showToast('All answer options must be filled', 'error');
            return false;
        }

        return true;
    }

    // Add question
    async function addQuestion() {
        if (!validateQuestion()) return;

        try {
            const newQuestion = {
                id: examApp.generateId(),
                text: currentQuestion.text,
                options: [...currentQuestion.options],
                correctAnswer: currentQuestion.correctAnswer,
                category: currentQuestion.category
            };

            examData.questions.push(newQuestion);
            updateSummary();
            updateQuestionsDisplay();

            // Reset current question
            currentQuestion = {
                text: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                category: ''
            };

            // Reset form
            questionTextInput.value = '';
            questionCategoryInput.value = '';
            createOptionInputs();

            examApp.showToast('Question added successfully!', 'success');

        } catch (error) {
            examApp.showToast('Error adding question', 'error');
            console.error('Error adding question:', error);
        }
    }

    // Update questions display
    function updateQuestionsDisplay() {
        questionsCount.textContent = examData.questions.length;

        if (examData.questions.length === 0) {
            questionsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="empty-title">No Questions Added</div>
                    <div class="empty-description">Add at least 5 questions to create the exam</div>
                </div>
            `;
            return;
        }

        questionsContainer.innerHTML = '';

        examData.questions.forEach((question, index) => {
            const questionCard = createQuestionCard(question, index);
            questionsContainer.appendChild(questionCard);
        });
    }

    // Create question card
    function createQuestionCard(question, index) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card';

        const optionsHtml = question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.correctAnswer;
            const optionClass = isCorrect ? 'option-correct' : 'option-normal';
            return `
                <div class="option-item ${optionClass}">
                    ${optionIndex + 1}. ${option}
                </div>
            `;
        }).join('');

        questionDiv.innerHTML = `
            <div class="question-header">
                <div class="d-flex gap-2">
                    <span class="question-number">Q${index + 1}</span>
                    <span class="question-category">${question.category}</span>
                </div>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteQuestion('${question.id}')" title="Delete Question">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="question-text">${question.text}</div>
            <div class="option-grid">
                ${optionsHtml}
            </div>
        `;

        return questionDiv;
    }

    // Delete question (global function)
    window.deleteQuestion = function(questionId) {
        const questionIndex = examData.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return;

        if (confirm('Are you sure you want to delete this question?')) {
            examData.questions.splice(questionIndex, 1);
            updateSummary();
            updateQuestionsDisplay();
            examApp.showToast('Question deleted successfully', 'success');
        }
    };

    // Validate exam
    function validateExam() {
        if (!examData.title.trim()) {
            examApp.showToast('Exam title is required', 'error');
            examTitleInput.focus();
            return false;
        }

        if (!examData.description.trim()) {
            examApp.showToast('Exam description is required', 'error');
            examDescriptionInput.focus();
            return false;
        }

        if (!examData.category.trim()) {
            examApp.showToast('Exam category is required', 'error');
            examCategoryInput.focus();
            return false;
        }

        if (examData.questions.length < 5) {
            examApp.showToast('Exam must have at least 5 questions', 'error');
            return false;
        }

        return true;
    }

    // Create exam
    async function createExam() {
        if (!validateExam()) return;

        // Show loading state
        createExamText.classList.add('d-none');
        createExamSpinner.classList.remove('d-none');
        createExamBtn.disabled = true;

        try {
            // Simulate API call
            await examApp.simulateApiCall(1500);

            examApp.showToast(`Exam "${examData.title}" has been created successfully!`, 'success');

            setTimeout(() => {
                examApp.navigateToPage('dashboard');
            }, 1000);

        } catch (error) {
            examApp.showToast('Error creating exam', 'error');
            console.error('Error creating exam:', error);
        } finally {
            // Hide loading state
            createExamText.classList.remove('d-none');
            createExamSpinner.classList.add('d-none');
            createExamBtn.disabled = false;
        }
    }

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