import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages-css/ForgotPassword.css";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpSent(false);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      showAlert("Please enter a valid email address.","error");
      return;
    }

    await fetch("${BASE_URL}/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStep(2);
    setOtpSent(true);
    setTimer(60);
  };

  const handleVerifyOtp = async () => {
    const res = await fetch(`${BASE_URL}/api/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) setStep(3);
  };

  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  const handleResetPassword = async () => {
    const response = await fetch(`${BASE_URL}/api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await response.json();
    if (data.message === "Password reset successfully") {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="forgetcard-content">
          <h2 className="title">Forgot Password</h2>
          <input
            type="email"
            className="input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step > 1}
          />
          {step === 1 && (
            <button
              className="submit-button"
              onClick={handleSendOtp}
              disabled={!isValidEmail(email)}
            >
              Send OTP
            </button>
          )}

          {step >= 2 && (
            <div className="otp-container">
              <p className="otp-label">Enter OTP</p>
              <input
                type="text"
                className="otp-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={step > 2}
              />
              {otpSent && timer > 0 && <p>OTP expires in: {timer}s</p>}
              {step === 2 && (
                <div>
                  <button className="submit-button" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                  <button
                    className="submit-button"
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                  >
                    Resend OTP {timer > 0 && `(${timer}s)`}
                  </button>
                </div>
              )}
            </div>
          )}

          {step >= 3 && (
            <div>
              <input
                type="password"
                className="input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className="submit-button" onClick={handleResetPassword}>
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
