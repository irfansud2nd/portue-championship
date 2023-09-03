import { MyContext } from "@/context/Context";
import { firestore } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TabelAdminActions = ({
  pembayaran,
  data,
}: {
  pembayaran: {
    noHp: string;
    pesertas: string[];
    nominal: string;
    waktu: string;
    downloadBuktiUrl: string;
    konfirmasi: {
      status: boolean;
      nama: string;
      email: string;
      waktu: string;
    };
  };
  data: DataKontingenState;
}) => {
  const [rodalVisible, setRodalVisible] = useState(false);

  const { user } = MyContext();

  const toastId = useRef(null);

  const konfirmasiHandler = () => {
    setRodalVisible(true);
  };

  const konfirmasiPembayaran = () => {
    newToast(toastId, "loading", "Mengkonfirmasi Pembayaran");
    const time = Date.now();
    konfirmasiPeserta(pembayaran.pesertas.length - 1, time);
  };

  const konfirmasiPeserta = (index: number, time: number) => {
    updateDoc(doc(firestore, "pesertas", pembayaran.pesertas[index]), {
      konfirmasiPembayaran: {
        status: true,
        nama: user.displayName,
        email: user.email,
        waktu: time,
      },
    })
      .then(() =>
        index > 0
          ? konfirmasiPeserta(index - 1, time)
          : konfirmasiKontingen(time)
      )
      .catch((error) => alert(error));
  };

  const konfirmasiKontingen = (time: number) => {
    updateDoc(doc(firestore, "kontingens", data.idKontingen), {
      pembayaran: arrayRemove(pembayaran),
    })
      .then(() => {
        updateDoc(doc(firestore, "kontingens", data.idKontingen), {
          pembayaran: arrayUnion({
            ...pembayaran,
            konfirmasi: {
              status: true,
              nama: user.displayName,
              email: user.email,
              waktu: time,
            },
          }),
        })
          .then(() => updateToast(toastId, "success", "Konfirmasi berhasil"))
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  const resetKonfirmasi = () => {
    setRodalVisible(false);
  };

  return (
    <>
      <ToastContainer />
      <Rodal
        visible={rodalVisible}
        onClose={resetKonfirmasi}
        customStyles={{
          height: "fit-content",
          width: "fit-content",
          maxHeight: "100vh",
          maxWidth: "100vw",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <h1>Konfirmasi Pembayaran</h1>
        <p>Jumlah Peserta: {pembayaran.pesertas.length}</p>
        <p>Jumlah Nominal: {pembayaran.nominal}</p>
        <div className="w-[300px] h-[400px] border-2 border-custom-navy relative">
          {pembayaran.downloadBuktiUrl ? (
            <Image
              src={pembayaran.downloadBuktiUrl}
              alt="bukti pembayaran"
              fill
              className="object-contain"
            />
          ) : null}
        </div>
        <div className="flex w-full justify-center gap-2 mt-1">
          <button className="btn_green btn_full" onClick={konfirmasiPembayaran}>
            Konfirmasi
          </button>
          <button className="btn_red btn_full" onClick={resetKonfirmasi}>
            Batal
          </button>
        </div>
      </Rodal>
      <div className="border-b w-fit hover:border-b-custom-gold hover:text-custom-gold transition">
        <button onClick={konfirmasiHandler}>Konfirmasi</button>
      </div>
    </>
  );
};
export default TabelAdminActions;
