import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Question() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [categorie, setCategorie] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [textQuestion, setTextQuestion] = useState("");
  const [typeReponse, setTypeReponse] = useState("");

  const formLink = localStorage.getItem("formLink", "http://localhost:3000/form");

  const navigate = useNavigate();

  const handleSubmitQuest = async (event) => {
    event.preventDefault();

    // Second POST request to add question
    const question = document.querySelector("#question-input").value;
    let formId;

    try {
      const response = await axios.get("http://localhost:5000/form/latest");
      formId = response.data._id;
      console.log(`Latest form ID: ${formId}`);
    } catch (error) {
      console.error(error);
      return;
    }

    const categorie = document.querySelector("#categorie").value;
    if (categorie === "text") {
      // Ajouter ici la validation du champ texte obligatoire
      if (textQuestion.trim() === "") {
        toast.error("Veuillez entrer une question");
        return;
      }
    }
    try {
      const response = await axios.post("http://localhost:5000/quest/add", {
        question,
        formId,
        categorie,
        typeReponse,
        options,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }

    let newQuestion = {};

    if (categorie === "text") {
      newQuestion = {
        categorie,
        typeReponse,
        question: textQuestion,
      };
    } else if (categorie === "radio") {
      newQuestion = {
        categorie,
        question,
        options,
        answer: selectedOption,
      };
    } else if (categorie === "checkbox") {
      newQuestion = {
        categorie,
        question,
        options,
        answer: selectedOptions,
      };
    }

    setQuestions([...questions, newQuestion]);
    setQuestion("");
    setCategorie("");
    setOptions([]);
    setSelectedOption("");
    setSelectedOptions([]);
    setTextQuestion("");
  };

  const handleQuestionTypeChange = (event) => {
    setCategorie(event.target.value);
  };

  const handleReponseTypeChange = (event) => {
    setTypeReponse(event.target.value);
  };

  const handleOptionChange = (event) => {
    const optionValue = event.target.value;

    if (categorie === "radio") {
      setSelectedOption(optionValue);
    } else if (categorie === "checkbox") {
      const isSelected = event.target.checked;

      if (isSelected) {
        setSelectedOptions([...selectedOptions, optionValue]);
      } else {
        setSelectedOptions(selectedOptions.filter((option) => option !== optionValue));
      }
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionTextChange = (event, index) => {
    console.log(event.target.value);
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    console.log(newOptions);
    setOptions(newOptions);
  };

  const fetchForm = async () => {
    try {
      const form = await axios.get("http://localhost:5000/form/latest");
      console.log(form);
      const id = form.data._id;
      console.log(id);
      const result = await axios.get(`http://localhost:5000/quest/get/${id}`);
      setQuestions(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [question]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionBlur = (event) => {
    setQuestion(event.target.value + " ?");
    setTextQuestion(event.target.value + " ?");
  };

  const deleteQuestion = async (id) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:5000/quest/${id}`).then(() => {
        fetchForm();
      }).then(() => {
        toast.success('Question supprimée');
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmitQuest} className="form-container">
        <div>
          <select
            id="categorie"
            value={categorie}
            onChange={handleQuestionTypeChange}
            className="form-container select"
          >
            <option>Type Question</option>
            <option value="text" className='form-container input[type="text"]'>
              Text
            </option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>

        {categorie === "text" && (
          <label>
            Question:
            <input
              id="question-input"
              type="text"
              value={textQuestion}
              onChange={(e) => setTextQuestion(e.target.value)}
              onBlur={handleQuestionBlur}
            />
            <select
              id="type-reponse-select"
              value={typeReponse}
              onChange={handleReponseTypeChange}
              className="form-container select"
            >
              <option>Type Reponse</option>
              <option value="text" className='form-container input[type="text"]'>
                Text
              </option>
              <option value="email">Email</option>
              <option value="nombre">Nombre</option>
              <option value="date">Date</option>
            </select>
          </label>
        )}

        {categorie === "radio" && (
          <div>
            <br />
            Question:
            <input
              id="question-input"
              type="text"
              value={question}
              onChange={handleQuestionChange}
              onBlur={handleQuestionBlur}
            />

            <label htmlFor="options" className="option-label">
              <br />
              Options:
            </label>

            {options.map((option, index) => (
              <div key={index} className="option-item">
                {/* <input type="radio" id={`option${index}`} name="options" value={option} onChange={handleOptionChange} checked={selectedOption === option}  /> */}
                <input
                  type="text"
                  value={option}
                  onChange={(event) => handleOptionTextChange(event, index)}
                  className="option-inputtext"
                />
              </div>
            ))}

            <button type="button" onClick={addOption} className="addoptionbutton">
              Add Option
            </button>
          </div>
        )}

        {categorie === "checkbox" && (
          <div>
            Question:
            <input
              id="question-input"
              type="text"
              value={question}
              onChange={handleQuestionChange}
              onBlur={handleQuestionBlur}
            />

            <label htmlFor="options" className="option-label">
              Options:
            </label>

            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(event) => handleOptionTextChange(event, index)}
                  className="option-inputtext"
                />
              </div>
            ))}

            <button type="button" onClick={addOption} className="addoptionbutton">
              Add Option
            </button>
          </div>
        )}

        <label>
          <button type="submit" id="submit-button" className="submitlabel">
            Submit
          </button>
        </label>
      </form>

      <div className="form-container">
        <div>
          <h2 className="questions-container pb-4"> Questions</h2>
        </div>
        <div>
          <ul>
            {questions.map((question, index) => (
              <div key={index} className="question-predefined">
                {question.questionType !== "text" ? (
                  <>
                    <h2>{question.question}</h2>
                    {question.options &&
                      question.options.map((option, index) => (
                        <div className="option" key={index}>
                          {question.questionType === "radio" && (
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                            />
                          )}
                          {question.questionType === "checkbox" && (
                            <input
                              type="checkbox"
                              name={`question-${index}`}
                              value={option}
                            />
                          )}
                          {option}
                        </div>
                      ))}
                  </>
                ) : (
                  <>
                    <h4>{question.question}</h4>
                    <div>{/* Afficher la réponse à la question de type texte ici */}</div>
                  </>
                )}

                <div className="action_btn">
                  <button type="button" onClick={() => deleteQuestion(question._id)}>
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/edit/${question._id}`);
                    }}
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>

        <div>
          <p className="pt-4">
            Copiez le lien suivant pour partager ce formulaire :<a href={formLink}>{formLink}</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Question;
