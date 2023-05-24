import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa";
import ReactModal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';


function Visiteur() {
  const [quest, setQuest] = useState(null);
  const [reponse, setReponse] = useState({});
  const [form, setForm] = useState({});
  const [visiteur, setVisiteur] = useState([]);
  const [newVisiteur, setNewVisiteur] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState("")
  const[errorTel,setErrorTel]=useState("")


  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await axios.get("http://localhost:5000/form/latest");
        const id = form.data._id;
        console.log(id);
        const quest = await axios.get(`http://localhost:5000/quest/get/${id}`);
        console.log(quest.data);
        setQuest(quest.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchForm();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue;
    if (type === "checkbox") {
      const prevValue = reponse[name] || [];
      newValue = checked ? [...prevValue, value] : prevValue.filter((val) => val !== value);
    } else {
      newValue = value;
    }
    setReponse((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };
  
  const finalReponse = Object.keys(reponse).reduce((acc, questionId) => {
    acc[questionId] = Array.isArray(reponse[questionId])
      ? reponse[questionId]
      : [reponse[questionId]];
    return acc;
  }, {});
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visiteur = await axios.get("http://localhost:5000/visiteur/get/latest");
      const form = await axios.get("http://localhost:5000/form/latest");
      const visiteurId = visiteur.data._id;
      const formId = form.data._id;
  
      const reponseData = {
        formId,
        reponse: Object.keys(finalReponse).map((questionId) => ({
          questionId,
          value: finalReponse[questionId],
        })),
        visiteurId,
      };
  
      const response = await axios.post("http://localhost:5000/reponse/add", reponseData);
      console.log(response.data);
      window.location.href = "/confirmation";
    } catch (error) {
      toast.error( error.response ? error.response.data.message : error.message);
    }
  
  };
  const hanlePosterChanger = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setReponse({ reponse: event.target.value });
    }
  }
  /***popup code  */

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formId = await axios.get("http://localhost:5000/form/latest");
        setForm(formId.data);
      } catch (error) {
        console.log(error);
      }
    };
    setModalIsOpen(true);
    fetchForm();
  }, []);

  const handleTelephoneSubmit = (e) => {
    e.preventDefault();
  
    if (!validatePhoneNumber(newVisiteur)) {
      setErrorTel("Le numéro de téléphone doit contenir exactement 8 chiffres.");
      return;
    }
  
    axios
      .post("http://localhost:5000/visiteur/add", {
        formId: form._id,
        numeroTelephone: newVisiteur,
      })
      .then((response) => {
        if (response.status === 202) {
          setModalIsOpen(true);
          setErrorTel(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setModalIsOpen(true);
          handleClick();
        } else if (error.response && error.response.status === 201) {
          setError(error.response.data.message);
        }
      });
  };
  
  
  const handleClick = () => {
    setErrorMessage("Vous avez rempli ce formulaire");
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
  
    if (!validatePhoneNumber(newVisiteur)) {
      setErrorTel("Le numéro de téléphone doit contenir exactement 8 chiffres.");
      return;
    }
  
    setVisiteur([...visiteur, newVisiteur]);
    setNewVisiteur("");
    handleTelephoneSubmit(e);
    setModalIsOpen(false);
  };
  
  const validatePhoneNumber = (number) => {
    const numberRegex = /^[0-9]{8}$/;
    return numberRegex.test(number);
  };
  
  return (
    <div className="containeer">
      <h1 className="titre">Remplir Le Formulaire</h1>
      <ToastContainer/>
      <form className="Formulaire">
        <div>
          {quest &&
            quest.map(({ _id, question, categorie, options, typeReponse }) => {
              if (categorie === "text") {
                if (typeReponse === "image") {
                  return (
                    <div key={_id}>
                      <label htmlFor={_id}>{question}</label>
                      <div className="form-control">
                        <label>image:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={hanlePosterChanger}
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={_id}>
                      <h2 htmlFor={_id}>{question}</h2>
                      <h3><input
                        className="form-control"
                        type={typeReponse}
                        name={_id}
                        onChange={handleInputChange}
                      /></h3>
                    </div>
                  );
                }
              } else if (categorie === "radio") {
                return (
                  <div key={_id}>
                    <h2>{question}</h2>
                    {options &&
                      options.map((option) => (
                        <label className="  "key={option}>
                          <input
                            type="radio"
                            name={_id}
                            value={option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                  </div>
                );
              } else if (categorie === "checkbox") {
                return (
                  <div key={_id}>
                    <h2>{question}</h2>
                    {options &&
                      options.map((option) => (
                        <label className=" " key={option}>
                          <input
                            type="checkbox"
                            name={_id}
                            value={option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                  </div>
                );
              } else {
                return null; // ou afficher un message d'erreur si le type de réponse est inconnu
              }
            })}
          <Link to="/confirmation">
            <button className="Submit" onClick={handleSubmit}>Submit</button>
          </Link>
        </div>
      </form>
      <div>
        <ReactModal isOpen={modalIsOpen} className="popup">
          <label htmlFor="telephone">Téléphone :</label>
          <input
            type="text"
            value={newVisiteur}
            onChange={(e) => setNewVisiteur(e.target.value)}
          />
          <button className="boutn" onClick={onSubmitHandler}>
           <div  className="icon"> <FaPhone /></div>
            Valider


          </button>
          {errorTel && <div>{errorTel}</div>}
            {error && <div>{error}</div>}
            {errorMessage ? <div className="error">{errorMessage}</div> : <></>}
        </ReactModal>
      </div>
    </div>
  );
}

export default Visiteur;