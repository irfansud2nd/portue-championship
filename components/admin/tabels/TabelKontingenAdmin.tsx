import { AdminContext } from "@/context/AdminContext";
import {
  formatTanggal,
  getKontingenUnpaid,
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useEffect, useRef, useState } from "react";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import InlineLoading from "../InlineLoading";
import KonfirmasiButton from "../KonfirmasiButton";
import { dataKontingenInitialValue } from "@/utils/constants";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { deleteDoc, doc, loadBundle } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "@/utils/firebase";

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
  const [kontingenToDelete, setKontingenToDelete] =
    useState<DataKontingenState>(dataKontingenInitialValue);
  const [officialsToDelete, setOfficialsToDelete] = useState<
    DataOfficialState[]
  >([]);
  const [pesertasToDelete, setPesertasToDelete] = useState<DataPesertaState[]>(
    []
  );
  const [rodalVisible, setRodalVisible] = useState<boolean>(false);

  const toastId = useRef(null);

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

  const deleteHandler = (kontingen: DataKontingenState) => {
    setRodalVisible(true);
    setKontingenToDelete(kontingen);
    setPesertasToDelete(
      getPesertasByKontingen(kontingen.idKontingen, pesertas)
    );
    setOfficialsToDelete(
      getOfficialsByKontingen(kontingen.idKontingen, officials)
    );
  };

  const cancelDelete = () => {
    setRodalVisible(false);
    setKontingenToDelete(dataKontingenInitialValue);
    setPesertasToDelete([]);
    setOfficialsToDelete([]);
  };

  const deleteData = () => {
    deletePesertas(pesertasToDelete.length - 1);
  };

  const deletePesertas = (index: number) => {
    if (index < 0) {
      deleteOfficials(officialsToDelete.length - 1);
    } else {
      const peserta = pesertasToDelete[index];
      const stepController = (step: number) => {
        newToast(toastId, "loading", `Menghapus peserta ${index + 1}`);
        switch (step) {
          case 1:
            if (peserta.ktpUrl) {
              // DELETE KTP
              updateToast(
                toastId,
                "loading",
                `Menghapus KTP Peserta ${index + 1}`
              );
              deleteObject(ref(storage, peserta.ktpUrl))
                .then(() => stepController(2))
                .catch((error) =>
                  updateToast(
                    toastId,
                    "error",
                    `Gagal Menghapus KTP Peserta ${index + 1}. ${error.code}`
                  )
                );
            } else {
              stepController(2);
            }
            break;
          case 2:
            if (peserta.kkUrl) {
              // DELETE KK
              updateToast(
                toastId,
                "loading",
                `Menghapus KK Peserta ${index + 1}`
              );
              deleteObject(ref(storage, peserta.kkUrl))
                .then(() => stepController(3))
                .catch((error) =>
                  updateToast(
                    toastId,
                    "error",
                    `Gagal Menghapus KK Peserta ${index + 1}. ${error.code}`
                  )
                );
            } else {
              stepController(3);
            }
            break;
          case 3:
            // DELETE FOTO
            updateToast(
              toastId,
              "loading",
              `Menghapus Foto Peserta ${index + 1}`
            );
            deleteObject(ref(storage, peserta.fotoUrl))
              .then(() => stepController(4))
              .catch((error) =>
                updateToast(
                  toastId,
                  "error",
                  `Gagal Menghapus KTP Peserta ${index + 1}. ${error.code}`
                )
              );
            break;
          case 4:
            // DELETE DATA
            updateToast(
              toastId,
              "loading",
              `Menghapus Data Peserta ${index + 1}`
            );
            deleteDoc(doc(firestore, "pesertas", peserta.id))
              .then(() => {
                updateToast(
                  toastId,
                  "success",
                  `Data Peserta ${index + 1} Berhasil dihapus`
                );
                deletePesertas(index - 1);
              })
              .catch((error) =>
                updateToast(
                  toastId,
                  "error",
                  `Gagal Menghapus Data Peserta ${index + 1}. ${error.code}`
                )
              );
            break;
        }
      };
      stepController(1);
    }
  };

  const deleteOfficials = (index: number) => {
    if (index < 0) {
      deleteKontingen();
    } else {
      const official = officialsToDelete[index];
      const stepController = (step: number) => {
        newToast(toastId, "loading", `Menghapus Official ${index + 1}`);
        switch (step) {
          case 1:
            // DELETE FOTO
            updateToast(
              toastId,
              "loading",
              `Menghapus Foto Official ${index + 1}`
            );
            deleteObject(ref(storage, official.fotoUrl))
              .then(() => stepController(2))
              .catch((error) =>
                updateToast(
                  toastId,
                  "error",
                  `Gagal Menghapus KTP Official ${index + 1}. ${error.code}`
                )
              );
            break;
          case 2:
            // DELETE DATA
            updateToast(
              toastId,
              "loading",
              `Menghapus Data Official ${index + 1}`
            );
            deleteDoc(doc(firestore, "officials", official.id))
              .then(() => {
                updateToast(
                  toastId,
                  "success",
                  `Data Official ${index + 1} Berhasil dihapus`
                );
                deleteOfficials(index - 1);
              })
              .catch((error) =>
                updateToast(
                  toastId,
                  "error",
                  `Gagal Menghapus Data Official ${index + 1}. ${error.code}`
                )
              );
            break;
        }
      };
      stepController(1);
    }
  };

  const deleteKontingen = () => {
    newToast(toastId, "loading", "Menghapus Kontingen");
    deleteDoc(doc(firestore, "officials", kontingenToDelete.idKontingen))
      .then(() => {
        updateToast(toastId, "success", `Data Kontingen Berhasil dihapus`);
      })
      .catch((error) =>
        updateToast(
          toastId,
          "error",
          `Gagal Menghapus Data Kontingen. ${error.code}`
        )
      );
  };

  return (
    <div>
      <ToastContainer />
      <Rodal visible={rodalVisible} onClose={cancelDelete}>
        <div className="flex flex-col h-full justify-around items-center">
          <h1 className="font-bold text-lg">Hapus Kontingen</h1>
          <p>
            Nama Kontingen:{" "}
            <b>{kontingenToDelete.namaKontingen.toUpperCase()}</b>
          </p>
          <p>
            Official: <b>{officialsToDelete.length} Orang</b>
          </p>
          <p>
            Peserta: <b>{pesertasToDelete.length} Orang</b>
          </p>
          <div className="flex gap-2">
            <button className="btn_red btn_full" onClick={deleteData}>
              Delete
            </button>
            <button className="btn_green btn_full" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </Rodal>

      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Kontingen
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen.id && (
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
              <td>{kontingen.officials.length}</td>
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
                {kontingen.idPembayaran.length ? null : (
                  <button
                    className="btn_red btn_full text-white"
                    onClick={() => deleteHandler(kontingen)}
                  >
                    Delete
                  </button>
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
