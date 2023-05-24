import React, {  useEffect, useState } from "react";
import { useNavigate, useParams ,Link} from 'react-router-dom';
import NavbarR from "./Navbar";
import axios from "axios";
import MyChart from "../chartjs/MyChart";
import"./style.css"

function Resultat() {
  const { formId } = useParams();
  const [selectedTab, setSelectedTab] = useState(null);
  const [quest, setQuest] = useState(null);
  const [forms, setForms] = useState();
  const [slug,setSlug]=useState({})
  const [reponses, setReponses] = useState([]);
  const [allQuestions,setAllQuestions] = useState([])
 

const navigate =useNavigate()
  const handleNavClick = async (tab,e) => {
    setSelectedTab(tab);
    if (tab === "QUESTIONS") {
      handleQuestion();
    } else if (tab === "REPONSES") {
      try {
        const reponses = await axios.get(`http://localhost:5000/reponse/get/${formId}`);
        setReponses(reponses.data);
        console.log(reponses)
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  useEffect(() => {
    const fetchSlug = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/form/get/${formId}`);
        const form = response.data;
        setSlug(form.slug);
      } catch (error) {
        console.error('Error fetching form data:', error);
        // Gérer l'erreur en conséquence (retourner une valeur par défaut, afficher un message d'erreur, etc.)
      }
    };

    fetchSlug();
  }, [formId]);
  const handleQuestion = async () => {
    try {
      console.log(formId)
      const formResult = await axios.get(`http://localhost:5000/form/get/${formId}`);
      console.log(formResult.data);
      setForms(formResult.data);
      const quest = await axios.get(`http://localhost:5000/quest/get/${formId}`);
      console.log(quest.data);
      setQuest(quest.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    //handle input change logic here
  };

  const getQuestionText = async (questionId) => {
    const response = await axios.get(`http://localhost:5000/quest/${questionId}`);
    return response.data.question.question;
    
  };

  const handlechartjs=async()=>{
    navigate(`/stat/${formId}`)
  } 

  const handleGetAllQuestions = async()=>{
    await axios.get('http://localhost:5000/quest/get')
    .then(result=>{
      setAllQuestions(result.data.questions)
    })
  }

useEffect(()=>{
handleGetAllQuestions()
},[])
  return (
    <div  className="centered-form">
   <form className="Question">
   <NavbarR handleNavClick={handleNavClick} />

{selectedTab && selectedTab === "QUESTIONS" ? (
  <div>
    <label className="navquest">
    {quest !== null && quest.map(({ formId, question, categorie, typeReponse, options, index }) => {
      if (categorie === "text") {
        return (
          <div key={index}>
            <label htmlFor={formId}>{question}</label>
            <input
              className="form-control"
              type={typeReponse}
              name={formId}
              onChange={handleInputChange}
            />
          </div>
        );
      } else if (categorie === "radio") {
        return (
          <div key={formId} className="radio-question">
            <p>{question}</p>
            {options &&
              options.map((option, index) => (
                <label key={index} style={{ display: 'block', marginBottom: '5px' }}>
                  <input
                    type="radio"
                    name={formId}
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
          <form>
            <div key={formId} className="checkbox-question">
              <p>{question}</p>
              {options &&
                options.map((option, index) => (
                  <label key={index} style={{ display: 'block', marginBottom: '5px' }}>
                    <input
                      type="checkbox"
                      name={formId}
                      value={option}
                      onChange={handleInputChange}
                    /> {option}
                  </label>
                
              ))}
          
          
          </div>
          
          </form>
          
        );
        
      } else {
        return null; // ou afficher un message d'erreur si le type de réponse est inconnu
      }
    })}
    <div>
      
      <p>
        Voici le lien de partage :
        {slug && (
          <Link to={slug}>
            {slug}
          </Link>
        )}
  
      </p>
  
    </div>
    </label>
  </div>
  
) : null}
</form>
{selectedTab === "REPONSES" && (
  <div>
    {reponses && (
      <div>
        {Object.entries(
          reponses.reduce((acc, { reponse }) => {
            reponse.forEach(async ({ questionId, value }) => {
              if (acc[questionId]) {
                acc[questionId].push(value);
              } else {
                acc[questionId] = [value];
              }
              const questionText = await getQuestionText(questionId);
              console.log(questionText);
            });
            return acc;
          }, {})
        ).map(([questionText, values]) => (
          <div key={questionText}>
            <p>{allQuestions.length > 0 && allQuestions.filter(el => el._id === questionText)[0].question}</p>
            <ul>
              {values.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{selectedTab && selectedTab === "STATISTIQUES" ? (
  <div style={{ display: 'block', marginBottom: '5px' }}>
   <MyChart/>
</div>
) : null}

</div>
  
  );
}

export default Resultat;
