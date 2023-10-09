//Questions and Multiple Choice Answers
const questions = [
    {
        question: "How do ocean habitats such as seagrasses and mangroves help sequester carbon dioxide?",
        choices: [
            "a) By absorbing carbon dioxide from the atmosphere",
            "b) By converting carbon dioxide into oxygen",
            "c) By storing carbon dioxide in their biomass and soils",
            "d) By releasing carbon dioxide into the atmosphere"
        ],
        correctAnswer: "c) By storing carbon dioxide in their biomass and soils"
    },
    {
        question: "What is the term for the carbon-rich ecosystems that can store a significant amount of carbon per hectare?",
        choices: [
            "a) Coral reefs",
            "b) Phytoplankton",
            "c) Mangroves",
            "d) Seagrasses"
        ],
        correctAnswer: "c) Mangroves"
    },
    {
        question: "Which ocean ecosystem covers less than 0.1 percent of the world's ocean but supports over 25 percent of marine biodiversity?",
        choices: [
            "a) Deep-sea vents",
            "b) Kelp forests",
            "c) Coral reefs",
            "d) Tide pools"
        ],
        correctAnswer: "c) Coral reefs"
    },
    {
        question: "What is the primary factor that affects the growth rate of Phytoplankton?",
        choices: [
            "a) Temperature",
            "b) Light availability",
            "c) Nutrient availability",
            "d) pH levels"
        ],
        correctAnswer: "b) Light availability"
    },
    {
        question: "How does the ocean's color change with increasing phytoplankton levels?",
        choices: [
            "a) From green to blue",
            "b) From blue to red",
            "c) From red to green",
            "d) From blue to green"
        ],
        correctAnswer: "d) From blue to green"
    }
];

let currentQuestionIndex = 0; // Track the current question
let score = 0; // Track the user's score

// References to HTML elements
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");

// Display of current question and choices
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    choicesElement.innerHTML = "";

    question.choices.forEach((choice) => {
        const li = document.createElement("li");
        li.textContent = choice;
        li.addEventListener("click", checkAnswer);
        choicesElement.appendChild(li);
    });
}

// Checking the user's answer and update the score
function checkAnswer(event) {
    const selectedAnswer = event.target.textContent;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Final score after the quiz ends
function endQuiz() {
    questionElement.textContent = "Quiz Completed!";
    choicesElement.innerHTML = "";
    nextButton.style.display = "none";
    scoreElement.textContent = `Final Score: ${score}/${questions.length}`;
}

// Load the next question when the "Next" button is clicked
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
});

// Quiz Starts by displaying the first question
displayQuestion();
