import { formatTanggal } from "@/utils/sharedFunctions";
import { DataKontingenState } from "@/utils/types";
import TabelAdminActions from "./TabelAdminActions";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const TabelKontingenAdmin = ({
  kontingens,
  setSelectedKontingen,
}: {
  kontingens: DataKontingenState[];
  setSelectedKontingen: React.Dispatch<
    React.SetStateAction<DataKontingenState | null>
  >;
}) => {
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
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const getUnpaidPeserta = (kontingen: DataKontingenState) => {
    if (!kontingen.infoPembayaran || !kontingen.pesertas) return 0;
    let paidNominal = 0;
    kontingen.infoPembayaran.map(
      (info) => (paidNominal += Number(info.nominal.replace(/[^0-9]/g, "")))
    );
    // kontingen.pesertas.length -
    return kontingen.pesertas.length - Math.floor(paidNominal / 300000);
  };

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Kontingen",
    sheet: "Data Kontingen",
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mt-1">
        <h1 className="text-xl font-semibold">Tabel Kontingen</h1>
        <button className="btn_green btn_full mb-1" onClick={onDownload}>
          Download Tabel
        </button>
      </div>
      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kontingens.map((kontingen, i) => (
            <tr key={kontingen.idKontingen}>
              <td>{i + 1}</td>
              <td>{kontingen.idKontingen}</td>
              <td
                className="hover:text-custom-gold cursor-pointer"
                onClick={() => setSelectedKontingen(kontingen)}
              >
                {kontingen.namaKontingen}
              </td>
              <td>{kontingen.pesertas.length}</td>
              <td>{kontingen.officials.length}</td>
              <td>
                <ul>
                  {kontingen.idPembayaran
                    ? kontingen.idPembayaran.map((idPembayaran) => (
                        <li
                          key={idPembayaran}
                          className="border-b border-black last:border-none"
                        >
                          <p className="whitespace-nowrap">
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
                          </p>
                          <p className="whitespace-nowrap">
                            {kontingen.confirmedPembayaran.indexOf(
                              idPembayaran
                            ) >= 0 ? (
                              `Confirmed by ${
                                kontingen.infoKonfirmasi[
                                  kontingen.infoKonfirmasi.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ].email
                              }`
                            ) : (
                              <TabelAdminActions
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
                              />
                            )}
                          </p>
                        </li>
                      ))
                    : "-"}
                </ul>
              </td>
              <td>{getUnpaidPeserta(kontingen)}</td>
              <td>
                {kontingen.unconfirmedPembayaran &&
                kontingen.unconfirmedPembayaran.length
                  ? "Butuh Konfimasi"
                  : "Selesai Konfirmasi"}
              </td>
              <td>{kontingen.creatorEmail}</td>
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
