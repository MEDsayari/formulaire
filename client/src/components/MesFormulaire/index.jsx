import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function MesFormulaire() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = await axios.get('http://localhost:5000/api/auth/last-login');
      const userId = user.data.data;
      const result = await axios.get(`http://localhost:5000/form/user/${userId}`);
      console.log(result);
      setForms(result.data);
    }
    fetchData();
  }, []);

  const handleFormClick = (formId) => {
    navigate(`/Resultat/${formId}`);
  };

  return (
    <div className="forms-container container">
      <h1 className='text-center w-100'>Liste de mes formulaires</h1>

      {forms &&
        forms.map((form) => (
          <div key={form._id} className="form-item">
            {/* <img
              src={form.imageUrl}
              alt=""
              
            /> */}
            <button className="form-title" onClick={() => handleFormClick(form._id)}>{form.titreForm}</button>
            {/* <div className="form-image-source">{form.imageUrl}</div> */}
          </div>
        ))}
    </div>
  );
}

export default MesFormulaire;