import React, { useState } from "react";
import { Switch, Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false); // toggle to show invitation field

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== retypePassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      name,
      email,
      password,
      role: isAdmin ? "admin" : "user",
      invitationCode: isAdmin ? invitationCode : null,
    };

    console.log("Signup payload:", payload);
    // Here you'd dispatch a signup mutation or call API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h2>

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
            Sign Up
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
