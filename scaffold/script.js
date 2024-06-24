// script.js
let score = 0;
let timer = 60;
let interval;
let currentQuestion = {};

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startRulesDiv = document.getElementById("start-rules");
const quizScreen = document.getElementById('quizScreen');
const endScreen = document.getElementById('endScreen');
const questionElement = document.getElementById('question');
const finalScoreElement = document.getElementById('finalScore');

document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('playAgain').addEventListener('click', startQuiz);

async function startQuiz() {
    score = 0;
    timer = 60;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    startRulesDiv.classList.add('hidden');
    endScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    await getQuestion();
    startTimer();
    updateScore();
}

async function getQuestion() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&category=18&difficulty=easy&type=multiple');
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            currentQuestion = data.results[0];
            questionElement.innerHTML = decodeHTML(currentQuestion.question);
            const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
            answers.sort(() => Math.random() - 0.5);
            document.getElementById('option1').innerHTML = decodeHTML(answers[0]);
            document.getElementById('option2').innerHTML = decodeHTML(answers[1]);
            document.getElementById('option3').innerHTML = decodeHTML(answers[2]);
            document.getElementById('option4').innerHTML = decodeHTML(answers[3]);
        } else {
            throw new Error('No question found in the API response');
        }
    } catch (error) {
        console.error('Error fetching question:', error);
        questionElement.textContent = 'Failed to load question. Please try again.';
        document.querySelectorAll('.answer').forEach(button => button.textContent = '');
    }
}
document.querySelectorAll('.answer').forEach(button => {
    button.addEventListener('click', async function () {
        if (this.innerHTML === decodeHTML(currentQuestion.correct_answer)) {
            correctAnswer();
        } else {
            wrongAnswer();
        }
        await getQuestion();
    });
});

function correctAnswer() {
    score++;
    updateScore();
}

function wrongAnswer() {
    timer -= 5;
    if (timer <= 0) {
        endGame();
    } else {
        timerDisplay.textContent = timer;
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function startTimer() {
    clearInterval(interval);
    interval = setInterval(function () {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(interval);
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
