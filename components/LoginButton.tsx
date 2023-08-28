"use client";
import { MyContext } from "@/context/Context";
import Link from "next/link";
import { BsGoogle } from "react-icons/bs";
const LoginButton = () => {
  const { user, googleSignIn } = MyContext();
  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {user ? (
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
      )}
    </>
  );
};
export default LoginButton;
