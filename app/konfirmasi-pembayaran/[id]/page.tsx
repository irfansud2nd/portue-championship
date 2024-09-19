"use client";
import InlineLoading from "@/components/admin/InlineLoading";
import { dataKontingenInitialValue } from "@/utils/constants";
import { KontingenState, PesertaState } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import Image from "next/image";
import { MyContext } from "@/context/Context";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { fetchData, toastError } from "@/utils/functions";
import { getKontingenByIdPembayaran } from "@/utils/kontingen/kontingenActions";
import { getPesertasByIdPembayaran } from "@/utils/peserta/pesertaActions";
import {
  confirmPayment,
  getInfoPembayaran,
} from "@/utils/pembayaran/pembayaranFunctions";

const KonfirmasiPembayaranPage = ({ params }: { params: { id: string } }) => {
  const {
    user,
    checkAdminAuthorized,
    adminAuthorized,
    userLoading,
    adminLoading,
  } = MyContext();

  const idPembayaran = params.id;

  const [kontingen, setKontingen] = useState<KontingenState>(
    dataKontingenInitialValue
  );
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [pesertasToConfirm, setPesertasToConfirm] = useState<PesertaState[]>(
    []
  );
  const [pesertasToUnpaid, setPesertasToUnpaid] = useState<PesertaState[]>([]);

  const getData = async () => {
    try {
      // GET KONTINGEN
      const kontingen = await fetchData(() =>
        getKontingenByIdPembayaran(idPembayaran)
      );
      if (!kontingen) throw new Error("Kontingen tidak ditemukan");
      setKontingen(kontingen);

      // GET PESERTAS
      const pesertas = await fetchData(() =>
        getPesertasByIdPembayaran(idPembayaran)
      );
      setPesertas(pesertas);
    } catch (error) {
      toastError(toastId, error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCheck = (peserta: PesertaState, konfirmasi: boolean) => {
    if (
      konfirmasi &&
      !pesertasToConfirm.find((item) => item.id == peserta.id)
    ) {
      setPesertasToConfirm((prev) => [...prev, peserta]);
    } else {
      let arr = pesertasToConfirm.filter((item) => item.id != peserta.id);
      setPesertasToConfirm(arr);
    }
  };

  const getPesertasToUnpaid = () => {
    let arr: PesertaState[] = [];
    pesertas.map((peserta) => {
      if (!pesertasToConfirm.find((item) => item.id == peserta.id)) {
        arr.push(peserta);
      }
    });
    setPesertasToUnpaid(arr);
  };

  useEffect(() => {
    getPesertasToUnpaid();
  }, [pesertasToConfirm]);

  useEffect(() => {
    if (user) checkAdminAuthorized(user);
  }, [user]);

  const toastId = useRef(null);

  const handleKonfirmasi = async () => {
    const infoPembayaran = getInfoPembayaran(kontingen, idPembayaran);
    if (!infoPembayaran) {
      toastError(toastId, "Info pembayaran tidak ditemukan");
      return;
    }
    await confirmPayment(
      infoPembayaran,
      kontingen,
      {
        toConfirm: pesertasToConfirm,
        toUnpaid: pesertasToUnpaid,
      },
      nominal,
      user,
      toastId
    );
  };

  if (!kontingen.id || userLoading || adminLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-4xl">
          Loading <InlineLoading />
        </h1>
      </div>
    );
  }

  if (!adminAuthorized.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-4xl text-red-500">UNAUTHORIZED</h1>
      </div>
    );
  }

  const nominal = `Rp. ${(pesertasToConfirm.length * 300).toLocaleString(
    "id"
  )}.${kontingen.infoPembayaran[
    kontingen.idPembayaran.indexOf(idPembayaran)
  ].noHp
    .split("")
    .splice(-3, 3)
    .join("")}`;

  return (
    <div className="p-2 bg-gray-200 m-2 rounded-md">
      <p className="uppercase font-bold text-2xl">{kontingen.namaKontingen}</p>
      <p>
        Jumlah Peserta yang akan dikonfirmasi: <b>{pesertasToConfirm.length}</b>
      </p>
      <p>
        Nominal yang akan dikonfirmasi: <b>{nominal}</b>
      </p>
      <p>
        No HP Pendaftar:{" "}
        {kontingen.id ? (
          <b>
            {
              kontingen.infoPembayaran[
                kontingen.idPembayaran.indexOf(idPembayaran)
              ].noHp
            }
          </b>
        ) : (
          <InlineLoading />
        )}
      </p>
      <p>
        Email Pendaftar:{" "}
        {kontingen.id ? <b>{kontingen.creatorEmail}</b> : <InlineLoading />}
      </p>
      {/* <button
        className="btn_red btn_full text-white mb-1"
        onClick={() => setPesertasToConfirm([])}
      >
        Reset
      </button> */}
      <div className="flex gap-2 flex-wrap">
        {kontingen.id ? (
          <div className="flex flex-col gap-1">
            <Link
              href={
                kontingen.infoPembayaran[
                  kontingen.infoPembayaran.findIndex(
                    (item) => item.idPembayaran == idPembayaran
                  )
                ].buktiUrl
              }
              target="_blank"
              className="btn_green btn_full text-center"
            >
              Open Image in New Tab
            </Link>
            <div className="w-[300px] h-[400px] relative">
              <Image
                src={
                  kontingen.infoPembayaran[
                    kontingen.infoPembayaran.findIndex(
                      (item) => item.idPembayaran == idPembayaran
                    )
                  ].buktiUrl
                }
                alt="buktiPembayaran"
                fill
                className="rounded-md"
              />
            </div>
          </div>
        ) : (
          <InlineLoading />
        )}
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
                <td className="text-xl text-center pt-1">
                  {!pesertasToConfirm.find((item) => item.id == peserta.id) ? (
                    <button
                      onClick={() => handleCheck(peserta, true)}
                      className="text-red-500"
                    >
                      <ImCheckboxUnchecked />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheck(peserta, false)}
                      className="text-green-500"
                    >
                      <ImCheckboxChecked />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn_green btn_full text-lg font-semibold mt-1"
        onClick={handleKonfirmasi}
      >
        Konfirmasi
      </button>
    </div>
  );
};
export default KonfirmasiPembayaranPage;
