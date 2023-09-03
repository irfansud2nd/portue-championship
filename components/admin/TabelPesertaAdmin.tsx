import { findNamaKontingen, formatTanggal } from "@/utils/sharedFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const TabelPesertaAdmin = ({
  pesertas,
  kontingens,
}: {
  pesertas: DataPesertaState[];
  kontingens: DataKontingenState[];
}) => {
  const tabelHead = [
    "No",
    "Nama Lengkap",
    "NIK",
    "Jenis Kelamin",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Umur",
    "Berat Badan",
    "Tinggi Badan",
    "Alamat Lengkap",
    "Tingkatan",
    "Jenis Pertandingan",
    "Kategori Pertandingan",
    "Nama Kontingen",
    "Pas Foto URL",
    "Status Pembayaran",
    "Waktu Pembayaran",
    "Konfirmai Pembayaran",
    "Dikonfirmasi oleh",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const tabelRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Users table",
    sheet: "Users",
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mt-1">
        <h1 className="text-xl font-semibold">Tabel Peserta</h1>
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
          {pesertas.map((peserta, i) => (
            <tr key={peserta.id}>
              <td>{i + 1}</td>
              <td>{peserta.namaLengkap}</td>
              <td>{peserta.NIK}</td>
              <td>{peserta.jenisKelamin}</td>
              <td>{peserta.tempatLahir}</td>
              <td className="whitespace-nowrap">
                {formatTanggal(peserta.tanggalLahir)}
              </td>
              <td className="whitespace-nowrap">{peserta.umur}</td>
              <td>{peserta.beratBadan} KG</td>
              <td>{peserta.tinggiBadan} CM</td>
              <td>{peserta.alamatLengkap}</td>
              <td>{peserta.tingkatanPertandingan}</td>
              <td>{peserta.jenisPertandingan}</td>
              <td className="whitespace-nowrap">
                {peserta.kategoriPertandingan}
              </td>
              <td>{findNamaKontingen(kontingens, peserta.idKontingen)}</td>
              <td>{peserta.downloadFotoUrl ? "Yes" : "No"}</td>
              <td>
                {peserta.pembayaran.downdloadBuktiUrl
                  ? "Dibayar"
                  : "Belum dibayar"}
              </td>
              <td>{formatTanggal(peserta.pembayaran.waktu)}</td>
              <td>{peserta.konfirmasiPembayaran.status ? "Yes" : "No"}</td>
              <td>
                {peserta.konfirmasiPembayaran.status
                  ? peserta.konfirmasiPembayaran.email
                  : "-"}
              </td>
              <td>{peserta.creatorEmail}</td>
              <td>{formatTanggal(peserta.waktuPendaftaran)}</td>
              <td className="whitespace-nowrap">
                {formatTanggal(peserta.waktuPerubahan)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelPesertaAdmin;
