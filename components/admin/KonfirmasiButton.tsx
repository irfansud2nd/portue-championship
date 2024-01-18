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
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import Link from "next/link";
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
  const { refreshKontingens, pesertas } = AdminContext();

  const toastId = useRef(null);

  const getConfirmedPesertas = () => {
    let length = 0;
    pesertas.map((peserta: DataPesertaState) => {
      if (peserta.idPembayaran == idPembayaran && peserta.confirmedPembayaran) {
        length += 1;
      }
    });
    return length;
  };

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
    newToast(toastId, "loading", "Mengkonfirmasi Pembayaran");
    konfirmasiPeserta(pesertasToConfirm.length - 1, time);
  };

  const konfirmasiPeserta = (index: number, time: number) => {
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

  const cancelPayment = () => {
    newToast(toastId, "loading", "Membatalkan Pembayaran");
    deletePaymentPeserta(pesertasToConfirm.length - 1);
  };

  const deletePaymentPeserta = (index: number) => {
    if (index < 0) {
      deletePaymentKontingen();
    } else {
      updateDoc(doc(firestore, "pesertas", pesertasToConfirm[index]), {
        idPembayaran: "",
        pembayaran: false,
        infoPembayaran: {
          noHp: "",
          waktu: "",
          buktiUrl: "",
        },
      })
        .then(() => deletePaymentPeserta(index - 1))
        .catch((error) => alert(error));
    }
  };

  const deletePaymentKontingen = () => {
    updateDoc(doc(firestore, "kontingens", data.idKontingen), {
      idPembayaran: arrayRemove(idPembayaran),
      unconfirmedPembayaran: arrayRemove(idPembayaran),
      infoPembayaran: arrayRemove({
        idPembayaran: idPembayaran,
        nominal: infoPembayaran.nominal,
        noHp: infoPembayaran.noHp,
        waktu: infoPembayaran.waktu,
        buktiUrl: infoPembayaran.buktiUrl,
      }),
    })
      .then(() =>
        updateToast(toastId, "success", "Pembayaran Berhasil dibatalkan")
      )
      .catch((error) => alert(error));
  };

  const cancelKonfirmasi = () => {
    newToast(toastId, "loading", "Membatalkan Konfirmasi");
    deleteKonfirmasiPeserta(pesertasToConfirm.length - 1);
  };

  const deleteKonfirmasiPeserta = (index: number) => {
    if (index < 0) {
      deleteKonfirmasiKontingen();
    } else {
      updateDoc(doc(firestore, "pesertas", pesertasToConfirm[index]), {
        confirmedPembayaran: false,
        infoKonfirmasi: {
          nama: "",
          email: "",
          waktu: "",
        },
      })
        .then(() => deleteKonfirmasiPeserta(index - 1))
        .catch((error) => alert(error));
    }
  };

  const deleteKonfirmasiKontingen = () => {
    const infoKonfirmasi =
      data.infoKonfirmasi[
        data.infoKonfirmasi.findIndex(
          (item) => item.idPembayaran == idPembayaran
        )
      ];
    updateDoc(doc(firestore, "kontingens", data.idKontingen), {
      confirmedPembayaran: arrayRemove(idPembayaran),
      unconfirmedPembayaran: arrayUnion(idPembayaran),
      infoKonfirmasi: arrayRemove({
        idPembayaran: idPembayaran,
        nama: infoKonfirmasi.nama,
        email: infoKonfirmasi.email,
        waktu: infoKonfirmasi.waktu,
      }),
    })
      .then(() =>
        updateToast(toastId, "success", "Konfirmasi Berhasil dibatalkan")
      )
      .catch((error) => alert(error));
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
          {pesertasToConfirm.length ? (
            pesertasToConfirm.length
          ) : (
            <InlineLoading />
          )}
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
            <img
              src={infoPembayaran.buktiUrl}
              alt="bukti pembayaran"
              // fill
              className="object-contain w-[300px] h-[400px]"
            />
          ) : null}
        </div>
        <div className="flex flex-col w-full justify-center gap-1 mt-1 ">
          {!pesertasToConfirm.length ? (
            <div className="mx-auto">
              <InlineLoading />
            </div>
          ) : (
            // !infoKonfirmasi.idPembayaran ?
            <>
              <Link
                href={`/konfirmasi-pembayaran/${idPembayaran}`}
                target="_blank"
                className="btn_green btn_full text-center"
              >
                Konfirmasi Sebagian
              </Link>
              <button className="btn_green btn_full" onClick={konfirmasi}>
                Konfirmasi Semua
              </button>
              <button className="btn_red btn_full" onClick={cancelPayment}>
                Batalkan Pembayaran
              </button>
              {/* </> */}
              {/* ) : ( */}
              <button className="btn_red btn_full" onClick={cancelKonfirmasi}>
                Batalkan Konfirmasi
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
          {paid
            ? `Confirmed by ${infoKonfirmasi.email} | ${(
                getConfirmedPesertas() * 300000
              ).toLocaleString("id")}`
            : "Konfirmasi"}
        </button>
      </div>
    </>
  );
};
export default KonfirmasiButton;
