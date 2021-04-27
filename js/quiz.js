const quiz = {
  quizObject: null,

  quizContainer: null,
  questionContainer: null,
  questionsHTML: null,
  loader: null,

  current: 0,
  score: 0,

  init: async function () {
    quiz.quizObject = await getQuestions;

    quiz.loader = document.getElementById("loader");
    loader.style.display = "none";

    quiz.quizContainer = document.getElementById("quiz");
    quiz.quizContainer.appendChild(
      quiz.buildHeader(quiz.quizObject.title, quiz.quizObject.description)
    );

    quiz.questionContainer = document.createElement("div");
    quiz.questionContainer.className = "question-container";
    quiz.questionContainer.id = "question";
    quiz.quizContainer.appendChild(quiz.questionContainer);

    quiz.draw();
  },

  buildHeader: (title, description) => {
    const header = document.createElement("header");
    const headerTitle = document.createElement("h1");
    const headerDescription = document.createElement("h3");
    headerTitle.innerText = title;
    headerDescription.innerText = description;

    header.appendChild(headerTitle);
    header.appendChild(headerDescription);

    return header;
  },

  // (C) DRAW QUESTION
  draw: function () {
    // (C1) QUESTION
    //    quiz.hqn.innerHTML = quiz.data[quiz.now].q;
    //    // (C2) OPTIONS
    //    quiz.hans.innerHTML = "";
    //    for (let i in quiz.data[quiz.now].o) {
    //      let radio = document.createElement("input");
    //      radio.type = "radio";
    //      radio.name = "quiz";
    //      radio.id = "quizo" + i;
    //      quiz.hans.appendChild(radio);
    //      let label = document.createElement("label");
    //      label.innerHTML = quiz.data[quiz.now].o[i];
    //      label.setAttribute("for", "quizo" + i);
    //      label.dataset.idx = i;
    //      label.addEventListener("click", quiz.select);
    //      quiz.hans.appendChild(label);
    //    }
  },

  // (D) OPTION SELECTED
  select: function () {
    // (D1) DETACH ALL ONCLICK
    //    let all = quiz.hAns.getElementsByTagName("label");
    //    for (let label of all) {
    //      label.removeEventListener("click", quiz.select);
    //    }
    //    // (D2) CHECK IF CORRECT
    //    let correct = this.dataset.idx == quiz.data[quiz.now].a;
    //    if (correct) {
    //      quiz.score++;
    //      this.classList.add("correct");
    //    } else {
    //      this.classList.add("wrong");
    //    }
    //    // (D3) NEXT QUESTION OR END GAME
    //    quiz.now++;
    //    setTimeout(function(){
    //      if (quiz.now < quiz.data.length) { quiz.draw(); }
    //      else {
    //        quiz.hQn.innerHTML = `You have answered ${quiz.score} of ${quiz.data.length} correctly.`;
    //        quiz.hAns.innerHTML = "";
    //      }
    //    }, 1000);
  },
};

window.addEventListener("load", quiz.init);
