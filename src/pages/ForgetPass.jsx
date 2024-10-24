import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="relative w-8 h-8 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
  </div>
);

const ForgetPassword = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isOtpResending, setIsOtpResending] = useState(false);
  const [successMessageDisplayed, setSuccessMessageDisplayed] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      !lengthCheck ||
      !uppercaseCheck ||
      !lowercaseCheck ||
      !numberCheck ||
      !symbolCheck
    ) {
      return "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a symbol.";
    }
    return null;
  };

  const startOtpCooldown = () => {
    setOtpCooldown(true);
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpCooldown(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (otpCooldown) return;

    setMessage("");
    setEmailError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}user/otpPassword`, {
        email,
      });

      if (response.status === 200) {
        setMessage("OTP has been sent to your email.");
        setStep(2);
        startOtpCooldown();
      } else {
        setEmailError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 404) {
        setEmailError("This email is not registered.");
      } else {
        setMessage("Failed to send OTP, please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setNewPasswordError("");
    setConfirmPasswordError("");

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setNewPasswordError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${backendUrl}user/forgetPassword`, {
        email,
        otp,
        newPassword,
      });
      console.log("Response:", response);
      setMessage("Password changed successfully.");
      setSuccessMessageDisplayed(true);
      setStep(3);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to change password, check OTP and try again.");
    } finally {
    }
  };

  const handleResendOtp = async () => {
    setIsOtpResending(true);
    setMessage("");
    try {
      const response = await axios.post(`${backendUrl}user/otpPassword`, {
        email,
      });
      setMessage("OTP has been resent to your email.");
      startOtpCooldown();
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to resend OTP, please try again.");
    } finally {
      setIsOtpResending(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        {isLoading || isOtpResending ? (
          <LoadingSpinner />
        ) : (
          <>
            {message && <p className="text-center text-green-500">{message}</p>}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Forget Password</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendOtp();
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mb-2">{emailError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white p-2 rounded mt-4 hover:bg-orange-600"
                  >
                    Send OTP
                  </button>
                </form>
                {otpCooldown && (
                  <p className="text-red-500 text-sm mt-2">
                    Please wait {countdown} seconds before resending OTP.
                  </p>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePassword();
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="otp" className="block text-gray-700 mb-2">
                      OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    {newPasswordError && (
                      <p className="text-red-500 text-sm mb-2">
                        {newPasswordError}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {confirmPasswordError && (
                      <p className="text-red-500 text-sm mb-2">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white p-2 rounded mt-4 hover:bg-orange-600"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`w-full text-orange-500  p-2 rounded mt-4 hover:text-orange-600 ${otpCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={otpCooldown}
                  >
                    Resend OTP
                  </button>
                  {otpCooldown && (
                    <p className="text-red-500  text-center text-sm mt-2">
                      Please wait {countdown} seconds before resending OTP.
                    </p>
                  )}
                </form>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-center text-green-500">
                  {successMessageDisplayed}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
