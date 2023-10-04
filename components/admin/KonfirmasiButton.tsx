"use client";
import { MyContext } from "@/context/Context";
import { firestore, storage } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";
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
import { useState, useRef } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "@/context/AdminContext";
import { DataKontingenState } from "@/utils/types";
import Link from "next/link";
import { getDownloadURL, ref } from "firebase/storage";
import InlineLoading from "./InlineLoading";

const KonfirmasiButton = ({
  idPembayaran,
  infoPembayaran,
  data,
  paid,
  infoKonfirmasi,
}: {
  idPembayaran: string;
  infoPembayaran: {
    idPembayaran: string;
    nominal: string;
    noHp: string;
    waktu: string;
    buktiUrl: string;
  };
  data: DataKontingenState;
  paid: boolean;
  infoKonfirmasi: {
    idPembayaran: string;
    nama: string;
    email: string;
    waktu: string;
  };
}) => {
  const [rodalVisible, setRodalVisible] = useState(false);
  const [pesertasToConfirm, setPesertasToConfirm] = useState<string[]>([]);

  const { user } = MyContext();
  const { refreshKontingens } = AdminContext();

  const toastId = useRef(null);

  const konfirmasiHandler = () => {
    setRodalVisible(true);
    getPesertasToConfirm();
  };

  const getPesertasToConfirm = () => {
    let container: any[] = [];
    getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", idPembayaran)
      )
    )
      .then((res) =>
        res.forEach((doc) => {
          container.push(doc.data().id);
        })
      )
      .finally(() => {
        setPesertasToConfirm(container);
      });
  };

  const konfirmasi = () => {
    const time = Date.now();
    konfirmasiPeserta(pesertasToConfirm.length - 1, time);
  };

  const konfirmasiPeserta = (index: number, time: number) => {
    newToast(toastId, "loading", "Mengkonfirmasi Pembayaran");
    updateDoc(doc(firestore, "pesertas", pesertasToConfirm[index]), {
      confirmedPembayaran: true,
      infoKonfirmasi: {
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
      pembayaran: arrayRemove(idPembayaran),
    })
      .then(() => {
        updateDoc(doc(firestore, "kontingens", data.idKontingen), {
          unconfirmedPembayaran: arrayRemove(idPembayaran),
          confirmedPembayaran: arrayUnion(idPembayaran),
          infoKonfirmasi: arrayUnion({
            idPembayaran: idPembayaran,
            nama: user.displayName,
            email: user.email,
            waktu: time,
          }),
        })
          .then(() => {
            setRodalVisible(false);
            refreshKontingens();
            updateToast(toastId, "success", "Konfirmasi berhasil");
          })
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  const resetKonfirmasi = () => {
    setRodalVisible(false);
    setPesertasToConfirm([]);
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
        <div>
          Jumlah Peserta:{" "}
          {/* <button className="mr-1 btn_green rounded-full px-1.5">+</button> */}
          {pesertasToConfirm.length}
          {/* <button className="ml-1 btn_red rounded-full px-1.5">-</button> */}
        </div>
        <p>Jumlah Nominal: {infoPembayaran.nominal}</p>
        <div className="flex justify-center">
          <Link
            href={infoPembayaran.buktiUrl}
            target="_blank"
            className="btn_green btn_full"
          >
            Open Image in New Tab
          </Link>
        </div>
        <div className="w-[300px] h-[400px] mt-1 border-2 border-custom-navy relative mx-auto flex justify-center items-center">
          {infoPembayaran.buktiUrl ? (
            <Image
              src={infoPembayaran.buktiUrl}
              alt="bukti pembayaran"
              fill
              className="object-contain"
            />
          ) : null}
        </div>
        <div className="flex w-full justify-center gap-2 mt-1">
          {pesertasToConfirm.length && !paid && (
            <>
              {/* <Link
                href={`/konfirmasi-pembayaran/${idPembayaran}`}
                className="btn_green btn_full"
              >
                Konfirmasi Sebagian
              </Link> */}
              <button className="btn_green btn_full" onClick={konfirmasi}>
                Konfirmasi Semua
              </button>
            </>
          )}
          <button className="btn_red btn_full" onClick={resetKonfirmasi}>
            {paid ? "Close" : "Batal"}
          </button>
        </div>
      </Rodal>
      <div className="border-b w-fit hover:border-b-custom-gold hover:text-custom-gold transition">
        <button
          onClick={konfirmasiHandler}
          className="hover:text-green-500 hover:underline transition"
        >
          {paid ? `Confirmed by ${infoKonfirmasi.email}` : "Konfirmasi"}
        </button>
      </div>
    </>
  );
};
export default KonfirmasiButton;
