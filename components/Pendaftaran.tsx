"use client";
import Link from "next/link";
import KategoriPendaftaran from "./KategoriPendaftaran";
import { useState } from "react";
import { AiOutlineRollback } from "react-icons/ai";
import mascot_2 from "@/public/images/mascot-2.png";
import FormPendaftaran from "./FormPendaftaran";
import Image from "next/image";

const Pendaftaran = () => {
  const [kategoriPendaftaran, setKategoriPendaftaran] =
    useState<string>("kontingen");
  return (
    <div className="w-full h-full lg:grid grid-cols-[auto_1fr] gap-2">
      <div className="hidden lg:block w-[200px] bg-gray-100 rounded-md p-2 sticky top-2 h-fit">
        <div>
          <Link
            href="/"
            className="font-semibold tracking-wide hover:text-custom-navy transition hover:underline"
          >
            <AiOutlineRollback className="inline text-xl mb-1 mr-1" />
            Halaman Awal
          </Link>
          <KategoriPendaftaran
            setKategoriPendaftaran={setKategoriPendaftaran}
            kategoriPendaftaran={kategoriPendaftaran}
          />
        </div>
        <Image src={mascot_2} alt="mascot-2" className="h-fit w-full" />
      </div>
      <FormPendaftaran
        kategoriPendaftaran={kategoriPendaftaran}
        setKategoriPendaftaran={setKategoriPendaftaran}
      />
    </div>
  );
};
export default Pendaftaran;
