import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { LoginContext } from "../context/Login/Login";
import { toast } from "react-toastify";
import { useSocket } from "../context/socket/socket";
function Profile() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { token, userOpject } = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const oneTime = React.useRef(false);
  const { initializeSocket } = useSocket();

  useEffect(() => {
    const { email, firstName, lastName, mobileNumber } = userOpject;
    setEmail(email || "");
    setFirstName(firstName || "");
    setLastName(lastName || "");
    setPhoneNumber(mobileNumber || "");
  }, [userOpject]);

  React.useEffect(() => {
    if (oneTime.current) return;
    initializeSocket("test"); //! replace with user id
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();
    setSuccessMessage("");

    if (firstName.trim() === "" || firstName.length < 4) {
      setFirstNameError("First name should be more than 3 characters.");
      return;
    }
    if (lastName.trim() === "" || lastName.length < 4) {
      setLastNameError("Last name should be more than 3 characters.");
      return;
    }
    if (mobileNumber.trim() === "" || mobileNumber.length < 10) {
      setPhoneNumberError("Phone number should be at least 10 digits.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${backendUrl}user/`,
        {
          firstName,
          lastName,
          mobileNumber,
          email,
        },
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
        setLoading(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Error updating profile.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const resetErrors = () => {
    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setPhoneNumberError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");
    setSuccessMessage("");
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    return (
      hasUpperCase && hasLowerCase && hasNumbers && hasSymbols && isValidLength
    );
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      setEmailError("Email cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}user`,
        {
          email: newEmail,
        },
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setEmail(newEmail);
        setSuccessMessage("Email updated successfully!");
        setShowEmailModal(false);
      } else {
        toast.error("Error updating email.");
      }
    } catch (error) {
      toast.error("An error occurred while updating email. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    resetErrors();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setServerError("All password fields are required.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and symbols."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}user/updatePassword`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setShowPasswordModal(false);
      } else {
        toast.error("Error updating password.");
      }
    } catch (error) {
      toast.error("An error occurred while updating password.");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[80%] lg:w-[60%] mx-auto flex flex-col gap-6 rounded border-b border-gray-300 pb-6"
      >
        {/* Email */}
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <label
            htmlFor="email"
            className="w-full md:w-1/3 text-sm text-gray-700 mb-1 md:mb-0"
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            id="email"
            className="p-2 border border-blue-200 outline-none rounded w-full md:w-2/3 text-sm"
            readOnly
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center">
          <label
            htmlFor="firstName"
            className="w-full md:w-1/3 text-sm text-gray-700 mb-1 md:mb-0"
          >
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            id="firstName"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded w-full md:w-2/3 text-sm"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameError && (
            <p className="text-red-500 md:ml-4">{firstNameError}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center">
          <label
            htmlFor="lastName"
            className="w-full md:w-1/3 text-sm text-gray-700 mb-1 md:mb-0"
          >
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            id="lastName"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded w-full md:w-2/3 text-sm"
            required
            onChange={(e) => setLastName(e.target.value)}
          />
          {lastNameError && (
            <p className="text-red-500 md:ml-4">{lastNameError}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center">
          <label
            htmlFor="phoneNumber"
            className="w-full md:w-1/3 text-sm text-gray-700 mb-1 md:mb-0"
          >
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Phone Number"
            value={mobileNumber}
            id="phoneNumber"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded w-full md:w-2/3 text-sm"
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {phoneNumberError && (
            <p className="text-red-500 md:ml-4">{phoneNumberError}</p>
          )}
        </div>

        <button
          type="submit"
          className={`bg-orange-500 text-white py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {serverError && <p className="text-red-500">{serverError}</p>}
      </form>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setShowEmailModal(true)}
          className=" text-green-500 py-2 px-4 "
        >
          CHANGE EMAIL
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className=" text-green-500 py-2 px-4"
        >
          CHANGE PASSWORD
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Change Email</h2>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              className="p-2 border border-gray-300 rounded mb-4 w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={handleChangeEmail}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Update Email
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="ml-2 bg-gray-300 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Change Password</h2>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="p-2 border border-gray-300 rounded mb-4 w-full"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="p-2 border border-gray-300 rounded mb-4 w-full"
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="p-2 border border-gray-300 rounded mb-4 w-full"
            />
            {confirmPasswordError && (
              <p className="text-red-500">{confirmPasswordError}</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="ml-2 bg-gray-300 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
            {serverError && <p className="text-red-500">{serverError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
