import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import FormInput from "./components/StepOneForm";
import Form from "./components/question";
import MesFormulaire from "./components/MesFormulaire";
import Reponse  from "./components/Reponse";
import Confirmation from "./components/Thank";
import Resultat from "./components/Resultat";
import EditQuest from "./components/Edit_question"
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from "./components/reset_password/ForgotPassword";
import ResetPassword from "./components/reset_password/ResetPassword";
import MyChart from "./components/chartjs/MyChart";
import Edit from "./components/editProfile"

function App() {
	const user = localStorage.getItem("token");
	const formSlug = localStorage.getItem(
		"formSlug",	"http://localhost:3000/Form"
	  );

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
		    <Route path="/TitleF" exact element={<FormInput/>}/>
			<Route path="/Form" exact element={<Form/>}/>
			<Route path="/MesFomr" exact element={<MesFormulaire/>}/>			
			<Route path={`/rep/${formSlug}`} exact element={<Reponse/>} />
			<Route path="/confirmation" exact element={<Confirmation/>}/>
			<Route path ={'/Resultat/:formId'}exact element={<Resultat/>}/>
			<Route path='/edit/:id' exact element={<EditQuest/>}/>
			<Route path="/" element={<Navigate replace to="/login" />} />
			{/*   les routes de reset password */}
			<Route path="/forgot_password" element={<ForgotPassword />} />
			<Route path="/reset_password/:id" element={<ResetPassword />} />
			<Route path="/stat/:formId" exact element={<MyChart/>}/>
			<Route path="/editProfile/:userId" element={<Edit/>}/>
		</Routes>
	);
}

export default App;
