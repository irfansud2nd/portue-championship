"use client";
import { MyContext } from "@/context/Context";
import { getJumlahPeserta } from "@/utils/sharedFunctions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsGoogle } from "react-icons/bs";
import InlineLoading from "./admin/InlineLoading";

const LoginButton = () => {
  const { user, googleSignIn, userLoading } = MyContext();
  const [kuota, setKuota] = useState<number | null>(null);

  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getJumlahPeserta().then((res) => setKuota(res));
  }, []);

  return (
    <>
      {/* HOLD PENDAFTARAN */}
      {userLoading ? (
        <div className="w-full rounded-full font-semibold text-lg btn_navy_gold flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin h-7" />
        </div>
      ) : user ? (
        // !kuota ? (
        //   <div className="w-full rounded-full font-semibold text-lg btn_navy_gold text-center">
        //     <InlineLoading />
        //   </div>
        // )
        // : kuota < Number(process.env.NEXT_PUBLIC_KUOTA_MAKSIMUM) ?
        <Link
          href="/halaman-pendaftaran"
          className="w-full rounded-full font-semibold text-lg btn_navy_gold text-center"
        >
          {/* Halaman Pendaftaran */}
          Lihat Peserta Terdaftar
        </Link>
      ) : (
        // : (
        //   <p className="w-full rounded-full font-semibold text-lg btn_navy_gold text-center">
        //     Kuota Pendaftaran Sudah Habis
        //   </p>
        // )
        <button
          className="w-full rounded-full font-semibold text-lg btn_navy_gold"
          onClick={handleLogin}
        >
          <BsGoogle className="inline mb-1" /> Login Dengan Google
        </button>
      )}
      {/* HOLD PENDAFTARAN */}
      {/* <div className="w-full rounded-full font-semibold text-lg btn_navy_gold flex justify-center px-2 text-center">
        Website sedang <br className="min-[375px]:hidden" />
        dalam perbaikan
      </div> */}
    </>
  );
};
export default LoginButton;
