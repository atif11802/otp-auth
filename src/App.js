import React, { useState } from "react";
import { authentication } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [expandForm, setExpandForm] = useState("");
	const [otp, setOtp] = useState("");

	const generateRecaptcha = () => {
		window.recaptchaVerifier = new RecaptchaVerifier(
			"recaptcha-container",
			{
				// size: "invisible",
				callback: (response) => {
					// reCAPTCHA solved, allow signInWithPhoneNumber.
				},
			},
			authentication
		);
	};

	const requestOtp = (e) => {
		e.preventDefault();

		if (phoneNumber.length >= 10) {
			setExpandForm(true);
			generateRecaptcha();
			const appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(authentication, "+" + phoneNumber, appVerifier)
				.then((confirmationResult) => {
					// SMS sent. Prompt user to type the code from the message, then sign the
					// user in with confirmationResult.confirm(code).
					window.confirmationResult = confirmationResult;
					console.log(confirmationResult);
					// ...
				})
				.catch((error) => {
					console.log(error);
					// Error; SMS not sent
					// ...
				});
		}
	};

	const verifyOtp = (e) => {
		let otp = e.target.value;
		setOtp(otp);
		if (otp.length === 6) {
			let confirmationResult = window.confirmationResult;

			confirmationResult
				.confirm(otp)
				.then((result) => {
					// User signed in successfully.
					const user = result.user;
					console.log(user);
					toast.success("hello bro otp confirmed", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
					// ...
				})
				.catch((error) => {
					// User couldn't sign in (bad verification code?)
					// ...
					toast.error("error in otp", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				});
		}
	};

	return (
		<div>
			<form onSubmit={requestOtp}>
				<input
					onChange={(e) => setPhoneNumber(e.target.value)}
					type='number'
					placeholder='enter your number'
					value={phoneNumber}
				/>
				{expandForm && (
					<div className='mb-3'>
						<input
							type='number'
							placeholder='enter your otp'
							value={otp}
							onChange={verifyOtp}
						/>
					</div>
				)}

				<div id='recaptcha-container'></div>
			</form>
			<ToastContainer />
		</div>
	);
};

export default App;
