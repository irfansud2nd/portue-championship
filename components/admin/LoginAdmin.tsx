"use client";
import { MyContext } from "@/context/Context";
import { newToast } from "@/utils/sharedFunctions";
import { useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { adminLogin, user } = MyContext();

  const toastId = useRef(null);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      adminLogin(email, password);
    } catch (error: any) {
      newToast(toastId, "error", error.messages);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ToastContainer />
      <form
        onSubmit={(e) => loginHandler(e)}
        className="bg-gray-300 flex flex-col gap-2 justify-center px-5 py-2 rounded-md"
      >
        <div className="input_container">
          <label className="input_label">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input_container">
          <label className="input_label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn_navy_gold btn_full self-end">Login</button>
      </form>
    </div>
  );
};
export default LoginAdmin;
