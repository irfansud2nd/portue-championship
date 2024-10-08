import { AdminContext } from "@/context/AdminContext";
import { findNamaKontingen, formatTanggal } from "@/utils/adminFunctions";
import { OfficialState } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import InlineLoading from "../InlineLoading";
import "react-toastify/dist/ReactToastify.css";
import { compare } from "@/utils/functions";
import { deleteOfficial } from "@/utils/official/officialFunctions";

const TabelOfficialAdmin = () => {
  const {
    officials,
    kontingens,
    officialsLoading,
    selectedKontingen,
    selectedOfficials,
    deleteOfficial: deleteOfficialContext,
    fetchOfficials,
  } = AdminContext();

  const tabelHead = [
    "No",
    "ID Official",
    "Nama Lengkap",
    "Nama Kontingen",
    "Jenis Kelamin",
    "Jabatan",
    "Pas Foto",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
    "Delete",
  ];

  const [officialsToMap, setOfficialsToMap] = useState<OfficialState[]>([]);
  const [showRodal, setShowRodal] = useState(false);
  const [deleteRodal, setDeleteRodal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<OfficialState | undefined>(
    undefined
  );
  const [fotoUrl, setFotoUrl] = useState("");

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: `Tabel Official${selectedKontingen?.namaKontingen ?? ""}`,
    sheet: "Data Official",
  });

  useEffect(() => {
    if (selectedOfficials.length) {
      setOfficialsToMap(selectedOfficials);
    } else {
      setOfficialsToMap(officials);
    }
  }, [selectedOfficials]);

  const toastId = useRef(null);

  const handleDelete = (data: OfficialState) => {
    setDeleteRodal(true);
    setDataToDelete(data);
  };

  const deleteData = async () => {
    setDeleteRodal(false);
    if (!dataToDelete) return;
    try {
      await deleteOfficial(dataToDelete, undefined, toastId);
      cancelDelete();
      deleteOfficialContext(dataToDelete.id);
    } catch (error) {
      throw error;
    }
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setDeleteRodal(false);
    setDataToDelete(undefined);
  };

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Official
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen && (
          <button className="btn_green btn_full" onClick={fetchOfficials}>
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

      {/* DELETE RODAL */}
      <Rodal visible={deleteRodal} onClose={() => setDeleteRodal(false)}>
        <div className="h-full w-full">
          <div className="h-full w-full flex flex-col justify-between">
            <h1 className="font-semibold text-red-500">Hapus Official</h1>
            <p>Apakah anda yakin akan menghapus Official ini?</p>
            <div className="self-end flex gap-2">
              <button
                className="btn_red btn_full"
                onClick={deleteData}
                type="button"
              >
                Yakin
              </button>
              <button
                className="btn_green btn_full"
                onClick={cancelDelete}
                type="button"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </Rodal>
      {/* DELETE RODAL */}

      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {officialsToMap
            .sort(compare("namaLengkap", "asc"))
            .map((official: OfficialState, i: number) => (
              <tr key={official.id} className="border_td">
                <td>{i + 1}</td>
                <td>{official.id}</td>
                <td>{official.namaLengkap.toUpperCase()}</td>
                <td className="capitalize">
                  {findNamaKontingen(
                    kontingens,
                    official.idKontingen
                  ).toUpperCase()}
                </td>
                <td>{official.jenisKelamin}</td>
                <td>{official.jabatan}</td>
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
                <td>
                  <button
                    className="btn_red btn_full"
                    onClick={() => handleDelete(official)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelOfficialAdmin;
