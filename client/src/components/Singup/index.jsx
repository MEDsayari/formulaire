import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		prenom:"" ,
		nomDeFamille:"" ,
		adresseEmail:"" ,
		motDePasse:"",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sing in
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="prenom"
							name="prenom"
							onChange={handleChange}
							value={data.prenom}
							required
							className="input"
						/>
						<input
							type="text"
							placeholder="nomDeFamille"
							name="nomDeFamille"
							onChange={handleChange}
							value={data.nomDeFamille}
							required
							className="input"
						/>
						<input
							type="email"
							placeholder="adresseEmail"
							name="adresseEmail"
							onChange={handleChange}
							value={data.adresseEmail}
							required
							className="input"
						/>
						<input
							type="password"
							placeholder="mot De Passe"
							name="motDePasse"
							onChange={handleChange}
							value={data.motDePasse}
							required
						className="input"
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sing Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
