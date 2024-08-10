const validUsers = {
    '1': '1',
    'user2': 'password2',
    'user3': 'password3'
};

const questions = [
    {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Rome', 'Berlin'],
        answer: 'Paris'
    },
    {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        answer: '4'
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        answer: 'Mars'
    },
    {
        question: 'Who wrote "To Kill a Mockingbird"?',
        options: ['Harper Lee', 'Mark Twain', 'Ernest Hemingway', 'F. Scott Fitzgerald'],
        answer: 'Harper Lee'
    },
    {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        answer: 'Pacific Ocean'
    },
    {
        question: 'Which element has the chemical symbol O?',
        options: ['Oxygen', 'Gold', 'Silver', 'Iron'],
        answer: 'Oxygen'
    }
];

let countdownInterval;
let selectedQuestions = [];
let isLoggedIn = false; // Track whether the user has logged in

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    if (validUsers[userId] === password) {
        isLoggedIn = true; // Mark the user as logged in
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('message-container').style.display = 'block';
    } else {
        document.getElementById('error-message').textContent = 'Invalid User ID or Password';
    }
});

// Handle start exam button click
document.getElementById('start-exam').addEventListener('click', function() {
    if (isLoggedIn) { // Only allow exam to start if the user is logged in
        document.getElementById('message-container').style.display = 'none';
        document.getElementById('exam-container').style.display = 'block';
        selectRandomQuestions();
        displayQuestions();
        startTimer();
        monitorTabChange();
    } else {
        alert('You must log in to start the exam.');
    }
});

function selectRandomQuestions() {
    selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
}

function displayQuestions() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    selectedQuestions.forEach((q, index) => {
        let optionsHTML = q.options.map((option, i) => 
            `<div><input type="radio" id="q${index}_opt${i}" name="q${index}" value="${option}"><label for="q${index}_opt${i}">${option}</label></div>`
        ).join('');
        
        questionContainer.innerHTML += `
            <div class="question">
                <p>${index + 1}. ${q.question}</p>
                ${optionsHTML}
            </div>
        `;
    });
}

function startTimer() {
    let timeRemaining = 120; // 2 minutes in seconds
    const timerDisplay = document.getElementById('timer');

    countdownInterval = setInterval(function() {
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            submitExam();
        } else {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeRemaining--;
        }
    }, 1000);
}

function monitorTabChange() {
    let isTabActive = true;

    function handleVisibilityChange() {
        if (document.hidden) {
            isTabActive = false;
            submitExam();
        } else {
            isTabActive = true;
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
}

document.getElementById('submit-exam').addEventListener('click', submitExam);

function submitExam() {
    clearInterval(countdownInterval);
    const score = calculateScore();
    document.getElementById('exam-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('score').textContent = `${score} / 5`;

    displayAnswerKey();
}

function calculateScore() {
    let score = 0;
    selectedQuestions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedOption && selectedOption.value === q.answer) {
            score++;
        }
    });
    return score;
}

function displayAnswerKey() {
    const answerKeyContainer = document.getElementById('answer-key');
    answerKeyContainer.innerHTML = '';

    selectedQuestions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        const isCorrect = selectedOption && selectedOption.value === q.answer;
        const studentAnswer = selectedOption ? selectedOption.value : 'No answer selected';
        
        const questionHTML = `
            <div class="question">
                <p>${index + 1}. ${q.question}</p>
                <p>Correct Answer: <span class="correct-answer">${q.answer}</span></p>
                <p>Your Answer: <span class="${isCorrect ? 'correct-answer' : 'incorrect-answer'}">${studentAnswer}</span></p>
            </div>
        `;
        answerKeyContainer.innerHTML += questionHTML;
    });
}