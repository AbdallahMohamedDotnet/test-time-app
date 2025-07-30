// Exam Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const examTitle = document.getElementById('examTitle');
    const questionProgress = document.getElementById('questionProgress');
    const timer = document.getElementById('timer');
    const timeIcon = document.getElementById('timeIcon');
    const answeredCount = document.getElementById('answeredCount');
    const progressBar = document.getElementById('progressBar');
    const questionNumber = document.getElementById('questionNumber');
    const questionCategory = document.getElementById('questionCategory');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const questionNav = document.getElementById('questionNav');

    let currentUser = null;
    let examData = null;
    let questions = [];
    let currentQuestionIndex = 0;
    let answers = {};
    let timeLeft = 0;
    let timerInterval = null;

    // Initialize exam
    function initializeExam() {
        currentUser = examApp.getCurrentUser();
        
        if (!currentUser) {
            examApp.navigateToPage('login');
            return;
        }

        examData = examApp.getFromStorage('currentExam');
        if (!examData) {
            examApp.showToast('No exam data found', 'error');
            examApp.navigateToPage('dashboard');
            return;
        }

        loadExam();
        setupEventListeners();
    }

    // Load exam
    async function loadExam() {
        try {
            // Simulate API call
            await examApp.simulateApiCall(500);
            
            questions = examApp.getMockQuestions();
            timeLeft = examData.duration || 1800; // 30 minutes default
            
            setupExamInterface();
            startTimer();
            loadQuestion();
            
        } catch (error) {
            examApp.showToast('Error loading exam', 'error');
            console.error('Error loading exam:', error);
        }
    }

    // Setup exam interface
    function setupExamInterface() {
        examTitle.textContent = examData.examTitle || 'Exam';
        updateProgress();
        createQuestionNavigation();
    }

    // Start timer
    function startTimer() {
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 300) { // 5 minutes warning
                timer.classList.add('timer-warning');
                timeIcon.classList.add('timer-warning');
            }
            
            if (timeLeft <= 0) {
                submitExam(true); // Auto submit
            }
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay() {
        timer.textContent = examApp.formatTime(timeLeft);
    }

    // Load current question
    function loadQuestion() {
        if (!questions[currentQuestionIndex]) return;

        const question = questions[currentQuestionIndex];
        
        questionNumber.textContent = `Question ${currentQuestionIndex + 1}`;
        questionCategory.textContent = question.category;
        questionText.textContent = question.text;
        
        updateProgress();
        renderOptions(question);
        updateNavigationButtons();
        updateQuestionNavigation();
    }

    // Render question options
    function renderOptions(question) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'question-option';
            optionDiv.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="answer" value="${index}" id="option${index}"
                           ${answers[question.id] === index ? 'checked' : ''}>
                    <label class="form-check-label w-100" for="option${index}">
                        ${option}
                    </label>
                </div>
            `;

            optionDiv.addEventListener('click', () => {
                const radio = optionDiv.querySelector('input[type="radio"]');
                radio.checked = true;
                selectAnswer(index);
            });

            optionsContainer.appendChild(optionDiv);
        });
    }

    // Select answer
    function selectAnswer(optionIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        answers[currentQuestion.id] = optionIndex;
        
        // Update visual feedback
        document.querySelectorAll('.question-option').forEach((option, index) => {
            if (index === optionIndex) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        updateProgress();
        updateQuestionNavigation();
    }

    // Update progress
    function updateProgress() {
        const totalQuestions = questions.length;
        const currentProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        const answeredQuestions = Object.keys(answers).length;
        
        questionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        answeredCount.textContent = `${answeredQuestions}/${totalQuestions} answered`;
        progressBar.style.width = `${currentProgress}%`;
    }

    // Create question navigation
    function createQuestionNavigation() {
        questionNav.innerHTML = '';
        
        questions.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn question-nav-btn';
            btn.textContent = index + 1;
            btn.onclick = () => goToQuestion(index);
            questionNav.appendChild(btn);
        });
    }

    // Update question navigation
    function updateQuestionNavigation() {
        const navButtons = questionNav.querySelectorAll('.question-nav-btn');
        
        navButtons.forEach((btn, index) => {
            btn.classList.remove('current', 'answered');
            
            if (index === currentQuestionIndex) {
                btn.classList.add('current');
            } else if (answers[questions[index].id] !== undefined) {
                btn.classList.add('answered');
            }
        });
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');
        } else {
            nextBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none');
        }
    }

    // Go to specific question
    function goToQuestion(index) {
        if (index >= 0 && index < questions.length) {
            currentQuestionIndex = index;
            loadQuestion();
        }
    }

    // Go to next question
    function goToNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        }
    }

    // Go to previous question
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    }

    // Submit exam
    async function submitExam(autoSubmit = false) {
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        if (!autoSubmit) {
            const unansweredCount = questions.length - Object.keys(answers).length;
            if (unansweredCount > 0) {
                const confirmed = confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`);
                if (!confirmed) return;
            }
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';

        try {
            // Simulate API call
            await examApp.simulateApiCall(1500);

            // Calculate results
            const results = calculateResults();
            
            examApp.showToast(`Exam submitted successfully! Score: ${results.score}%`, 'success');
            
            setTimeout(() => {
                examApp.navigateToPage('result', results);
            }, 1000);
            
        } catch (error) {
            examApp.showToast('Error submitting exam', 'error');
            console.error('Error submitting exam:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Exam';
        }
    }

    // Calculate results
    function calculateResults() {
        let correctAnswers = 0;
        
        questions.forEach(question => {
            if (answers[question.id] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / questions.length) * 100);
        const timeSpent = (examData.duration || 1800) - timeLeft;

        return {
            examId: examData.examId,
            examTitle: examData.examTitle,
            answers: answers,
            score: score,
            totalQuestions: questions.length,
            correctAnswers: correctAnswers,
            timeSpent: timeSpent
        };
    }

    // Setup event listeners
    function setupEventListeners() {
        backBtn.addEventListener('click', () => {
            const confirmed = confirm('Are you sure you want to leave? Your progress will be lost.');
            if (confirmed) {
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
                examApp.navigateToPage('dashboard');
            }
        });

        prevBtn.addEventListener('click', goToPreviousQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);
        submitBtn.addEventListener('click', () => submitExam(false));

        // Handle answer selection
        document.addEventListener('change', function(e) {
            if (e.target.name === 'answer') {
                selectAnswer(parseInt(e.target.value));
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
                goToPreviousQuestion();
            } else if (e.key === 'ArrowRight' && !nextBtn.classList.contains('d-none')) {
                goToNextQuestion();
            } else if (e.key === 'Enter' && !submitBtn.classList.contains('d-none')) {
                submitExam(false);
            }
        });

        // Prevent page refresh
        window.addEventListener('beforeunload', function(e) {
            if (timerInterval) {
                e.preventDefault();
                e.returnValue = 'Your exam progress will be lost. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }

    // Initialize exam
    initializeExam();

    // Add animation
    document.querySelector('.container').classList.add('fade-in');
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