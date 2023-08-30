"use client";
import { MyContext } from "@/context/Context";
import { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { BiSolidLogInCircle } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Profile = () => {
  const { user, logOut, disable, userLoading } = MyContext();
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="max-w-[160px] w-[160px]">
      <div className="flex items-center gap-2 w-fit bg-white rounded-full p-2">
        {user ? (
          user.photoURL ? (
            <Image
              src={user.photoURL}
              width={30}
              height={30}
              alt="profil"
              className="rounded-full object-cover max-h-[30px]"
            />
          ) : (
            <FaUserCircle className="h-[30px] w-[30px]" />
          )
        ) : (
          <FcGoogle className="h-[30px] w-[30px]" />
        )}
        {userLoading ? (
          <div className="btn_full text-white bg-[#39B5FF]">
            <AiOutlineLoading3Quarters className="animate-spin h-6" />
          </div>
        ) : user ? (
          <button
            onClick={handleLogout}
            disabled={disable}
            className="btn_full text-white bg-[#39B5FF] border-2 border-[#39B5FF] hover:bg-white hover:text-[#39B5FF] transition "
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogout}
            disabled={disable}
            className="btn_full text-white bg-[#39B5FF] border-2 border-[#39B5FF] hover:bg-white hover:text-[#39B5FF] transition "
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};
export default Profile;
