"use client";
import InlineLoading from "@/components/admin/InlineLoading";
import { dataKontingenInitialValue } from "@/utils/constants";
import { firestore } from "@/utils/firebase";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import Image from "next/image";
import { AdminContext } from "@/context/AdminContext";
import { MyContext } from "@/context/Context";

const KonfirmasiPembayaranPage = ({ params }: { params: { id: string } }) => {
  const {
    user,
    checkAdminAuthorized,
    adminAuthorized,
    userLoading,
    adminLoading,
  } = MyContext();

  const idPembayaran = params.id;

  const [kontingen, setKontingen] = useState<DataKontingenState>(
    dataKontingenInitialValue
  );
  const [pesertas, setPesertas] = useState<DataPesertaState[]>([]);
  const [pesertasToConfirm, setPesertasToConfirm] = useState<string[]>([]);
  const [pesertasToUnpaid, setPesertasToUnpaid] = useState<string[]>([]);

  const getKontingen = () => {
    getDocs(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "array-contains", idPembayaran)
      )
    ).then((res) =>
      res.forEach((doc) => setKontingen(doc.data() as DataKontingenState))
    );
  };
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
    getKontingen();
    getPesertas();
  }, []);

  const handleCheck = (idPeserta: string, konfirmasi: boolean) => {
    if (konfirmasi && pesertasToConfirm.indexOf(idPeserta) < 0) {
      setPesertasToConfirm((prev) => [...prev, idPeserta]);
    } else {
      const arr = [...pesertasToConfirm];
      arr.splice(arr.indexOf(idPeserta), 1);
      setPesertasToConfirm(arr);
    }
  };

  const getPesertasToUnpaid = () => {
    let arr: string[] = [];
    pesertas.map((peserta) => {
      if (pesertasToConfirm.indexOf(peserta.id) < 0) {
        arr.push(peserta.id);
      }
    });
    setPesertasToUnpaid(arr);
  };

  useEffect(() => {
    console.log("to confirm", pesertasToConfirm);
    getPesertasToUnpaid();
  }, [pesertasToConfirm]);

  useEffect(() => {
    console.log("to unpaid", pesertasToUnpaid);
  }, [pesertasToUnpaid]);

  useEffect(() => {
    if (user) checkAdminAuthorized(user);
  }, [user]);

  const getNominal = () => {
    if (kontingen.idKontingen && idPembayaran) {
      const nominal = pesertasToConfirm.length * 300;
      return `Rp. ${nominal.toLocaleString("id")}.${kontingen.infoPembayaran[
        kontingen.idPembayaran.indexOf(idPembayaran)
      ].noHp
        .split("")
        .splice(-3, 3)
        .join("")}`;
    } else {
      return <InlineLoading />;
    }
  };

  const handleKonfirmasi = () => {
    deletePembayaranPeserta(pesertasToUnpaid.length - 1);
  };

  const deletePembayaranPeserta = (index: number) => {
    if (index < 0) {
      konfirmasiPembayaranPeserta(
        pesertasToConfirm.length - 1,
        Date.now().toString()
      );
    } else {
      updateDoc(doc(firestore, "pesertas", pesertasToUnpaid[index]), {
        pembayaran: false,
        idPembayaran: "",
        infoPembayaran: {
          noHp: "",
          waktu: "",
          buktiUrl: "",
        },
      })
        .then(() => deletePembayaranPeserta(index - 1))
        .catch((error) => alert(error));
    }
  };

  const konfirmasiPembayaranPeserta = (index: number, time: string) => {
    if (index < 0) {
      konfirmasiPembayaranKontingen(time);
    } else {
      updateDoc(doc(firestore, "pesertas", pesertasToConfirm[index]), {
        infoKonfirmasi: {
          nama: user.displayName,
          email: user.email,
          waktu: time,
        },
        confirmedPembayaran: true,
      })
        .then(() => konfirmasiPembayaranPeserta(index - 1, time))
        .catch((error) => alert(error));
    }
  };

  const konfirmasiPembayaranKontingen = (time: string) => {
    const infoPembayaran =
      kontingen.infoPembayaran[
        kontingen.infoPembayaran.findIndex(
          (item) => item.idPembayaran == idPembayaran
        )
      ];
    updateDoc(doc(firestore, "kontingens", kontingen.idKontingen), {
      unconfirmedPembayaran: arrayRemove(idPembayaran),
      confirmedPembayaran: arrayUnion(idPembayaran),
      infoKonfirmasi: arrayUnion({
        idPembayaran: idPembayaran,
        nama: user.displayName,
        email: user.email,
        waktu: time,
      }),
      infoPembayaran: arrayRemove({
        idPembayaran: idPembayaran,
        nominal: infoPembayaran.nominal,
        noHp: infoPembayaran.noHp,
        waktu: infoPembayaran.waktu,
        buktiUrl: infoPembayaran.buktiUrl,
      }),
    }).then(() => {
      updateDoc(doc(firestore, "kontingens", kontingen.idKontingen), {
        infoPembayaran: arrayUnion({
          idPembayaran: idPembayaran,
          nominal: nominal,
          noHp: infoPembayaran.noHp,
          waktu: infoPembayaran.waktu,
          buktiUrl: infoPembayaran.buktiUrl,
        }),
      }).then(() => {
        // DONE
      });
    });
  };

  if (!kontingen.idKontingen || userLoading || adminLoading) {
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
        {kontingen.idKontingen ? (
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
        {kontingen.idKontingen ? (
          <b>{kontingen.creatorEmail}</b>
        ) : (
          <InlineLoading />
        )}
      </p>
      {/* <button
        className="btn_red btn_full text-white mb-1"
        onClick={() => setPesertasToConfirm([])}
      >
        Reset
      </button> */}
      <div className="flex gap-2 flex-wrap">
        <div className="w-[300px] h-[400px] relative">
          {kontingen.idKontingen ? (
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
          ) : (
            <InlineLoading />
          )}
        </div>
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
                  {pesertasToConfirm.indexOf(peserta.id) < 0 ? (
                    <button
                      onClick={() => handleCheck(peserta.id, true)}
                      className="text-red-500"
                    >
                      <ImCheckboxUnchecked />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheck(peserta.id, false)}
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
