"use client";
import { MyContext } from "@/context/Context";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsGoogle } from "react-icons/bs";

const LoginButton = () => {
  const { user, googleSignIn, userLoading } = MyContext();
  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {/* {userLoading ? (
        <div className="w-full rounded-full font-semibold text-lg btn_navy_gold flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin h-7" />
        </div>
      ) : user ? (
        <Link
          href="/halaman-pendaftaran"
          className="w-full rounded-full font-semibold text-lg btn_navy_gold text-center"
        >
          Halaman Pendaftaran
        </Link>
      ) : (
        <button
          className="w-full rounded-full font-semibold text-lg btn_navy_gold"
          onClick={handleLogin}
        >
          <BsGoogle className="inline mb-1" /> Login Dengan Google
        </button>
      )} */}
      <div className="w-full rounded-full font-semibold text-lg btn_navy_gold flex justify-center px-2">
        Pendaftaran dimulai 4 September 2023
      </div>
    </>
  );
};
export default LoginButton;
