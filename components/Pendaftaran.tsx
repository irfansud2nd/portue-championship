"use client";
import Link from "next/link";
import KategoriPendaftaran from "./KategoriPendaftaran";
import { useState } from "react";
import { AiOutlineRollback } from "react-icons/ai";
import FormPendaftaran from "./FormPendaftaran";

const Pendaftaran = () => {
  const [kategoriPendaftaran, setKategoriPendaftaran] =
    useState<string>("kontingen");
  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] gap-2">
      <div>
        <Link
          href="/"
          className="font-semibold tracking-wide hover:text-custom-navy transition hover:underline"
        >
          <AiOutlineRollback className="inline text-xl mb-1 mr-1" />
          Kembali ke halaman Awal
        </Link>
        <KategoriPendaftaran
          setKategoriPendaftaran={setKategoriPendaftaran}
          kategoriPendaftaran={kategoriPendaftaran}
        />
      </div>
      <FormPendaftaran kategoriPendaftaran={kategoriPendaftaran} />
    </div>
  );
};
export default Pendaftaran;
