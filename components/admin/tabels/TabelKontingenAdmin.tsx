import { AdminContext } from "@/context/AdminContext";
import {
  formatTanggal,
  getKontingenUnpaid,
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useEffect, useRef, useState } from "react";
import { KontingenState, PesertaState } from "@/utils/types";
import InlineLoading from "../InlineLoading";
import KonfirmasiButton from "../KonfirmasiButton";
import DeleteKontingenButton from "./DeleteKontingenButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { compare } from "@/utils/functions";

const TabelKontingenAdmin = () => {
  const {
    kontingens,
    fetchKontingens,
    setSelectedKontingen,
    selectedKontingen,
    kontingensLoading,
    pesertas,
    officials,
    unconfirmedKongtingens,
    confirmedKontingens,
  } = AdminContext();

  const tabelHead = [
    "No",
    "ID Kontingen",
    "Nama Kontingen",
    "Verifikasi",
    "Peserta",
    "Peserta SD",
    "Peserta SMP",
    "Peserta SMA",
    "Peserta Dewasa",
    "Official",
    "Pembayaran",
    "Belum Lunas",
    "Konfirmasi",
    "Email Pendaftar",
    "Delete",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const [kontingensToMap, setKontingensToMap] = useState<KontingenState[]>([]);

  const getPesertasLength = (idKontingen: string) => {
    let length = 0;
    pesertas.map((peserta: PesertaState) => {
      if (peserta.idKontingen == idKontingen) {
        length += 1;
      }
    });
    return length;
  };

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Kontingen",
    sheet: `Data Kontingen ${selectedKontingen?.namaKontingen ?? ""}`,
  });

  useEffect(() => {
    if (selectedKontingen) {
      setKontingensToMap([selectedKontingen]);
    } else if (unconfirmedKongtingens.length) {
      setKontingensToMap(unconfirmedKongtingens);
    } else if (confirmedKontingens.length) {
      setKontingensToMap(confirmedKontingens);
    } else {
      setKontingensToMap(kontingens);
    }
  }, [selectedKontingen, unconfirmedKongtingens, confirmedKontingens]);

  const getVerified = () => {
    let pesertaVerified: any = [];
    let unverifiedKontingen: any = [];
    let verifiedKontingen: any = [];

    pesertas.map((peserta: any) => {
      if (peserta.keteranganSehat == true) {
        pesertaVerified.push(peserta);
        if (!verifiedKontingen.includes(peserta.idKontingen)) {
          verifiedKontingen.push(peserta.idKontingen);
        }
      } else {
        if (!unverifiedKontingen.includes(peserta.idKontingen)) {
          unverifiedKontingen.push(peserta.idKontingen);
        }
      }
    });

    return { pesertaVerified, unverifiedKontingen, verifiedKontingen };
  };

  const groupingPeserta = (idKontingen: string) => {
    let sd = 0;
    let smp = 0;
    let sma = 0;
    let dewasa = 0;
    const array = getPesertasByKontingen(idKontingen, pesertas);
    array.map((peserta) => {
      if (peserta.tingkatanPertandingan.includes("SD")) sd += 1;
      if (peserta.tingkatanPertandingan.includes("SMP")) smp += 1;
      if (peserta.tingkatanPertandingan.includes("SMA")) sma += 1;
      if (peserta.tingkatanPertandingan.includes("Dewasa")) dewasa += 1;
    });
    return { sd, smp, sma, dewasa };
  };

  const { unverifiedKontingen, verifiedKontingen } = getVerified();

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Kontingen
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen && (
          <button className="btn_green btn_full" onClick={fetchKontingens}>
            Refresh
          </button>
        )}
        {kontingensLoading && <InlineLoading />}
        <button className="btn_green btn_full" onClick={onDownload}>
          Download
        </button>
      </div>
      {/* BUTTONS */}

      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kontingensToMap
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen: KontingenState, i: number) => (
              <tr
                key={kontingen.id}
                className={`border_td ${
                  getPesertasLength(kontingen.id) == 0 && "text-red-400"
                }`}
              >
                <td>{i + 1}</td>
                <td>{kontingen.id}</td>
                <td
                  className="hover:text-green-500 hover:underline transition cursor-pointer uppercase"
                  onClick={() => setSelectedKontingen(kontingen)}
                >
                  {kontingen.namaKontingen}
                </td>
                <td>
                  {unverifiedKontingen.includes(kontingen.id) ? (
                    verifiedKontingen.includes(kontingen.id) ? (
                      <span className="font-bold text-yellow-500">
                        Not Fully Verified
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">Unverified</span>
                    )
                  ) : (
                    <span className="font-bold text-green-500">
                      Fully Verified
                    </span>
                  )}
                </td>
                <td>{getPesertasLength(kontingen.id)}</td>
                <td>{groupingPeserta(kontingen.id).sd}</td>
                <td>{groupingPeserta(kontingen.id).smp}</td>
                <td>{groupingPeserta(kontingen.id).sma}</td>
                <td>{groupingPeserta(kontingen.id).dewasa}</td>
                <td>
                  {getOfficialsByKontingen(kontingen.id, officials).length}
                </td>
                <td>
                  <ul>
                    {kontingen.idPembayaran
                      ? kontingen.idPembayaran.map((idPembayaran) => (
                          <li
                            key={idPembayaran}
                            className="border-b border-black last:border-none"
                          >
                            <span className="whitespace-nowrap">
                              {formatTanggal(
                                kontingen.infoPembayaran[
                                  kontingen.infoPembayaran.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ].waktu,
                                true
                              )}{" "}
                              |{" "}
                              {
                                kontingen.infoPembayaran[
                                  kontingen.infoPembayaran.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ].nominal
                              }
                            </span>
                            <br />
                            <span className="whitespace-nowrap">
                              {/* {kontingen.confirmedPembayaran.indexOf(
                              idPembayaran
                            ) >= 0 ? (
                              <button className="hover:underline">
                                Confirmed by{" "}
                                {
                                  kontingen.infoKonfirmasi[
                                    kontingen.infoKonfirmasi.findIndex(
                                      (info) =>
                                        info.idPembayaran == idPembayaran
                                    )
                                  ].email
                                }
                              </button>
                            ) : ( */}
                              <KonfirmasiButton
                                idPembayaran={idPembayaran}
                                infoPembayaran={
                                  kontingen.infoPembayaran.find(
                                    (item) => item.idPembayaran == idPembayaran
                                  ) as any
                                }
                                kontingen={kontingen}
                                infoKonfirmasi={
                                  kontingen.infoKonfirmasi.find(
                                    (item) => item.idPembayaran == idPembayaran
                                  ) as any
                                }
                                paid={
                                  kontingen.confirmedPembayaran.indexOf(
                                    idPembayaran
                                  ) >= 0
                                }
                              />
                              {/* )} */}
                            </span>
                          </li>
                        ))
                      : "-"}
                  </ul>
                </td>
                <td className="whitespace-nowrap">
                  {/* {getKontingenUnpaid(kontingen, pesertas) < 0
                  ? "0"
                  : `Rp. ${getKontingenUnpaid(kontingen, pesertas)}`} */}
                  Rp.{" "}
                  {getKontingenUnpaid(kontingen, pesertas).toLocaleString("id")}
                </td>
                <td>
                  {kontingen.unconfirmedPembayaran &&
                  kontingen.unconfirmedPembayaran.length
                    ? "Butuh Konfimasi"
                    : "Selesai Konfirmasi"}
                </td>
                <td>{kontingen.creatorEmail}</td>
                <td>
                  {kontingen.idPembayaran.length > 0 ? null : (
                    <span>
                      <DeleteKontingenButton kontingen={kontingen} />
                    </span>
                  )}
                </td>
                <td>{formatTanggal(kontingen.waktuPendaftaran)}</td>
                <td>{formatTanggal(kontingen.waktuPerubahan)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelKontingenAdmin;
