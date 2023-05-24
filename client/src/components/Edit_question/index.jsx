import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./styles.css"

function EditQuest() {
    const navigate =useNavigate()
  const { id } = useParams();
  const [quest, setQuest] = useState({
    question: "",
    categorie: "",
    typeReponse: "",
    options:[],
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
     try {
     const question= await axios.get(`http://localhost:5000/quest/getById/${id}`)
     const quest=(question.data.question)
      console.log(quest)
      setQuest({
        question: quest.question,
        categorie: quest.categorie,
        typeReponse: quest.typeReponse,
        options: quest.options,
      });
      if (quest.categorie === "radio") {
        setSelectedOption(quest.options[0]);
      } else if (quest.categorie === "checkbox") {
        setSelectedOptions([]);
      }}
      catch (error) {
        console.log(error);
      }
    };
    fetchForm();
  },[]);
  const handleOptionChange = (event) => {
    const optionValue = event.target.value;
    const isSelected = event.target.checked;
    if (quest.categorie === "radio") {
      setSelectedOption(optionValue);
    } else if (quest.categorie === "checkbox") {
      if (isSelected) {
        setSelectedOptions([...selectedOptions, optionValue]);
      } else {
        setSelectedOptions(selectedOptions.filter((option) => option !== optionValue));
      }
    }
  };
    const handleOptionTextChange = (event, index) => {
    const newOptions = [...quest.options];
    newOptions[index] = event.target.value;
    setQuest({ ...quest, options: newOptions });
  };
  
  const addOption = () => {
    setQuest({ ...quest, options: [...quest.options, ""] });
  }

const updateQuestion = async () => {
    axios
    .put(`http://localhost:5000/quest/update/${id}`, quest)
    .then(() => {
      toast.success("question modifiée avec succes ! ");})
      navigate("/Form");
};



  return (
   
    <form className="form-container">
     <ToastContainer />
      <div>
        <select
          id="categorie"
          value={quest.categorie}
          onChange={(e) => setQuest({ ...quest, categorie: e.target.value })}
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

      {quest.categorie === "text" && (
        <label>
          Question:
          <input
            id="question-input"
            type="text"
            value={quest.question}
            onChange={(e) => setQuest({ ...quest, question: e.target.value })}
          />
          <select
            id="type-reponse-select"
            value={quest.typeReponse}
            onChange={(e) =>
              setQuest({ ...quest, typeReponse: e.target.value })
            }
            className="form-container select"
          ><option>Type Reponse</option>
              <option
                value="text"
                className='form-container input[type="text"]'
              >
                Text
              </option>
              <option value="email">Email</option>
              <option value="nombre">Nombre</option>
              <option value="date">Date</option>
            </select>
        </label>
      )}
      {quest.categorie === "radio" && (
  <div>
    <label>
      Question:
      <input
        id="question-input"
        type="text"
        value={quest.question}
        onChange={(e) => setQuest({ ...quest, question: e.target.value })}
      />
    </label>
    <div>
      {quest.options.map((option, index) => (
        <div key={index}>
        
          <input
            type="text"
            value={option}
            onChange={(event) => handleOptionTextChange(event, index)}
          />
        </div>
      ))}
      <button className="btnn" type="button" onClick={addOption}>
        Ajouter option
      </button>
    </div>
  </div>
)}

      
      {quest.categorie === "checkbox" && (
        <div>
          <label>
            Question:
            <input
              id="question-input"
              type="text"
              value={quest.question}
              onChange={(e) => setQuest({ ...quest, question: e.target.value })}
            />
          </label>
          <div>
            {quest.options.map((option, index) => (
              <div key={index}>
               
                <input
                  type="text"
                  value={option}
                  onChange={(event) => handleOptionTextChange(event, index)}
                />
              </div>
            ))}
            <div >
            <button className="btnn" type="buttton"  onClick={addOption}>
              Ajouter option
            </button>
            </div>
          </div>
        </div>
      )}
      <div className="Enregistrer ">
      <button className="validee" onClick={updateQuestion}>Enregistrer les modifications</button>
      </div>
    </form>
  );
}
export default EditQuest;