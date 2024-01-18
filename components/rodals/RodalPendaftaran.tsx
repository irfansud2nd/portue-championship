"use client";
import { useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const RodalPendaftaran = () => {
  const [rodalVisible, setRodalVisible] = useState(true);

  return (
    <Rodal
      onClose={() => setRodalVisible(false)}
      visible={rodalVisible}
      customStyles={{ height: "650px" }}
    >
      <div className="text-justify">
        <h1 className="font-bold text-lg text-center border-b-2 border-green-500">
          Info PORTUE Bandung Championship 2023 Cabor Pencak Silat
        </h1>
        <p>
          Allhamdulillah Pendaftaran PORTUE Bandung Championship 2023 Cabor
          Pencak Silat telah resmi di tutup.
        </p>
        <p>
          Terimakasih atas antusiasme yang sangat luar biasa dari seluruh
          Perguruan Silat, Sekolah, Club, Manger Tim, Official, Pelatih &
          Peserta PORTUE Bandung Championship Cabor Pencak Silat.
        </p>
        <p>
          Peserta yang terdaftar hanyalah peserta yang sudah menyelesaikan
          pembayaran sebelum:
        </p>
        <p className="text-center">
          <b>Selasa, 10 Oktober 2023 Pukul 17:00 W.I.B</b>
        </p>
        <p>
          Manager/Official/Pelatih, tetap dapat melakukan edit data apabila ada
          data peserta yang masih keliru.
        </p>
        <p>
          Edit data hanya bisa dilakukan apa bila ada kelas pertandingan,
          kategori pertandingan atau jenis kelamin yang salah.
        </p>
        <p>Edit Data dapat dilakukan hingga:</p>
        <p className="text-center">
          <b>Jum'at, 13 Oktober 2023 Pukul 17:00 W.I.B</b>
        </p>
        <p>Atas Perhatianya Terima Kasih</p>
        <p className="text-center">- Panpel -</p>
      </div>
      <div className="flex justify-center">
        <button
          className="btn_green btn_full"
          onClick={() => setRodalVisible(false)}
        >
          OK
        </button>
      </div>
    </Rodal>
  );
};
export default RodalPendaftaran;
