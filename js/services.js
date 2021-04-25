const url = "https://proto.io/en/jobs/candidate-exercise";

const getQuestions = async () => {
  return fetch(url + "/quiz.json")
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return null;
    });
};

const getResult = async () => {
  return fetch(url + "/result.json")
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return null;
    });
};
