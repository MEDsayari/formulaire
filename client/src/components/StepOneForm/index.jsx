import axios from 'axios';
import React, { useState } from 'react'
import slugify from 'slugify';
import "./style.css"
function Form() {
  const [formLink, setFormLink] = useState('');
  const [formInfo, setFormInfo] = useState({
    titreForm: '',
    description: '',
    slug:'',
    userid:'',
  });

  const handleSuivantClick = async () => {
    try {
      const user= await axios.get('http://localhost:5000/api/auth/last-login');
      const userId=(user.data.data)
      console.log(userId)
      const formInfoWithUserId = { ...formInfo, userId };
      await axios.post('http://localhost:5000/form/add', formInfoWithUserId);
      alert('Formulaire créé avec succès !');
      localStorage.setItem('formLink', formLink);
      window.location.href='/Form';
    } catch (error) {
      console.log(error);
      alert("Une erreur est survenue lors de la création du formulaire.");
    }
  }
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormInfo(prevState => ({ ...prevState, [name]: value }));
  }
  
  const generateSlug = () => {
    const formSlug = slugify(formInfo.titreForm, { lower: true });
    localStorage.setItem('formSlug',formSlug);
    const link =`http://localhost:3000/rep/${formSlug}`;
    setFormLink(link);
    setFormInfo(prevState => ({ ...prevState, slug: formLink }));
  };

  return (
    <div className='Form_container'>
      <div className='Form_title'>
        <label> Titre du formulaire </label>    
        <input name="titreForm" type='text' value={formInfo.titreForm} onChange={handleInputChange}/>
        <label> description du formulaire</label>
        <input name="description" type='text' value={formInfo.description} onChange={handleInputChange}/>
      </div>
      <div className='row mx-0'>
        <button onClick={generateSlug} className="generate-slug-btn col-auto"> Générer Slug </button>
        <input name="slug" type ='text' className="col" value ={formInfo.slug} readOnly></input>
      </div>
      {formLink && (
        <p>Copiez le lien suivant pour partager ce formulaire : <a href={formLink}>{formLink}</a></p>
      )}
      
      <div>
        <button onClick={handleSuivantClick}className="Suivant"> Suivant </button>
      </div>
    </div>
  )
}

export default Form;