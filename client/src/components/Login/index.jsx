import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ adresseEmail: "",motDePasse: "" });
	const [error, setError] = useState("");
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
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
		<div className={styles.login_container}>
			<div className={styles.login_form_container + ' row'}>
				<div className={styles.left  + ' col-md-8 p-5' }>
					<form className={styles.form_container} onSubmit={handleSubmit}>
					<div className={styles.icon_container }>
  </div>
						<h1 className="pb-10">Login to Your Account</h1>
						<input
							type="email"
							placeholder="adresseEmail"
							name="adresseEmail"
							onChange={handleChange}
							value={data.adresseEmail}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="motDePasse"
							name="motDePasse"
							onChange={handleChange}
							value={data.motDePasse}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn + ' mt-4'}>
							Sing In
						</button>
					</form>
					<Link to="/forgot_password">
						<button type="button" className={styles.passe}>
						mot de passe oublier
						</button>
					</Link>
				</div>
				<div className={styles.right  + ' col-md-4 p-5'}>
					<h1>New User ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sing Up
						</button>
					</Link>
					
				</div>
				
			</div>
		</div>
	);
};

export default Login;
