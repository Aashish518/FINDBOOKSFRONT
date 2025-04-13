import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import "../pages-css/Login.css";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const Login = () => {
 
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);


  const [Regcredentials, SetRegcredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [Logcredentials, Setlogcredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const {showAlert } =useAlert();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);



  const handleSendOtp = async (event) => {
    event.preventDefault(); 
    event.stopPropagation();

    if (!Regcredentials.email) {
      showAlert("please enter your email address","error")
      return;
    }
    else if (!isValidEmail(Regcredentials.email)) {
      showAlert("Please enter valid email address.","error");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/registerotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: Regcredentials.email }),
      });

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      } else {
        setStep(2);
       showAlert("OTP sent successfully. Please check your email.","success");
      }
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      showAlert("Error sending OTP. Please try again later.","error");
    }
  };



  const handleVerifyOtp = async () => {
    if (!Regcredentials.email || !otp) {
      showAlert("Please enter both email and OTP.","error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: Regcredentials.email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed.");
      }
      else {
        setVerified(true);
        setStep(3); 
      }

      showAlert("OTP verified successfully.","success");
      setStep(3);

    } catch (error) {
      console.error("Error verifying OTP:", error);
      showAlert(error.message,"error");
    }
  };



  const validateRegistration = () => {
    const newErrors = {};

    if (Regcredentials.firstName.trim().length < 2) {
      newErrors.firstName = "First name is required and must be at least 2 characters";
    }

    if (Regcredentials.lastName.trim().length < 2) {
      newErrors.lastName = "Last name is required and must be at least 2 characters";
    }

    if (!Regcredentials.email.toLowerCase().endsWith("@gmail.com")) {
      newErrors.email = "Please enter a valid Gmail address";
    }

    if (!/^\d{10}$/.test(Regcredentials.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (Regcredentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const validateLogin = () => {
    const newErrors = {};

    if (!Logcredentials.email.toLowerCase().endsWith("@gmail.com")) {
      newErrors.loginEmail = "Please enter a valid Gmail address";
    }

    if (Logcredentials.password.length < 6) {
      newErrors.loginPassword = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleReg = async (e) => {
    e.preventDefault();

    if (!verified) {
      setShowVerifyMessage(true);
      return;
    }

    if (!validateRegistration()) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Regcredentials),
        credentials: "include"
      });

      const json = await response.json();

      if (json.authtoken) {
        Cookies.set('token', json.authtoken);
        showAlert("Registered successfully!","success");
        navigate("/");
      } else {
        showAlert(json.message || "Registration failed","error");
      }

    } catch (error) {
      showAlert("An error occurred. Please try again later.","error");
      console.error(error);
    }
  };



  const HandleLog = async (e) => {
    e.preventDefault();

    if (!validateLogin()) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Logcredentials),
        credentials: "include"
      });

      const json = await response.json();

      if (json.success && json.authtoken) {
        Cookies.set('token', json.authtoken);
        showAlert("Login successful!","success");

        if (json.user.Role === "Deliveryperson" || json.user.Role === "Admin") {
          navigate("/profile")
        } else {
          navigate("/");
        }

      } else {
        showAlert("Invalid credentials","error");
      }

    } catch (error) {
      console.error(error.message);
    }
  };



  const RegChange = (e) => {
    const { name, value } = e.target;
    SetRegcredentials((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };



  const LogChange = (e) => {
    const { name, value } = e.target;
    Setlogcredentials((prev) => ({ ...prev, [name]: value }));

    if (errors[`login${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`login${name.charAt(0).toUpperCase() + name.slice(1)}`]: "" }));
    }
  };



  return (
    <div
      className={`container ${isPanelActive ? "right-panel-active" : ""}`}
      id="container"
    >
      <div className="form-container sign-up-container">
        <form onSubmit={handleReg}  style={{paddingTop:"5vh", backgroundColor:"white",paddingBottom:""}}>
        <br/><br/><br/>
          <h1>Registration</h1><br />
          {/* <div className="social-container">
          {/* <a href="#" className="social">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div> */}
          <span>or use your email for registration</span>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First name"
              value={Regcredentials.firstName}
              onChange={RegChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last name"
              value={Regcredentials.lastName}
              onChange={RegChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={Regcredentials.email}
              onChange={RegChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}


            {step === 1 && (
              <button onClick={handleSendOtp}  className="submit-button">
                Send OTP
              </button>
            )}

            {step === 2 && !verified && (
              <div className="otp-container">
                <p className="otp-label">Enter OTP</p>
                <input
                  type="text"
                  className="otp-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div>
                  <button className="submit-button" onClick={handleVerifyOtp}>Verify OTP</button>  
                </div>
              </div>
            )}

            {verified ? (
              <div className="otp-success">
                <p className="success-message">Email Verified Successfully!</p>
              </div>
            ) : (
              <div className="delivery-confirmation">
                {showVerifyMessage && <p className="error-message">Please verify your email before registering.</p>}
              </div>
            )}




          </div>
          <div className="input-group">
            <input
              type="text"
              name="mobile"
              id="mobile"
              placeholder="Mobile No"
              value={Regcredentials.mobile}
              onChange={RegChange}
              className={errors.mobile ? 'error' : ''}
              maxLength="10"
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={Regcredentials.password}
              onChange={RegChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button>Register</button><br/><br/><br/>
        </form>
      </div >

      <div className="form-container sign-in-container">
        <form onSubmit={HandleLog}>
          <h1>Login</h1><br />
          {/* <div className="social-container">
          {/* <a href="#" className="social">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div> */}
          <span>or use your account</span>
          <div className="input-group">
            <input
              type="email"
              name="email"
              id="email2"
              placeholder="Email"
              value={Logcredentials.email}
              onChange={LogChange}
              className={errors.loginEmail ? 'error' : ''}
            />
            {errors.loginEmail && <span className="error-message">{errors.loginEmail}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              id="password2"
              placeholder="Password"
              value={Logcredentials.password}
              onChange={LogChange}
              className={errors.loginPassword ? 'error' : ''}
            />
            {errors.loginPassword && <span className="error-message">{errors.loginPassword}</span>}
          </div>
          <p className="forget"><Link to="/ForgotPassword">Forgot your password?</Link></p><br />
          <button>Login</button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1><br />
            <p>
              To keep connected with us please login with your personal info
            </p><br />
            <button className="ghost" id="signIn" onClick={() => setIsPanelActive(false)}>Login</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1><br />
            <p>Enter your personal details and start your journey with us</p><br />
            <button className="ghost" id="signUp" onClick={() => setIsPanelActive(true)}>Registration</button>
          </div>
        </div>
      </div>
    </div >
  );
};
