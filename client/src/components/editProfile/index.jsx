import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import"./style.css"
function Edit() {
    const [data, setData] = useState({
        prenom: "",
        nomDeFamille: "",
        adresseEmail: ""
      });
      
  const {userId} = useParams()

  useEffect(() => {
    const fetchData = async () => {
        try {
          // Effectuer une requête à l'API pour récupérer les données de l'utilisateur
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`); // Remplacez "/api/user" par l'URL de votre API pour récupérer les données du user
          const userData = response.data;
          console.log(userData)
          // Mettre à jour l'état avec les données récupérées
          setData({
            prenom: userData.prenom,
            nomDeFamille: userData.nomDeFamille,
            adresseEmail: userData.adresseEmail

          });
        } catch (error) {
          console.error(error);

          // Gérer l'erreur en conséquence (afficher un message d'erreur, rediriger vers une page d'erreur, etc.)
        }
      };
    fetchData();
  }, []);


  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };
  
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Supprimez le champ "password" de l'objet "data"
    const { motDePasse, ...userData } = data;

    // Effectuer une requête à l'API pour mettre à jour les données de l'utilisateur
    const response = await axios.put(`http://localhost:5000/api/users/${userId}`, userData);
    const updatedUser = response.data;
    setData({
        prenom: updatedUser.prenom,
        nomDeFamille: updatedUser.nomDeFamille,
        adresseEmail: updatedUser.adresseEmail
    });

    // Afficher un message de succès ou effectuer une action supplémentaire si nécessaire
    toast.success("Données utilisateur mises à jour avec succès !");

  } catch (error) {
    console.error(error);
    console.log(error.response.data);

    // Gérer l'erreur en conséquence (afficher un message d'erreur, rediriger vers une page d'erreur, etc.)
  }
};
const handleDelete = async () => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
    const { message } = response.data;
    toast.success(message);
    // Réinitialiser les données ou effectuer une autre action si nécessaire après la suppression réussie de l'utilisateur
  } catch (error) {
    console.error(error);
    toast.error("Une erreur s'est produite lors de la suppression de l'utilisateur");
    // Gérer l'erreur en conséquence (afficher un message d'erreur, rediriger vers une page d'erreur, etc.)
  }
};

  return (
 
    <div className='container'>
       <ToastContainer/>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="prenom">Nom :</label>
          <input
           type="text"
           placeholder="prenom"
           name="prenom"
            value={data.prenom}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nomDeFamille">Prénom :</label>
          <input
            type="text"
            id="nomDeFamille"
            name="nomDeFamille"
            value={data.nomDeFamille}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="adresseEmail">Email :</label>
          <input
            type="adresseEmail"
            id="adresseEmail"
            name="adresseEmail"
            value={data.adresseEmail}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Modifier</button>
        <div>
        <button type="button" onClick={handleDelete}>
  Supprimer compte
</button>
        </div>
      </form>
    </div>
  );
}

export default Edit;