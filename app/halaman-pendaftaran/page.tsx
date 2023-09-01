"use client";
import LoginButton from "@/components/LoginButton";
import Pendaftaran from "@/components/Pendaftaran";
import { MyContext } from "@/context/Context";
import { AiOutlineRollback } from "react-icons/ai";
import { PiWarningBold } from "react-icons/pi";
import { useEffect } from "react";
import graphic_portue from "@/public/images/graphic-portue.png";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const PendaftaranPage = () => {
  const { user, userLoading } = MyContext();

  useEffect(() => {
    document.title = "Halaman Pendaftaran - Portue Silat Bandung Championship";
  }, []);

  return (
    <div className="h-full max-w-[100vw]">
      <Head>
        <title>Halaman Pendaftaran - Portue Silat Bandung Championship</title>
      </Head>
      <Rodal visible={true}>
        <div className="w-full h-full flex flex-col justify-between items-center">
          <h1 className="text-xl font-semibold">Informasi</h1>
          <p>Pendaftaran dimulai dari 4 September, 2023</p>
          <Link href="/" className="btn_green btn_full">
            Kembali ke halaman utama
          </Link>
        </div>
      </Rodal>
      {/* {userLoading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Image
            src={graphic_portue}
            alt="graphic-portue"
            className="w-[200px] animate-[spin_5s_linear_infinite]"
          />
        </div>
      ) : user ? (
        <div className="h-full w-full justify-center items-center p-2">
          <div>
            <Pendaftaran />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-center w-fit bg-gray-200 p-2 h-[150px] rounded-md flex flex-col justify-around">
            <h1 className="text-2xl font-bold">
              <PiWarningBold className="mb-0.5 inline text-red-500" />
              <span className="mx-2">Anda belum melakukan Login</span>
              <PiWarningBold className="mb-0.5 inline text-red-500" />
            </h1>
            <div>
              <Link
                href="/"
                className="font-semibold tracking-wide hover:text-custom-navy transition hover:underline"
              >
                <AiOutlineRollback className="inline text-xl mb-1 mr-1" />
                Kembali ke halaman Awal
              </Link>
              <LoginButton />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
export default PendaftaranPage;
