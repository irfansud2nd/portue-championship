"use client";
import { MyContext } from "@/context/Context";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Profile = () => {
  const { user, logOut, disable, userLoading, googleSignIn } = MyContext();
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      alert(error);
    }
  };
  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="h-full flex items-center">
      <div
        className="flex text-sm sm:text-base gap-1 w-fit bg-white rounded-full p-1"
        onClick={() => (user ? handleLogout() : handleLogin())}
      >
        {userLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-blue-500" />
        ) : user ? (
          user.photoURL ? (
            <div className="h-[20px] w-[20px] sm:w-[30px] sm:h-[30px] relative">
              <Image
                src={user.photoURL}
                alt="profil"
                fill
                className="rounded-full profile_img object-cover"
              />
            </div>
          ) : (
            <FaUserCircle className="h-[20px] w-[20px] sm:w-[30px] sm:h-[30px]" />
          )
        ) : (
          <FcGoogle className="h-[20px] w-[20px] sm:w-[30px] sm:h-[30px]" />
        )}
        {userLoading ? null : user ? (
          <button
            onClick={handleLogout}
            disabled={disable}
            className="btn_full text-white bg-[#39B5FF] border-2 border-[#39B5FF] hover:bg-white hover:text-[#39B5FF] transition hidden sm:block"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogout}
            disabled={disable}
            className="btn_full text-white bg-[#39B5FF] border-2 border-[#39B5FF] hover:bg-white hover:text-[#39B5FF] transition hidden sm:block"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};
export default Profile;
