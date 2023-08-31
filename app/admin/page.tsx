"use client";
import LoginAdmin from "@/components/admin/LoginAdmin";
import TabelAdmin from "@/components/admin/TabelAdmin";
import { MyContext } from "@/context/Context";

const AdminPage = () => {
  const { adminAuthorized } = MyContext();
  return (
    <div className="w-full h-full">
      {adminAuthorized ? <TabelAdmin /> : <LoginAdmin />}
    </div>
  );
};
export default AdminPage;
