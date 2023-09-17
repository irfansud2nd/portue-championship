"use client";
import Scoring from "@/components/scoring/Scoring";
import { MyContext } from "@/context/Context";
import { ScoringContextProvider } from "@/context/ScoringContext";
import Link from "next/link";
import { useEffect } from "react";

const ScoringPage = () => {
  const {
    user,
    userLoading,
    adminLoading,
    adminAuthorized,
    checkAdminAuthorized,
    googleSignIn,
  } = MyContext();

  const loginHandler = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (user) checkAdminAuthorized(user);
  }, [user]);

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gray-200 rounded-md p-2">
        {adminAuthorized &&
        adminAuthorized.length &&
        (adminAuthorized.indexOf("scoring") >= 0 ||
          adminAuthorized.indexOf("master") >= 0) ? (
          <ScoringContextProvider>
            <Scoring />
          </ScoringContextProvider>
        ) : userLoading || adminLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-4xl">loading...</p>
          </div>
        ) : (
          <div className="w-full h-full text-center flex justify-center items-center">
            <div className="bg-black text-white font-semibold text-xl w-fit px-3 py-2 rounded-md">
              <h1 className="text-red-500 mb-3">AUTHORIZED PERSONEL ONLY</h1>
              {user ? (
                <Link href="/" className="btn_red btn_full">
                  Kembali ke Halaman Utama
                </Link>
              ) : (
                <button className="btn_red btn_full" onClick={loginHandler}>
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ScoringPage;
