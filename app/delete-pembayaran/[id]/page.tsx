"use client";
import InlineLoading from "@/components/admin/InlineLoading";
import { firestore } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { DataPesertaState } from "@/utils/types";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeletePembayaranPage = ({ params }: { params: { id: string } }) => {
  const [pesertas, setPesertas] = useState<DataPesertaState[]>([]);

  const idPembayaran = params.id;

  const getPesertas = () => {
    let result: any[] = [];
    getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", idPembayaran)
      )
    )
      .then((res) => res.forEach((doc) => result.push(doc.data())))
      .finally(() => setPesertas(result));
  };

  useEffect(() => {
    getPesertas();
  }, []);

  const toastId = useRef(null);

  const cancelPayment = () => {
    newToast(toastId, "loading", "Membatalkan Pembayaran");
    deletePaymentPeserta(pesertas.length - 1);
  };

  if (!pesertas.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-4xl">
          Loading <InlineLoading />
        </h1>
      </div>
    );
  }

  const deletePaymentPeserta = (index: number) => {
    if (index < 0) {
      updateToast(toastId, "success", "Pembayaran berhasil dibatalkan");
    } else {
      updateDoc(doc(firestore, "pesertas", pesertas[index].id), {
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

  return (
    <div className="p-2 bg-gray-200 m-2 rounded-md">
      <ToastContainer />
      <h1 className="text-xl font-bold">ID Pembayaran : {idPembayaran}</h1>
      <p>
        Jumlah Peserta: <b>{pesertas.length}</b>
      </p>
      <button className="btn_red btn_full mb-1" onClick={cancelPayment}>
        Delete Pembayaran
      </button>
      <table>
        <thead>
          <tr>
            <th>Nama Peserta</th>
            <th>Tingkatan</th>
            <th>Kategori</th>
            <th>Jenis Kelamin</th>
          </tr>
        </thead>
        <tbody>
          {pesertas.map((peserta) => (
            <tr key={peserta.id}>
              <td className="uppercase">{peserta.namaLengkap}</td>
              <td>{peserta.tingkatanPertandingan}</td>
              <td>{peserta.kategoriPertandingan}</td>
              <td>{peserta.jenisKelamin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DeletePembayaranPage;
