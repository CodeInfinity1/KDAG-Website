import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Particless from "../Common/Particles/Particless";
import "./AuthPage.css";
import Fade from "react-reveal/Fade";

const GoogleAuthCallback = () => {
	const location = useLocation();
	const history = useHistory();

	const particless = React.useMemo(() => <Particless />, []);
	const [isSignUpActive, setIsSignUpActive] = useState(false);
	const [showUsermessage, setShowUsermessage] = useState(false);
	const [userMessage, setUserMessage] = useState("");
	const [register_firstName, setRegister_firstName] = useState("");
	const [register_lastName, setRegister_lastName] = useState("");
	const [register_userName, setRegister_userName] = useState("");
	const [register_college, setRegister_college] = useState("");
	const [register_phone, setRegister_phone] = useState("");
	const [redirect, setRedirect] = useState("");
	const [uid, setUid] = useState("");

	if (showUsermessage) {
		setTimeout(() => {
			setShowUsermessage(false);
		}, 25000);
	}

	useEffect(() => {
		if (redirect == "Forum_page_") {
			history.push("/forum");
		}
	}, [redirect]);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const code = queryParams.get("code");

		if (code) {
			fetch(`${process.env.REACT_APP_FETCH_URL}/user/auth/google/callback`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code }),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					console.log("Response from backend:", data);
					const { access_token, refresh_token } = data;
					localStorage.setItem("access_token", access_token);
					localStorage.setItem("refresh_token", refresh_token);
					setRedirect(data.redirect);
					setUid(data.uid);
				})
				.catch((error) => {
					console.error("Error during authentication:", error);
				});
		} else {
			console.error("No authorization code received");
		}
	}, [location]);

	const submitRegister = async (e) => {
		e.preventDefault();
		if (register_phone.length !== 10 || isNaN(register_phone)) {
			setUserMessage("Please Enter a valid numeric phone number");
			setShowUsermessage(true);
			return;
		}

		const user_data = {
			f_name: register_firstName,
			l_name: register_lastName,
			username: register_userName,
			college: register_college,
			phone: register_phone,
			uid: uid,
		};

		const token  = localStorage.getItem("access_token")

		const response = await fetch(
			`${process.env.REACT_APP_FETCH_URL}/user/signup`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization" : `Bearer ${token}`,
				},
				body: JSON.stringify({
					...user_data,
				}),
			}
		);

		try {
			if (response.ok) {
				const content = await response.json();
				setUserMessage("Registration successful");
				setShowUsermessage(true);
				setIsSignUpActive(!isSignUpActive);
				setInterval(() => {
					history.push("/forum");
				}, 2000);
			} else {
				const jsonData = await response.json();
				setUserMessage(jsonData.message);
				setShowUsermessage(true);
			}
		} catch (error) {
			setUserMessage(error);
			setShowUsermessage(true);
		}
	};

	return (
		<>
			<Fade left>
				<div className="auth-outer-container">
					{showUsermessage && (
						<div className={`user_message`}>{userMessage}</div>
					)}

					<div className="auth-container active ">
						<div className="form-container sign-up">
							<form onSubmit={submitRegister}>
								<>
									<h1>Create Account</h1>
									<input
										type="text"
										placeholder="First Name"
										required
										onChange={(e) => setRegister_firstName(e.target.value)}
									/>
									<input
										type="text"
										placeholder="Last Name"
										onChange={(e) => setRegister_lastName(e.target.value)}
									/>
									<input
										type="text"
										placeholder="Username"
										required
										onChange={(e) => setRegister_userName(e.target.value)}
									/>
									<input
										type="text"
										placeholder="College"
										required
										onChange={(e) => setRegister_college(e.target.value)}
									/>
									<input
										type="number"
										placeholder="Phone No."
										required
										onChange={(e) => setRegister_phone(e.target.value)}
									/>

									<button type="submit">Sign Up</button>
								</>
							</form>
						</div>
						<div className="toggle-container">
							<div className="toggle active">
								<div className="toggle-panel toggle-left">
									<h1>Hi Friend!</h1>
									<p>
										If you already have an account Sign in to unlock access to
										your account and explore all the features our website has to
										offer.
									</p>
									<button className="hidden" style={{ cursor: "none" }}>
										<a href="/auth">Sign In</a>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Fade>
			{particless}
		</>
	);
};

export default GoogleAuthCallback;
