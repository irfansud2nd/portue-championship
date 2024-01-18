"use client";
import Link from "next/link";
import { useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const RodalPortfolio = () => {
  const [rodalVisible, setRodalVisible] = useState(true);

  return (
    <Rodal
      visible={rodalVisible}
      onClose={() => setRodalVisible(false)}
      customStyles={{ height: "500px" }}
    >
      <div className="w-full h-full flex flex-col justify-between items-center text-justify py-4 overflow-y-auto">
        <h1 className="text-xl font-semibold text-center">Informasi</h1>
        <p>
          Web ini sudah tidak beroperasi sebagai web pendaftaran ataupun
          pengumuman juara. Web event PORTUE Bandung Championship Cabor Pencak
          Silat atau IPSI Kota Bandung akan dipindahkan ke Web IPSI Kota
          Bandung. Pengumuman juara umum atau rekapitulasi perolehan medali
          PORTUE Bandung Championship 2023 Cabor Pencak Silat dapat dilihat di
          link dibawah ini.
        </p>
        <p className="text-center w-full my-2">
          <Link
            href="https://ipsi-bandung.vercel.app/event/portue-23/juaraumum"
            className="btn_green btn_full mx-auto"
          >
            Rekapitulasi Perolehan Medali
          </Link>
        </p>
        <p>
          Web ini sekarang digunakan untuk portfolio pribadi milik pengembang,
          atas perhatian dan pengertiannya, saya ucapkan terimakasih.
        </p>
        <Link
          href="https://sud-dev.vercel.app/"
          className="font-semibold hover:text-green-500 transition-all"
        >
          sud.dev
        </Link>
        <button
          onClick={() => setRodalVisible(false)}
          className="btn_green btn_full"
        >
          OK
        </button>
      </div>
    </Rodal>
  );
};
export default RodalPortfolio;
