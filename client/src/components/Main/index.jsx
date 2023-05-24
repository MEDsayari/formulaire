import React, { useState , useEffect} from "react";
import style from "./styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { IoLogOutSharp } from "react-icons/io5";
import { TbClipboardPlus } from "react-icons/tb";
import { TbClipboardCheck } from "react-icons/tb";
import { Link } from "react-router-dom";




const Main = () => {



  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  const [user,setUser]=useState()
	useEffect(() => {
		async function fetchData() {
		  const User = await axios.get('http://localhost:5000/api/auth/last-login');
		  const userId = User.data.data;
		  setUser(userId)
		  console.log(user)
	  } fetchData();
	  }, [user]);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/TitleF";
  };
  
  const handleHistory = () => {
    window.location.href = "/MesFomr";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigate = useNavigate();


  return (
    <div className={style.body}>
    <div className={style.main_container}>
    

        <div className={style.btn}>
          <button className={style.marron_btn + ' '+ style.floathover} onClick={handleLogout}>
            <TbClipboardPlus />
            Crée Formulaire
            </button>
   
          <br />
          <button className={style.marron_btn + ' '+ style.floathover} onClick={handleHistory}>
            <TbClipboardCheck />
            Mes Formulaire
          </button     >
        </div>
      </div>
      <button className={style.Modifier + ' '+ style.floathover} onClick={()=>{navigate(`/editProfile/${user}`)}}>Modifier les données de mon compte</button>
    </div>
   
  );
};

export default Main;
