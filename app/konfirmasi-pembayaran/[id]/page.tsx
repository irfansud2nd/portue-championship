"use client";
import { dataKontingenInitialValue } from "@/utils/constants";
import { firestore } from "@/utils/firebase";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const KonfirmasiPembayaranPage = ({ params }: { params: { id: string } }) => {
  const [kontingen, setKontingen] = useState<DataKontingenState>(
    dataKontingenInitialValue
  );
  const [pesertas, setPesertas] = useState<DataPesertaState[]>([]);

  const getKontingen = () => {
    getDocs(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "array-contains", params.id)
      )
    ).then((res) =>
      res.forEach((doc) =>
        console.log(setKontingen(doc.data() as DataKontingenState))
      )
    );
  };
  const getPesertas = () => {
    let result: any[] = [];
    getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", params.id)
      )
    )
      .then((res) => res.forEach((doc) => console.log(result.push(doc.data()))))
      .finally(() => setPesertas(result));
  };

  useEffect(() => {
    getKontingen();
    getPesertas();
  }, []);

  const handleCheck = (idPeserta: string, konfirmasi: boolean) => {
    console.log(idPeserta, konfirmasi);
  };
  return (
    <div className="p-2 bg-gray-200 m-2 rounded-md">
      <p className="uppercase font-bold text-2xl">{kontingen.namaKontingen}</p>
      <table>
        <thead>
          <tr>
            <th>Nama Peserta</th>
            <th>Tingkatan</th>
            <th>Kategori</th>
            <th>Jenis Kelamin</th>
            <th>Konfirmasi</th>
          </tr>
        </thead>
        <tbody>
          {pesertas.map((peserta) => (
            <tr key={peserta.id}>
              <td className="uppercase">{peserta.namaLengkap}</td>
              <td>{peserta.tingkatanPertandingan}</td>
              <td>{peserta.kategoriPertandingan}</td>
              <td>{peserta.jenisKelamin}</td>
              <td>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheck(peserta.id, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default KonfirmasiPembayaranPage;
