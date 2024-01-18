"use client";
import { useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const RodalHome = () => {
  const [rodalVisible, setRodalVisible] = useState(true);

  return (
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
          tanggal 18 September 2023 bertempat di Sekertariat PB PORTUE. Terkait
          dengan Pembagian Venue Laga Tangkas dengan CABOR lainnya. Maka dengan
          ini kami sampaikan bahwa jadwal CABOR Pencak Silat yang semula
          dilaksanakan tanggal <strong>25-29 Oktober 2023</strong>, dimajukan
          menjadi tanggal <strong>23-26 Oktober 2023</strong>.
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
  );
};
export default RodalHome;
