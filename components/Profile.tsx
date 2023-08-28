"use client";
import { MyContext } from "@/context/Context";

const Profile = () => {
  const { user, logOut } = MyContext();
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-[160px] w-[160px]">
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
};
export default Profile;
