import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/Login/Login";
import "./login/login.css";
import axios from "axios";
import { toast } from "react-toastify";
// import { useSocket } from "../context/socket/socket";

function Login() {
  const { login, setAdmin, isLoggedIn, setUserOpject, setIsLoggedIn, token } =
    useContext(LoginContext);
  // const { initializeSocket } = useSocket();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}user/signIn/`, {
        identifier,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      localStorage.setItem("token", response.data.token);

      if (response.data.user.role === "Admin") {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
      console.log(response.data.user._id);
      if (response.status === 200) {
        const { token } = response.data;

        if (!token) {
          toast.error("Failed to login. Please try again.");
          setIsLoading(false);
          return;
        }
        // initializeSocket(response.data.user._id);
        login(identifier);

        localStorage.setItem("userId", response.data.user._id);

        toast.success("Login successful! Welcome back!");

        setTimeout(() => {
          navigate("/");
        }, 700);
      } else {
        toast.error("Unexpected server response. Please try again.");
      }
    } catch (error) {
      toast.error("Error Occured ", error.response?.data);

      if (error.response) {
        if (error.response.status === 401) {
          setServerError("Invalid email or password.");
        } else {
          setServerError(
            `Error: ${error.response.data.message || "An unexpected error occurred."}`
          );
        }
      } else if (error.request) {
        setServerError("No response from server. Please check your network.");
      } else {
        setServerError("Error: Failed to send request.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetErrors = () => {
    setIdentifierError("");
    setPasswordError("");
    setServerError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="container mx-auto px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[60%] lg:w-[50%] mx-auto flex flex-col gap-[30px] border py-[30px] px-[20px] md:px-[50px] mt-[50px] md:mt-[80px] rounded shadow-md form-control"
      >
        {/* Identifier */}
        <div className="formgroup flex flex-col">
          <label htmlFor="identifier" className="mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="identifier"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            required
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {identifierError && (
            <div className="text-red-500">{identifierError}</div>
          )}
        </div>

        {/* Password */}
        <div className="formgroup flex flex-col">
          <label htmlFor="password" className="mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/forgot-password" className="text-sm float-left mt-6 mb-4">
            Forgot Password?
          </Link>
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>

        {serverError && <p className="text-red-500">{serverError}</p>}

        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button
          type="submit"
          className="btn bg-orange-500 text-white w-[50%] mx-auto py-2 rounded flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-lg">
          Don't have an account?{" "}
          <Link to="/signup" className="text-lg text-orange-500">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
