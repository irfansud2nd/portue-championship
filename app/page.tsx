import LoginButton from "@/components/LoginButton";
import logo_portue from "@/public/images/logo-portue.png";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import Image from "next/image";
import BackgroundLogo from "@/components/BackgroundLogo";

export default function Home() {
  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <BackgroundLogo home />
      <div className="w-fit flex flex-col gap-3 -translate-y-5">
        <Image src={logo_portue} alt="logo-portue" />
        <LoginButton />
        <button className="w-full rounded-full text-lg font-semibold btn_navy_gold">
          <BsFillCloudDownloadFill className="inline mr-2 mb-0.5" />
          Download Proposal
        </button>
        <p className="text-center text-5xl leading-5 font-bold mt-2 font-dancing-script">
          Are you the next
        </p>
        <p className="text-center text-red-500 text-6xl font-extrabold -rotate-2 font-staatliches">
          CHAMPION ?
        </p>
      </div>
    </div>
  );
}
