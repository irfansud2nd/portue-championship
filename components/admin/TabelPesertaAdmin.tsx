import { findNamaKontingen, formatTanggal } from "@/utils/sharedFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import FileSaver from "file-saver";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

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
    "No HP",
    "Email",
    "Kartu Keluarga",
    "Umur",
    "Berat Badan",
    "Tinggi Badan",
    "Alamat Lengkap",
    "Tingkatan",
    "Jenis Pertandingan",
    "Kategori Pertandingan",
    "Nama Kontingen",
    "Pas Foto",
    "Status Pembayaran",
    "Waktu Pembayaran",
    "Konfirmai Pembayaran",
    "Dikonfirmasi oleh",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const tabelRef = useRef(null);

  const [showRodal, setShowRodal] = useState(false);
  const [kkUrl, setKkUrl] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Peserta",
    sheet: "Data Peserta",
  });

  return (
    <div className="w-fit">
      <Rodal
        visible={showRodal}
        onClose={() => {
          setFotoUrl("");
          setKkUrl("");
          setShowRodal(false);
        }}
        customStyles={{ width: "fit-content", height: "fit-content" }}
      >
        {kkUrl && (
          <>
            <div className="flex justify-center mb-2">
              <Link href={kkUrl} target="_blank" className="btn_green btn_full">
                Open in new tab
              </Link>
            </div>
            <div className="w-[500px] h-[500px] relative">
              <Image
                src={kkUrl}
                alt="kk"
                fill
                className="object-contain mx-auto"
              />
            </div>
          </>
        )}
        {fotoUrl && (
          <>
            <div className="flex justify-center mb-2">
              <Link
                href={fotoUrl}
                target="_blank"
                className="btn_green btn_full"
              >
                Open in new tab
              </Link>
            </div>
            <div className="w-[400px] h-[300px] relative">
              <Image src={fotoUrl} alt="kk" fill className="object-contain" />
            </div>
          </>
        )}
      </Rodal>
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
              <td className="capitalize">{peserta.namaLengkap}</td>
              <td>
                <span className="text-transparent">"</span>
                {peserta.NIK.toString()}
                <span className="text-transparent">"</span>
              </td>
              <td>{peserta.jenisKelamin}</td>
              <td>{peserta.tempatLahir}</td>
              <td className="whitespace-nowrap">
                {formatTanggal(peserta.tanggalLahir)}
              </td>
              <td>
                <span className="text-transparent">"</span>
                {peserta.noHp}
                <span className="text-transparent">"</span>
              </td>
              <td>{peserta.email}</td>
              <td>
                <button
                  className="hover:text-custom-gold transition"
                  onClick={() => {
                    setShowRodal(true);
                    setKkUrl(peserta.downloadKkUrl);
                  }}
                >
                  Show KK
                </button>
              </td>
              <td className="whitespace-nowrap">{peserta.umur} tahun</td>
              <td>{peserta.beratBadan} KG</td>
              <td>{peserta.tinggiBadan} CM</td>
              <td>{peserta.alamatLengkap}</td>
              <td>{peserta.tingkatanPertandingan}</td>
              <td>{peserta.jenisPertandingan}</td>
              <td className="whitespace-nowrap">
                {peserta.kategoriPertandingan}
              </td>
              <td>{findNamaKontingen(kontingens, peserta.idKontingen)}</td>
              <td className="whitespace-nowrap">
                <button
                  className="hover:text-custom-gold transition"
                  onClick={() => {
                    setShowRodal(true);
                    setFotoUrl(peserta.downloadFotoUrl);
                  }}
                >
                  Show Foto
                </button>
                <br />
                {/* <span className="hidden">{peserta.downloadFotoUrl}</span> */}
              </td>
              <td>{peserta.pembayaran ? "Dibayar" : "Belum dibayar"}</td>
              <td>{formatTanggal(peserta.infoPembayaran.waktu)}</td>
              <td>{peserta.confirmedPembayaran ? "Yes" : "No"}</td>
              <td>
                {peserta.infoKonfirmasi ? peserta.infoKonfirmasi.email : "-"}
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
