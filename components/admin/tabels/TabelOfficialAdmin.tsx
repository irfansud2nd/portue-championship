import { AdminContext } from "@/context/AdminContext";
import { findNamaKontingen, formatTanggal } from "@/utils/adminFunctions";
import { DataOfficialState } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import InlineLoading from "../InlineLoading";

const TabelOfficialAdmin = () => {
  const {
    officials,
    kontingens,
    refreshOfficials,
    officialsLoading,
    selectedKontingen,
    selectedOfficials,
  } = AdminContext();

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

  const [officialsToMap, setOfficialsToMap] = useState<DataOfficialState[]>([]);
  const [showRodal, setShowRodal] = useState(false);
  const [fotoUrl, setFotoUrl] = useState("");

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: `Tabel Official${
      selectedKontingen.id ? selectedKontingen.namaKontingen : null
    }`,
    sheet: "Data Official",
  });

  useEffect(() => {
    if (selectedOfficials.length) {
      setOfficialsToMap(selectedOfficials);
    } else {
      setOfficialsToMap(officials);
    }
  }, [selectedOfficials]);

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Official
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen.id && (
          <button className="btn_green btn_full" onClick={refreshOfficials}>
            Refresh
          </button>
        )}
        {officialsLoading && <InlineLoading />}
        <button className="btn_green btn_full" onClick={onDownload}>
          Download
        </button>
      </div>
      {/* BUTTONS */}

      {/* RODAL */}
      <Rodal
        visible={showRodal}
        onClose={() => {
          setFotoUrl("");
          setShowRodal(false);
        }}
        customStyles={{ width: "fit-content", height: "fit-content" }}
      >
        <div className="flex justify-center mb-2">
          <Link
            href={fotoUrl}
            target="_blank"
            className="btn_green btn_full btn_full"
          >
            Open in new tab
          </Link>
        </div>
        <div className="w-[400px] h-[300px] relative">
          <Image src={fotoUrl} alt="kk" fill className="object-contain" />
        </div>
      </Rodal>
      {/* RODAL */}

      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {officialsToMap.map((official: DataOfficialState, i: number) => (
            <tr key={official.id} className="border_td">
              <td>{i + 1}</td>
              <td>{official.id}</td>
              <td>{official.namaLengkap}</td>
              <td>{official.jenisKelamin}</td>
              <td>{official.jabatan}</td>
              <td className="capitalize">
                {findNamaKontingen(kontingens, official.idKontingen)}
              </td>
              <td>
                {official.downloadFotoUrl ? (
                  <button
                    className="hover:text-green-500 hover:underline transition"
                    onClick={() => {
                      setShowRodal(true);
                      setFotoUrl(official.downloadFotoUrl);
                    }}
                  >
                    Show
                  </button>
                ) : (
                  "-"
                )}
              </td>
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
