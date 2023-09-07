import { findNamaKontingen, formatTanggal } from "@/utils/sharedFunctions";
import { DataKontingenState, DataOfficialState } from "@/utils/types";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const TabelOfficialAdmin = ({
  officials,
  kontingens,
}: {
  officials: DataOfficialState[];
  kontingens: DataKontingenState[];
}) => {
  const tabelHead = [
    "No",
    "ID Official",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Jabatan",
    "Nama Kontingen",
    "Pas Foto",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Official",
    sheet: "Data Official",
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mt-1">
        <div className="flex gap-2 mt-1">
          <h1 className="text-xl font-semibold">Tabel Official</h1>
          <button className="btn_green btn_full mb-1" onClick={onDownload}>
            Download Tabel
          </button>
        </div>
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
          {officials.map((official, i) => (
            <tr key={official.id}>
              <td>{i + 1}</td>
              <td>{official.id}</td>
              <td>{official.namaLengkap}</td>
              <td>{official.jenisKelamin}</td>
              <td>{official.jabatan}</td>
              <td>{findNamaKontingen(kontingens, official.idKontingen)}</td>
              <td>{official.downloadFotoUrl ? "show" : "-"}</td>
              <td>{official.creatorEmail}</td>
              <td>{formatTanggal(official.waktuPendaftaran)}</td>
              <td>{formatTanggal(official.waktuPerubahan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelOfficialAdmin;
