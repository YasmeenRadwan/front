import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../pages/signup/signup.css";

function SignUp() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [buildingNumber, setBuildingNumber] = useState(1);
  const [floorNumber, setFloorNumber] = useState(1);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressEerro, setAddressError] = useState(null);
  const [address, setAddress] = useState(false);
  const [droplist, setdroplist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirstNameError("");
    setLastNameError("");
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    // Validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    if (password.length < 8 || !validatePassowrd) {
      setPasswordError("Password length should be at least 8 characters");
      return;
    }
    if (firstName.trim() === "" || firstName.length < 4) {
      setFirstNameError("First name should be more than 3 characters");
      return;
    }
    if (lastName.trim() === "" || lastName.length < 4) {
      setLastNameError("Last name should be more than 3 characters");
      return;
    }
    if (email.trim() === "" || !validateEmail()) {
      setEmailError("Please enter a valid email");
      return;
    }
    if (!validateAdress() || addressEerro) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}user/signUp`, {
        firstName,
        lastName,
        email,
        password,

        city,
        country,
        buildingNumber,
        floorNumber,
        addressLabel,
      });

      console.log("User created:", response.data);
      navigate("/", { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setEmailError("Email already exists");
      } else {
        setEmailError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassowrd = () => {
    const emailRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    emailRegex.test(password);
    return emailRegex.test(password);
  };

  const validateAdress = () => {
    if (typeof city !== "string" || city.length < 3 || city.length > 50) {
      setAddressError("City must be a string and between 3 and 50 characters.");
      return false;
    } else if (
      typeof country !== "string" ||
      country.length < 3 ||
      country.length > 50
    ) {
      setAddressError(
        "Country must be a string and between 3 and 50 characters."
      );
      return false;
    } else if (
      typeof addressLabel !== "string" ||
      addressLabel.length < 3 ||
      addressLabel.length > 50
    ) {
      setAddressError(
        "Address label must be a string and between 3 and 50 characters."
      );
      return false;
    } else if (
      isNaN(Number(buildingNumber)) ||
      Number(buildingNumber) < 1 ||
      Number(buildingNumber) > 100
    ) {
      setAddressError("Building number must be a number between 1 and 100.");
      return false;
    } else if (
      isNaN(Number(floorNumber)) ||
      Number(floorNumber) < 1 ||
      Number(floorNumber) > 15
    ) {
      setAddressError("Floor number must be a number between 1 and 15.");
      return false;
    } else {
      setAddressError(null);
      return true;
    }
  };

  return (
    <div className="container items-center mx-auto px-4 md:px-8">
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 rounded">
        Create an Account
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto flex flex-col gap-4 py-6 px-6 md:px-8 mt-6 rounded shadow-md form-control"
      >
        {/* First Name */}
        <div className="formgroup flex flex-col">
          <label htmlFor="firstName" className="mb-2">
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            id="firstName"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameError && <p className="text-red-500">{firstNameError}</p>}
        </div>

        {/* Last Name */}
        <div className="formgroup flex flex-col">
          <label htmlFor="lastName" className="mb-2">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            id="lastName"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            required
            onChange={(e) => setLastName(e.target.value)}
          />
          {lastNameError && <p className="text-red-500">{lastNameError}</p>}
        </div>

        {/* Email */}
        <div className="formgroup flex flex-col">
          <label htmlFor="email" className="mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
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
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>

        {/* Confirm Password */}
        <div className="formgroup flex flex-col">
          <label htmlFor="confirm" className="mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Password"
            name="confirm"
            id="confirm"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && (
            <p className="text-red-500">{confirmPasswordError}</p>
          )}
        </div>
        {/* adress          */}
        <p className="text-center"> adress</p>
        <i
          className="fa-solid fa-arrow-down-wide-short text-center "
          onClick={() => setdroplist(!droplist)}
        ></i>
        {droplist && (
          <>
            <div className="formgroup flex flex-col">
              <label htmlFor="city" className="mb-2">
                {" "}
                city
              </label>
              <input
                type="text"
                placeholder="city"
                name="city"
                id="city"
                className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="formgroup flex flex-col">
              <label htmlFor="country" className="mb-2">
                {" "}
                country
              </label>
              <input
                type="text"
                placeholder="country"
                name="country"
                id="country"
                className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
                onChange={(e) => setCountry(e.target.value)}
              />
              {firstNameError && (
                <p className="text-red-500">{firstNameError}</p>
              )}
            </div>
            <div className="formgroup flex flex-col">
              <label htmlFor="bulding number" className="mb-2">
                {" "}
                bulding number
              </label>
              <input
                type="text"
                placeholder="bulding number"
                name="bulding number"
                id="bulding number"
                className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
                onChange={(e) => setBuildingNumber(e.target.value)}
              />
            </div>
            <div className="formgroup flex flex-col">
              <label htmlFor="floor number" className="mb-2">
                {" "}
                floor number
              </label>
              <input
                type="text"
                placeholder="floor number"
                name="floor number"
                id="floor number"
                className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
                onChange={(e) => setFloorNumber(e.target.value)}
              />
            </div>
            <div className="formgroup flex flex-col">
              <label htmlFor="adress" className="mb-2">
                {" "}
                adress label
              </label>
              <input
                type="text"
                placeholder="adress label"
                name="adress label"
                id="adress label"
                className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
                onChange={(e) => setAddressLabel(e.target.value)}
              />
              {addressEerro && <p className="text-red-500">{addressEerro}</p>}
            </div>
          </>
        )}

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
            "Sign Up"
          )}
        </button>

        <p className="text-center mt-[5px]">
          Already have an account?{" "}
          <Link to="/login" className="login-word text-orange-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
