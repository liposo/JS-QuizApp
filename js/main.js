window.onload = function (event) {
  const root = document.getElementById("root");
  buildQuiz(root);
};

const buildQuiz = async (rootElement) => {
  const quiz = await getQuestions();
  if (quiz) {
    const loader = document.getElementById("loader");
    loader.style.display = "none";

    rootElement.appendChild(buildHeader(quiz.title, quiz.description));

    const questions = [];
    quiz.questions.forEach((element) => {
      questions.push(buildQuizQuestion(element));
    });

    console.log(questions);
  }
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
  answerContainer.id = element.a_id;

  const label = document.createElement("label");
  label.htmlFor = element.a_id;
  label.innerText = element.caption;

  const radio = document.createElement("input");
  radio.type = type;
  radio.value = element.id;
  radio.name = element.id;

  answerContainer.appendChild(label);
  answerContainer.appendChild(radio);

  parent.appendChild(answerContainer);
};

const buildQuizQuestion = (question) => {
  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";

  const questionTitle = document.createElement("h2");
  questionTitle.innerText = question.title;

  const questionImage = document.createElement("img");
  questionImage.src = question.img;
  questionImage.alt = "";

  const possibleAnswersContainer = document.createElement("div");
  possibleAnswersContainer.className = "question-answers";

  switch (question.question_type) {
    case "multiplechoice-single":
      question.possible_answers.forEach((element) => {
        buildPossibleAnswer("radio", element, possibleAnswersContainer);
      });
      break;
    case "truefalse":
      const answerTrueContainer = document.createElement("div");

      const labelTrue = document.createElement("label");
      labelTrue.htmlFor = "radioTrue";
      labelTrue.innerText = "True";

      const radioTrue = document.createElement("input");
      radioTrue.name = "trueOrFalse";
      radioTrue.id = "radioTrue";
      radioTrue.type = "radio";
      radioTrue.value = true;

      const answerFalseContainer = document.createElement("div");

      const labelFalse = document.createElement("label");
      labelFalse.htmlFor = "radioFalse";
      labelFalse.innerText = "False";

      const radioFalse = document.createElement("input");
      radioFalse.name = "trueOrFalse";
      radioFalse.id = "radioFalse";
      radioFalse.type = "radio";
      radioFalse.value = false;

      answerTrueContainer.appendChild(labelTrue);
      answerTrueContainer.appendChild(radioTrue);
      answerFalseContainer.appendChild(labelFalse);
      answerFalseContainer.appendChild(radioFalse);

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

  const button = document.createElement("div");
  button.className = "button";

  button.addEventListener("click", function () {
    //Validate question before moving to next question
  });

  questionContainer.appendChild(questionTitle);
  questionContainer.appendChild(questionImage);
  questionContainer.appendChild(possibleAnswersContainer);
  questionContainer.appendChild(button);

  return questionContainer;
};
