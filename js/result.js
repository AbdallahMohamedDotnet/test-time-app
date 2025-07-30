// Result Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    const animatedScore = document.getElementById('animatedScore');
    const performanceBadge = document.getElementById('performanceBadge');
    const passStatus = document.getElementById('passStatus');
    const scoreProgressBar = document.getElementById('scoreProgressBar');
    const detailsContainer = document.getElementById('detailsContainer');
    const correctAnswers = document.getElementById('correctAnswers');
    const incorrectAnswers = document.getElementById('incorrectAnswers');
    const timeSpent = document.getElementById('timeSpent');
    const summaryContainer = document.getElementById('summaryContainer');
    const totalQuestions = document.getElementById('totalQuestions');
    const correctSummary = document.getElementById('correctSummary');
    const accuracyRate = document.getElementById('accuracyRate');
    const statusBadge = document.getElementById('statusBadge');
    const recommendationsText = document.getElementById('recommendationsText');
    const actionButtons = document.getElementById('actionButtons');
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const retakeExamBtn = document.getElementById('retakeExamBtn');

    let examResult = null;

    // Initialize result page
    function initializeResults() {
        const currentUser = examApp.getCurrentUser();
        
        if (!currentUser) {
            examApp.navigateToPage('login');
            return;
        }

        examResult = examApp.getFromStorage('examResult');
        if (!examResult) {
            examApp.showToast('No exam results found', 'error');
            examApp.navigateToPage('dashboard');
            return;
        }

        setupResultInterface();
        animateResults();
        setupEventListeners();
    }

    // Setup result interface
    function setupResultInterface() {
        const isPassed = examResult.score >= 60;
        const performance = getPerformanceLevel(examResult.score);
        
        // Set title and subtitle
        resultTitle.textContent = isPassed ? 'Congratulations!' : 'Keep Learning!';
        resultSubtitle.textContent = `${examResult.examTitle || 'Exam'} Results`;
        
        // Set icon and color
        const iconClass = isPassed ? 'text-success' : 'text-danger';
        const bgClass = isPassed ? 'bg-success bg-opacity-20' : 'bg-danger bg-opacity-20';
        
        resultIcon.className = `icon-wrapper rounded-circle p-4 ${bgClass}`;
        resultIcon.querySelector('i').className = `fas fa-trophy fa-3x ${iconClass}`;
        
        // Set performance badge
        performanceBadge.textContent = performance.level;
        performanceBadge.className = `badge fs-6 px-4 py-2 bg-${performance.color}`;
        
        // Set pass status
        passStatus.textContent = `${isPassed ? 'Passed' : 'Failed'} • Passing score: 60%`;
        
        // Set summary data
        totalQuestions.textContent = examResult.totalQuestions;
        correctSummary.textContent = examResult.correctAnswers;
        accuracyRate.textContent = `${Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100)}%`;
        
        // Set status badge
        statusBadge.textContent = isPassed ? 'PASSED' : 'FAILED';
        statusBadge.className = `badge bg-${isPassed ? 'success' : 'danger'}`;
        
        // Set recommendations
        setRecommendations(isPassed, examResult.score);
    }

    // Get performance level
    function getPerformanceLevel(score) {
        if (score >= 90) return { level: 'Excellent', color: 'success' };
        if (score >= 80) return { level: 'Good', color: 'success' };
        if (score >= 70) return { level: 'Average', color: 'warning' };
        if (score >= 60) return { level: 'Pass', color: 'warning' };
        return { level: 'Needs Improvement', color: 'danger' };
    }

    // Set recommendations
    function setRecommendations(isPassed, score) {
        let recommendations = '';
        
        if (isPassed) {
            recommendations = `
                <p class="text-success small mb-2">
                    Great job! You've demonstrated a solid understanding of the subject matter.
                </p>
                <p class="text-muted small mb-2">
                    Consider taking more advanced exams to further improve your skills.
                </p>
            `;
        } else {
            recommendations = `
                <p class="text-danger small mb-2">
                    You need to improve your understanding of the concepts covered in this exam.
                </p>
                <p class="text-muted small mb-2">
                    We recommend reviewing the study materials and retaking the exam.
                </p>
            `;
        }
        
        recommendations += `
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">
                Focus on areas where you struggled and practice more examples.
            </p>
        `;
        
        recommendationsText.innerHTML = recommendations;
    }

    // Animate results
    function animateResults() {
        // Animate score
        setTimeout(() => {
            examApp.animateValue(animatedScore, 0, examResult.score, 2000);
            animatedScore.dataset.suffix = '%';
            
            // Animate progress bar
            setTimeout(() => {
                scoreProgressBar.style.width = `${examResult.score}%`;
                
                // Show details
                setTimeout(() => {
                    showDetails();
                }, 500);
            }, 1000);
        }, 500);
    }

    // Show details
    function showDetails() {
        // Set detail values
        correctAnswers.textContent = examResult.correctAnswers;
        incorrectAnswers.textContent = examResult.totalQuestions - examResult.correctAnswers;
        timeSpent.textContent = examApp.formatDuration(examResult.timeSpent);
        
        // Show containers with animation
        detailsContainer.style.display = 'flex';
        detailsContainer.classList.add('fade-in');
        
        setTimeout(() => {
            summaryContainer.style.display = 'block';
            summaryContainer.classList.add('slide-up');
            
            setTimeout(() => {
                actionButtons.style.display = 'block';
                actionButtons.classList.add('fade-in');
            }, 300);
        }, 500);
    }

    // Setup event listeners
    function setupEventListeners() {
        backToDashboardBtn.addEventListener('click', () => {
            examApp.navigateToPage('dashboard');
        });

        retakeExamBtn.addEventListener('click', () => {
            // Get current exam data and restart
            const examData = {
                examId: examResult.examId,
                examTitle: examResult.examTitle,
                duration: 1800, // Default 30 minutes
                totalQuestions: examResult.totalQuestions
            };
            
            examApp.navigateToPage('exam', examData);
        });
    }

    // Save result to history (if needed)
    function saveResultToHistory() {
        const history = examApp.getFromStorage('examHistory') || [];
        history.unshift({
            ...examResult,
            completedAt: new Date().toISOString()
        });
        
        // Keep only last 10 results
        const limitedHistory = history.slice(0, 10);
        examApp.saveToStorage('examHistory', limitedHistory);
    }

    // Initialize results
    initializeResults();
    saveResultToHistory();

    // Add initial animation
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
