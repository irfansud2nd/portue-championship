"use client";
import InfoPendaftar from "@/components/InfoPendaftar";
import LoginButton from "@/components/LoginButton";
import Pendaftaran from "@/components/Pendaftaran";
import { MyContext } from "@/context/Context";
import { AiOutlineRollback } from "react-icons/ai";
import { PiWarningBold } from "react-icons/pi";
import mascot_2 from "@/public/images/mascot-2.png";
import Image from "next/image";
import Link from "next/link";

const PendaftaranPage = () => {
  const { user } = MyContext();

  return (
    <>
      {user ? (
        <div className="h-full w-full grid grid-cols-[1fr_auto] gap-2 p-3">
          <div className="bg-gray-200 rounded-md p-2">
            <Pendaftaran />
          </div>
          <div className="bg-gray-200 w-[200px] rounded-md grid grid-rows-[auto_1fr] max-h-[85vh] sticky top-0">
            <Image src={mascot_2} alt="mascot-2" className="h-fit w-full" />
            <div className="p-1">
              <InfoPendaftar />
            </div>
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
      )}
    </>
  );
};
export default PendaftaranPage;
