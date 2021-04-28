const quizRoot = document.getElementById("quiz");
const loader = document.getElementById("loader");
const quiz = {
  title: null,
  description: null,
  questions: null,
  questionsHTMLElement: [],
  answeredQuestions: [],
  current: 0,
  score: 0,
};

const buildQuiz = async () => {
  const response = await getQuestions();
  quiz.questions = response.questions;
  quiz.title = response.title;
  quiz.description = response.description;

  loader.style.display = "none";

  quizRoot.appendChild(buildHeader(quiz.title, quiz.description));
  quiz.questions.forEach((element) => {
    quiz.questionsHTMLElement.push(buildQuizQuestion(element, quiz.questions));
  });

  displayQuestion(quiz.current);
};

const displayQuestion = (index) => {
  const previousQuestion = document.getElementById("question");
  if (previousQuestion) {
    quizRoot.removeChild(previousQuestion);
  }
  quizRoot.appendChild(quiz.questionsHTMLElement[index]);
};

const buildHeader = (title, description) => {
  const header = document.createElement("header");
  const headerTitle = document.createElement("h1");
  const headerDescription = document.createElement("h3");
  headerTitle.innerText = title;
  headerDescription.innerText = description;

  header.appendChild(headerTitle);
  header.appendChild(headerDescription);

  return header;
};

const buildPossibleAnswer = (type, element, parent) => {
  const answerContainer = document.createElement("div");
  answerContainer.id = `ans-${element.a_id}`;

  const label = document.createElement("label");
  label.htmlFor = element.a_id;
  label.innerText = element.caption;

  const input = document.createElement("input");
  input.name = "answer";
  input.type = type;
  input.value = element.a_id;
  input.id = element.a_id;

  answerContainer.appendChild(input);
  answerContainer.appendChild(label);

  parent.appendChild(answerContainer);
};

const buildQuizQuestion = (question) => {
  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";
  questionContainer.id = "question";

  const questionImage = document.createElement("img");
  questionImage.src = question.img;
  questionImage.alt = "";

  const questionTitle = document.createElement("h3");
  questionTitle.innerText = question.title;

  const possibleAnswersContainer = document.createElement("form");
  possibleAnswersContainer.id = "answersForm";
  possibleAnswersContainer.className = "question-answer";
  possibleAnswersContainer.onsubmit = onFormSubmit;

  const questionBody = document.createElement("div");
  questionBody.className = "question-body";

  switch (question.question_type) {
    case "multiplechoice-single":
      question.possible_answers.forEach((element) => {
        buildPossibleAnswer("radio", element, possibleAnswersContainer);
      });
      break;
    case "truefalse":
      const answerTrueContainer = document.createElement("div");
      answerTrueContainer.id = `ans-true`;

      const labelTrue = document.createElement("label");
      labelTrue.htmlFor = "true";
      labelTrue.innerText = "True";

      const radioTrue = document.createElement("input");
      radioTrue.name = "answer";
      radioTrue.id = "true";
      radioTrue.type = "radio";
      radioTrue.value = true;

      answerTrueContainer.appendChild(radioTrue);
      answerTrueContainer.appendChild(labelTrue);

      const answerFalseContainer = document.createElement("div");
      answerFalseContainer.id = `ans-false`;

      const labelFalse = document.createElement("label");
      labelFalse.htmlFor = "false";
      labelFalse.innerText = "False";

      const radioFalse = document.createElement("input");
      radioFalse.name = "answer";
      radioFalse.id = "false";
      radioFalse.type = "radio";
      radioFalse.value = false;

      answerFalseContainer.appendChild(radioFalse);
      answerFalseContainer.appendChild(labelFalse);

      possibleAnswersContainer.appendChild(answerTrueContainer);
      possibleAnswersContainer.appendChild(answerFalseContainer);
      break;
    case "multiplechoice-multiple":
      question.possible_answers.forEach((element) => {
        buildPossibleAnswer("checkbox", element, possibleAnswersContainer);
      });
      break;
    default:
      console.error("Unexpected question type");
  }

  const button = document.createElement("button");
  button.id = "next";
  button.className = "button";
  button.disabled = false;
  button.innerText =
    quiz.current < quiz.questions.length - 1 ? "Next question" : "Finish";

  possibleAnswersContainer.appendChild(button);

  questionBody.appendChild(questionTitle);
  questionBody.appendChild(possibleAnswersContainer);

  questionContainer.appendChild(questionImage);
  questionContainer.appendChild(questionBody);

  return questionContainer;
};

const onFormSubmit = (event) => {
  event.preventDefault();

  document.getElementById("next").disabled = true;

  let answer = [];
  const checkBoxes = document.querySelectorAll("input[type=checkbox]:checked");
  if (checkBoxes.length > 0) {
    answer = [];
    Array.from(checkBoxes).forEach((item) => {
      answer.push(item.value);
    });
  } else {
    answer.push(event.target.elements.answer.value);
  }

  hightlightCorrectAnswer();

  if (
    quiz.questions[quiz.current].correct_answer.toString() === answer.toString()
  ) {
    quiz.answeredQuestions.push(answer);
    quiz.score += quiz.questions[quiz.current].points;
  }

  setTimeout(function () {
    if (quiz.current < quiz.questions.length - 1) {
      quiz.current += 1;
      displayQuestion(quiz.current);
    } else {
      showResult();
    }
  }, 3000);

  return false;
};

const hightlightCorrectAnswer = () => {
  if (Array.isArray(quiz.questions[quiz.current].correct_answer)) {
    correctAnswerElement = [];
    quiz.questions[quiz.current].correct_answer.forEach((item) => {
      correctAnswerElement.push(document.getElementById(`ans-${item}`));
    });

    correctAnswerElement.forEach((item) => {
      item.classList.add("highlight");
    });

    return correctAnswerElement;
  } else {
    correctAnswerElement = document.getElementById(
      `ans-${quiz.questions[quiz.current].correct_answer}`
    );
    correctAnswerElement.classList.add("highlight");

    return correctAnswerElement;
  }
};

const showResult = async () => {
  const previousQuestion = document.getElementById("question");
  if (previousQuestion) {
    quizRoot.removeChild(previousQuestion);
  }
  loader.style.display = "flex";

  const response = await getResult();
  loader.style.display = "none";

  const scoreElement = document.createElement("h1");
  scoreElement.style.padding = "22px";

  const totalScore = quiz.questions
    .map((item) => item.points)
    .reduce((prev, next) => prev + next);
  const scoreInPercent = (quiz.score * 100) / totalScore;
  scoreElement.innerText = `You scored ${scoreInPercent}%`;

  let result;
  for (let i = 0, length = response.results.length; i < length; i++) {
    if (scoreInPercent <= response.results[i].maxpoints) {
      result = response.results[i];
      break;
    }
  }

  let title = result.title;
  let message = result.message;
  let imgSrc = result.img;

  const scoreDetails = document.createElement("div");
  scoreDetails.className = "question-container";

  const scoreImage = document.createElement("img");
  scoreImage.src = imgSrc;
  scoreImage.alt = "";

  const scoreTitle = document.createElement("h2");
  scoreTitle.innerText = title;
  scoreTitle.style.padding = "22px";

  const scoreMessage = document.createElement("h3");
  scoreMessage.innerText = message;
  scoreMessage.style.padding = "22px";

  scoreDetails.appendChild(scoreElement);
  scoreDetails.appendChild(scoreImage);
  scoreDetails.appendChild(scoreTitle);
  scoreDetails.appendChild(scoreMessage);

  quizRoot.appendChild(scoreDetails);
};

window.onload = function (event) {
  buildQuiz();
};
