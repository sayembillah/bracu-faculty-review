import React, { useState, useRef } from "react";
import { useLoginUserMutation } from "../redux/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Switch, Disclosure } from "@headlessui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }).unwrap();
      const { name, email, role, token } = res;
      dispatch(setCredentials({ name, email, role, token }));

      localStorage.setItem(
        "authData",
        JSON.stringify({ name, email, role, token })
      );
      console.log(name, email, role, token);
      //   if (role === "admin") {
      //     navigate("/admin/dashboard");
      //   } else {
      //     navigate("/user/dashboard");
      //   }
    } catch (error) {
      console.log("login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex items-center justify-between">
            <Switch
              checked={showPassword}
              onChange={setShowPassword}
              className={`${
                showPassword ? "bg-blue-600" : "bg-gray-200"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="text-sm text-blue-600 hover:underline">
                {open ? "Hide help" : "Need help?"}
              </Disclosure.Button>
              <Disclosure.Panel className="mt-2 text-sm text-gray-600">
                If you forgot your password, contact support@example.com or
                click the reset link.
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default Login;
