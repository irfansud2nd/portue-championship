"use client";
import LoginButton from "@/components/LoginButton";
import Authorized from "@/components/admin/Authorized";
import { MyContext } from "@/context/Context";
import { useEffect } from "react";

const AdminPage = () => {
  const {
    user,
    userLoading,
    adminLoading,
    adminAuthorized,
    checkAdminAuthorized,
  } = MyContext();

  useEffect(() => {
    if (user) checkAdminAuthorized(user);
  }, [user]);

  return (
    <div className="max-w-[100vw] h-full">
      {adminAuthorized && adminAuthorized.length ? (
        <Authorized />
      ) : userLoading || adminLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-4xl">loading...</p>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-fit bg-gray-200 p-2 text-center">
            <h1 className="text-red-500 text-2xl font-bold mb-2">
              AUTHORIZED PERSONEL ONLY
            </h1>
            <LoginButton />
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPage;
