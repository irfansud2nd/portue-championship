import LoginButton from "@/components/LoginButton";
import logo_portue from "@/public/images/logo-portue.png";
import Image from "next/image";
import BackgroundLogo from "@/components/BackgroundLogo";
import Head from "next/head";
import DownloadButton from "@/components/DownloadButton";
import { FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";
import RodalHome from "@/components/rodals/RodalHome";
import { Metadata } from "next";
import RodalPortfolio from "@/components/rodals/RodalPortfolio";

export const metadata: Metadata = {
  title: "Portue Silat Bandung Championship",
};

export default function Home() {
  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <Head>
        <title>Portue Silat Bandung Championship</title>
      </Head>

      {/* <RodalHome /> */}
      <RodalPortfolio />

      <BackgroundLogo />
      <div className="w-fit flex flex-col items-center gap-3 -translate-y-5">
        <Image src={logo_portue} alt="logo-portue" className="max-w-[80vw]" />
        <p className="text-center">
          <FaRegCalendarAlt className="inline mb-1 mr-1" /> 23 - 26 Oktober 2023
          <span className="hidden min-[480px]:inline"> | </span>
          <br className="min-[480px]:hidden" />
          <Link
            href="https://goo.gl/maps/CLbG5HzMxTNuxnoH7"
            target="_blank"
            className="border-b border-b-transparent hover:border-b-black"
          >
            <IoLocationSharp className="inline mb-1 mr-1" />
            Sport Jabar, Arcamanik, Kota Bandung
          </Link>
        </p>
        <LoginButton />
        <Link
          href={"/score"}
          className="w-full rounded-full font-semibold text-lg btn_navy_gold text-center"
        >
          Perolehan Medali dan
          <br className="sm:hidden" /> Update Partai
        </Link>
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
