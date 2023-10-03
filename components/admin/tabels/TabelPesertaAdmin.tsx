import { AdminContext } from "@/context/AdminContext";
import {
  compare,
  findNamaKontingen,
  formatTanggal,
} from "@/utils/sharedFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import FileSaver from "file-saver";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import InlineLoading from "../InlineLoading";
import { triggerAsyncId } from "async_hooks";

const TabelPesertaAdmin = () => {
  const {
    pesertas,
    kontingens,
    refreshPesertas,
    pesertasLoading,
    selectedKontingen,
    selectedKategori,
    selectedPesertas,
  } = AdminContext();

  const tabelHead = [
    "No",
    "Nama Lengkap",
    "NIK",
    "Jenis Kelamin",
    "Tempat Lahir",
    "Tanggal Lahir",
    "No HP",
    "Email",
    "Pas Foto",
    "Kartu Keluarga",
    "KTP",
    "Umur",
    "Berat Badan",
    "Tinggi Badan",
    "Alamat Lengkap",
    "Tingkatan",
    "Jenis Pertandingan",
    "Kategori Pertandingan",
    "Nama Kontingen",
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
  const [pesertaToMap, setPesertaToMap] =
    useState<DataPesertaState[]>(pesertas);
  const [kkUrl, setKkUrl] = useState("");
  const [ktpUrl, setKtpUrl] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: selectedKategori
      ? `Tabel Peserta ${selectedKategori.split(",").join(" - ")}`
      : selectedKontingen
      ? `Tabel Peserta ${selectedKontingen.namaKontingen}`
      : "Tabel Semua Peserta",
    sheet: "Data Peserta",
  });

  useEffect(() => {
    if (selectedPesertas.length) {
      setPesertaToMap(selectedPesertas);
    } else {
      setPesertaToMap(pesertas);
    }
  }, [selectedPesertas]);

  return (
    <div className="w-fit">
      <Rodal
        visible={showRodal}
        onClose={() => {
          setFotoUrl("");
          setKkUrl("");
          setKtpUrl("");
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
        {ktpUrl && (
          <>
            <div className="flex justify-center mb-2">
              <Link
                href={ktpUrl}
                target="_blank"
                className="btn_green btn_full"
              >
                Open in new tab
              </Link>
            </div>
            <div className="w-[400px] h-[300px] relative">
              <Image src={ktpUrl} alt="kk" fill className="object-contain" />
            </div>
          </>
        )}
      </Rodal>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Peserta{" "}
        {selectedKategori ? selectedKategori.split(",").join(" - ") : null}
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen.id && (
          <button className="btn_green btn_full" onClick={refreshPesertas}>
            Refresh
          </button>
        )}
        {pesertasLoading && <InlineLoading />}
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
          {pesertaToMap
            .sort(compare("waktuPendaftaran", "asc"))
            .map((peserta: DataPesertaState, i: number) => (
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
                <td className="whitespace-nowrap">
                  {peserta.downloadFotoUrl ? (
                    <button
                      className="hover:text-custom-gold transition"
                      onClick={() => {
                        setShowRodal(true);
                        setFotoUrl(peserta.downloadFotoUrl);
                      }}
                    >
                      Show Foto
                    </button>
                  ) : (
                    <span className="text-red-500 font-bold">
                      Pas Foto not found
                    </span>
                  )}
                </td>
                <td>
                  {peserta.downloadKkUrl ? (
                    <button
                      className="hover:text-custom-gold transition"
                      onClick={() => {
                        setShowRodal(true);
                        setKkUrl(peserta.downloadKkUrl);
                      }}
                    >
                      Show KK
                    </button>
                  ) : (
                    <span className="text-red-500 font-bold">KK not found</span>
                  )}
                </td>
                <td className="whitespace-nowrap">
                  {peserta.downloadKtpUrl ? (
                    <button
                      className="hover:text-custom-gold transition"
                      onClick={() => {
                        setShowRodal(true);
                        setKtpUrl(peserta.downloadKtpUrl);
                      }}
                    >
                      Show KTP
                    </button>
                  ) : (
                    <span className="text-red-500 font-bold">
                      KTP not found
                    </span>
                  )}
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
                <td className="capitalize">
                  {findNamaKontingen(kontingens, peserta.idKontingen)}
                </td>
                <td>
                  {peserta.pembayaran ? (
                    "Dibayar"
                  ) : (
                    <span className="text-red-500">Belum dibayar</span>
                  )}
                </td>
                <td>{formatTanggal(peserta.infoPembayaran.waktu)}</td>
                <td>{peserta.confirmedPembayaran ? "Yes" : "No"}</td>
                <td>
                  {peserta.infoKonfirmasi ? peserta.infoKonfirmasi.email : "-"}
                </td>
                <td>{peserta.creatorEmail}</td>
                <td>{formatTanggal(peserta.waktuPendaftaran, true)}</td>
                <td className="whitespace-nowrap">
                  {formatTanggal(peserta.waktuPerubahan, true)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelPesertaAdmin;
