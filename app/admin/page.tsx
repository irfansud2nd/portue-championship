"use client";
import LoginButton from "@/components/LoginButton";
import Authorized from "@/components/admin/Authorized";
import { AdminContextProvider } from "@/context/AdminContext";
import { MyContext } from "@/context/Context";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const AdminPage = () => {
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

  useEffect(() => {
    document.title = "Halaman Admin - Portue Silat Bandung Championship";
  }, []);

  return (
    <div className="w-full h-full">
      <Head>
        <title>Halaman Admin - Portue Silat Bandung Championship</title>
      </Head>
      {adminAuthorized && adminAuthorized.length ? (
        <AdminContextProvider>
          <Authorized />
        </AdminContextProvider>
      ) : userLoading || adminLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-4xl">loading...</p>
        </div>
      ) : (
        <div className="w-full h-full text-center flex justify-center items-center">
          <div className="bg-white text-white font-semibold text-xl w-fit px-3 py-2 rounded-md">
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
  );
};
export default AdminPage;
