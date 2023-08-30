"use client";
import { MyContext } from "@/context/Context";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Profile = () => {
  const { user, logOut, disable, userLoading } = MyContext();
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="max-w-[160px] w-fit max-h-full -translate-y-1 sm:translate-y-0">
      <div className="flex items-center text-sm sm:text-base gap-2 w-fit bg-white rounded-full p-1 sm:p2">
        {user ? (
          user.photoURL ? (
            <Image
              src={user.photoURL}
              width={30}
              height={30}
              alt="profil"
              className="rounded-full object-cover max-h-[20px] max-w-[20px] sm:max-w-[30px] sm:max-h-[30px]"
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
