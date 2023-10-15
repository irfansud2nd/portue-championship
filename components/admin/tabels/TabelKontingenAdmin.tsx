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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { compare, newToast, updateToast } from "@/utils/sharedFunctions";

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
    "Verifikasi",
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

  const toastId = useRef(null);

  const toastSuccess = (msg: string) => {
    updateToast(toastId, "success", msg);
  };
  const toastError = (msg: string) => {
    updateToast(toastId, "error", msg);
  };
  const toastLoading = (msg: string) => {
    updateToast(toastId, "loading", msg);
  };
  const toastBaru = (msg: string) => {
    newToast(toastId, "loading", msg);
  };

  const isVerified = (idKontingen: string) => {
    const pesertaToCheck = getPesertasByKontingen(idKontingen, pesertas);
    let checked = false;
    let result = false;
    pesertaToCheck.map((peserta: any) => {
      if (peserta.suratKesehatan) {
        result = true;
      } else {
        result = false;
      }
    });
    return result;
  };

  const getVerified = () => {
    let pesertaVerified: any = [];
    let unVerifyKontingen: any = [];
    let verifiedKontingen: any = [];

    pesertas.map((peserta: any) => {
      if (peserta.keteranganSehat == true) {
        pesertaVerified.push(peserta);
        if (!verifiedKontingen.includes(peserta.idKontingen)) {
          verifiedKontingen.push(peserta.idKontingen);
        }
      } else {
        if (!unVerifyKontingen.includes(peserta.idKontingen)) {
          unVerifyKontingen.push(peserta.idKontingen);
        }
      }
    });

    return { pesertaVerified, unVerifyKontingen, verifiedKontingen };
  };

  return (
    <div>
      <ToastContainer />
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
          {kontingensToMap
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen: DataKontingenState, i: number) => (
              <tr
                key={kontingen.idKontingen}
                className={`border_td ${
                  getPesertasLength(kontingen.idKontingen) == 0 &&
                  "text-red-400"
                }`}
              >
                <td>{i + 1}</td>
                <td>{kontingen.idKontingen}</td>
                <td
                  className="hover:text-green-500 hover:underline transition cursor-pointer uppercase"
                  onClick={() => setSelectedKontingen(kontingen)}
                >
                  {kontingen.namaKontingen}
                </td>
                <td>
                  {getVerified().unVerifyKontingen.includes(
                    kontingen.idKontingen
                  ) ? (
                    getVerified().verifiedKontingen.includes(
                      kontingen.idKontingen
                    ) ? (
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
                                      (info) =>
                                        info.idPembayaran == idPembayaran
                                    )
                                  ]
                                }
                                data={kontingen}
                                infoKonfirmasi={
                                  kontingen.infoKonfirmasi[
                                    kontingen.infoKonfirmasi.findIndex(
                                      (info) =>
                                        info.idPembayaran == idPembayaran
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
                    <span>
                      <DeleteKontingenButton
                        kontingen={kontingen}
                        toastSuccess={toastSuccess}
                        toastError={toastError}
                        toastLoading={toastLoading}
                        toastBaru={toastBaru}
                      />
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
