"use client";
import LoginButton from "@/components/LoginButton";
import logo_portue from "@/public/images/logo-portue.png";
import Image from "next/image";
import BackgroundLogo from "@/components/BackgroundLogo";
import { Metadata } from "next";
import Head from "next/head";
import DownloadButton from "@/components/DownloadButton";
import { FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

export default function Home() {
  const [rodalVisible, setRodalVisible] = useState(true);
  useEffect(() => {
    document.title = "Portue Silat Bandung Championship";
  }, []);
  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <Head>
        <title>Portue Silat Bandung Championship</title>
      </Head>
      <Rodal
        visible={rodalVisible}
        onClose={() => setRodalVisible(false)}
        customStyles={{ height: "500px" }}
      >
        <div className="w-full h-full flex flex-col justify-between items-center text-justify py-4 overflow-y-auto">
          <h1 className="text-xl font-semibold text-center">
            Info PORTUE Bandung Championship 2023 Cabor Pencak Silat.
          </h1>
          <p>
            Sesuai dengan hasil rapat PB PORTUE Bandung Championship 2023, Pada
            tanggal 18 September 2023 bertempat di Sekertariat PB PORTUE.
            Terkait dengan Pembagian Venue Laga Tangkas dengan CABOR lainnya.
            Maka dengan ini kami sampaikan bahwa jadwal CABOR Pencak Silat yang
            semula dilaksanakan tanggal <strong>25-29 Oktober 2023</strong>,
            dimajukan menjadi tanggal <strong>23-26 Oktober 2023</strong>.
            <br />
            Untuk itu kami sampaikan permohonan maaf dan atas perhatiannya kami
            ucapkan terima kasih.
          </p>
          <p className="font-semibold">-Panpel-</p>
          <button
            onClick={() => setRodalVisible(false)}
            className="btn_green btn_full"
          >
            OK
          </button>
        </div>
      </Rodal>
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
