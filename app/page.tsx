import LoginButton from "@/components/LoginButton";
import logo_portue from "@/public/images/logo-portue.png";
import Image from "next/image";
import BackgroundLogo from "@/components/BackgroundLogo";
import { Metadata } from "next";
import Head from "next/head";
import DownloadButton from "@/components/DownloadButton";

export const metadata: Metadata = {
  title: "Portue Silat Bandung Championship",
};

export default function Home() {
  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <Head>
        <title>Portue Silat Bandung Championship</title>
      </Head>
      <BackgroundLogo />
      <div className="w-fit flex flex-col items-center gap-3 -translate-y-5">
        <Image src={logo_portue} alt="logo-portue" />
        <LoginButton />
        <DownloadButton />
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
