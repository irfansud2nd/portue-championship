import { AdminContext } from "@/context/AdminContext";
import {
  formatTanggal,
  getKontingenUnpaid,
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useEffect, useRef, useState } from "react";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import InlineLoading from "../InlineLoading";
import KonfirmasiButton from "../KonfirmasiButton";
import DeleteKontingenButton from "./DeleteKontingenButton";

const TabelKontingenAdmin = () => {
  const {
    kontingens,
    setSelectedKontingen,
    selectedKontingen,
    refreshKontingens,
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
    "Peserta",
    "Official",
    "Pembayaran",
    "Belum Lunas",
    "Konfirmasi",
    "Email Pendaftar",
    "Delete",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const [kontingensToMap, setKontingensToMap] = useState<DataKontingenState[]>(
    []
  );

  const getUnpaidPeserta = (kontingen: DataKontingenState) => {
    if (!kontingen.infoPembayaran || !kontingen.pesertas) return 0;
    let paidNominal = 0;
    kontingen.infoPembayaran.map(
      (info) => (paidNominal += Number(info.nominal.replace(/[^0-9]/g, "")))
    );
    return kontingen.pesertas.length - Math.floor(paidNominal / 300000);
  };

  const getPesertasLength = (idKontingen: string) => {
    let length = 0;
    pesertas.map((peserta: DataPesertaState) => {
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
    sheet: `Data Kontingen ${
      selectedKontingen.idKontingen ? selectedKontingen.namaKontingen : null
    }`,
  });

  useEffect(() => {
    if (selectedKontingen.idKontingen) {
      setKontingensToMap([selectedKontingen]);
    } else if (unconfirmedKongtingens.length) {
      setKontingensToMap(unconfirmedKongtingens);
    } else if (confirmedKontingens.length) {
      setKontingensToMap(confirmedKontingens);
    } else {
      setKontingensToMap(kontingens);
    }
  }, [selectedKontingen, unconfirmedKongtingens, confirmedKontingens]);

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Kontingen
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen.idKontingen && (
          <button className="btn_green btn_full" onClick={refreshKontingens}>
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
          {kontingensToMap.map((kontingen: DataKontingenState, i: number) => (
            <tr key={kontingen.idKontingen} className="border_td">
              <td>{i + 1}</td>
              <td>{kontingen.idKontingen}</td>
              <td
                className="hover:text-green-500 hover:underline transition cursor-pointer uppercase"
                onClick={() => setSelectedKontingen(kontingen)}
              >
                {kontingen.namaKontingen}
              </td>
              <td>
                {/* {kontingen.pesertas.length} */}
                {getPesertasLength(kontingen.idKontingen)}
              </td>
              <td>
                {
                  getOfficialsByKontingen(kontingen.idKontingen, officials)
                    .length
                }
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
                                kontingen.infoPembayaran[
                                  kontingen.infoPembayaran.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ]
                              }
                              data={kontingen}
                              infoKonfirmasi={
                                kontingen.infoKonfirmasi[
                                  kontingen.infoKonfirmasi.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ]
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
                  <div>
                    <DeleteKontingenButton kontingen={kontingen} />
                  </div>
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
