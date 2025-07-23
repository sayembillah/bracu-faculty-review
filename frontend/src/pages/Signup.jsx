import React, { useState } from "react";
import { Switch, Disclosure } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpUserMutation } from "../redux/apiSlice";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false); // toggle to show invitation field

  const notifySuccess = () => toast("successfully created an account ✅");
  const notifyAlreadyExist = () => toast("User already exists 😅");
  const notifyFailure = () =>
    toast("There was an error creating an account ❌");
  const notifyInvalidToken = () => toast("Invalid Admin Invitation Token 😹");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim() || !email.trim() || !password || !retypePassword) {
      setFormError("All fields are required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== retypePassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (isAdmin && !invitationCode.trim()) {
      setFormError("Invitation code is required for admin signup.");
      return;
    }

    const payload = {
      name,
      password,
      email,
      adminInvitationToken: isAdmin ? invitationCode : null,
    };

    try {
      await signUpUser(payload).unwrap();
      notifySuccess();
      navigate("/login");
    } catch (err) {
      if (err.status === 400) {
        setFormError("User already exists.");
        notifyAlreadyExist();
      } else if (err.status === 498) {
        setFormError("Invalid Admin Invitation Token.");
        notifyInvalidToken();
      } else {
        setFormError("There was an error creating an account.");
        notifyFailure();
      }
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h2>
        <Toaster />
        {formError && (
          <div className="mb-2 text-red-600 text-sm font-medium text-center">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          {/* Retype Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Retype Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          {/* Show Password Switch */}
          <div className="flex items-center justify-between">
            <Switch
              checked={showPassword}
              onChange={setShowPassword}
              className={`${
                showPassword ? "bg-green-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${
                  showPassword ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
            <span className="ml-2 text-sm text-gray-600">Show password</span>
          </div>

          {/* Admin Role Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              Signing up as admin?
            </label>
          </div>

          {/* Invitation Code (only if admin) */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invitation Code
              </label>
              <input
                type="text"
                required={isAdmin}
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            {isLoading ? "Signing you up.." : "Sign Up"}
          </button>
        </form>

        {/* Help Section */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="text-sm text-green-600 hover:underline">
                {open ? "Hide help" : "Need help signing up?"}
              </Disclosure.Button>
              <Disclosure.Panel className="mt-2 text-sm text-gray-600">
                If you're an admin, ask your organization for an invitation
                code. For general users, just fill in your details.
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
