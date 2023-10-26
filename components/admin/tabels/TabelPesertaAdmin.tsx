import { AdminContext } from "@/context/AdminContext";
import {
  compare,
  findNamaKontingen,
  formatTanggal,
  newToast,
  updateToast,
} from "@/utils/sharedFunctions";
import { DataPesertaState } from "@/utils/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import InlineLoading from "../InlineLoading";
import { dataPesertaInitialValue, tingkatanKategori } from "@/utils/constants";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "@/utils/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersyaratanButton from "./PersyaratanButton";
import CheckAllPersyaratanButton from "./CheckAllPersyaratanButton";

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
    "Nama Kontingen",
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
    "Status Pembayaran",
    "ID Pembayaran",
    "Waktu Pembayaran",
    "Konfirmai Pembayaran",
    "Dikonfirmasi oleh",
    "Email Pendaftar",
    "Delete",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const tabelRef = useRef(null);

  const [showRodal, setShowRodal] = useState(false);
  const [deleteRodal, setDeleteRodal] = useState(false);
  const [pesertaToDelete, setPesertaToDelete] = useState<DataPesertaState>(
    dataPesertaInitialValue
  );
  const [pesertaToMap, setPesertaToMap] =
    useState<DataPesertaState[]>(pesertas);

  const [kkUrl, setKkUrl] = useState("");
  const [ktpUrl, setKtpUrl] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [keteranganSehats, setKeteranganSehats] = useState<string[]>([]);
  const [rekomendasis, setRekomendasis] = useState<string[]>([]);
  const [rapots, setRapots] = useState<string[]>([]);
  const [kartuKeluargas, setKartuKeluargas] = useState<string[]>([]);

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
      let arr = [...selectedPesertas];
      arr = arr.sort(compare("umur", "asc"));
      setPesertaToMap(arr);
    } else {
      setPesertaToMap(pesertas);
    }
  }, [selectedPesertas]);

  const toastId = useRef(null);

  const deleteHandler = (peserta: DataPesertaState) => {
    setPesertaToDelete(peserta);
    setDeleteRodal(true);
  };

  const deletePeserta = () => {
    setDeleteRodal(false);
    newToast(toastId, "loading", `Menghapus ${pesertaToDelete.namaLengkap}`);
    const stepController = (step: number) => {
      switch (step) {
        case 1:
          if (pesertaToDelete.ktpUrl) {
            // DELETE KTP
            updateToast(
              toastId,
              "loading",
              `Menghapus KTP ${pesertaToDelete.namaLengkap}`
            );
            deleteObject(ref(storage, pesertaToDelete.ktpUrl))
              .then(() => stepController(2))
              .catch((error) =>
                updateToast(
                  toastId,
                  "error",
                  `Gagal Menghapus KTP ${pesertaToDelete.namaLengkap}. ${error.code}`
                )
              );
          } else {
            stepController(2);
          }
          break;
        case 2:
          if (pesertaToDelete.kkUrl) {
            // DELETE KK
            updateToast(
              toastId,
              "loading",
              `Menghapus KK ${pesertaToDelete.namaLengkap}`
            );
            deleteObject(ref(storage, pesertaToDelete.kkUrl))
              .then(() => stepController(3))
              .catch((error) =>
                updateToast(
                  toastId,
                  "error",
                  `Gagal Menghapus KK ${pesertaToDelete.namaLengkap}. ${error.code}`
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
            `Menghapus Foto ${pesertaToDelete.namaLengkap}`
          );
          deleteObject(ref(storage, pesertaToDelete.fotoUrl))
            .then(() => stepController(4))
            .catch((error) =>
              updateToast(
                toastId,
                "error",
                `Gagal Menghapus KTP ${pesertaToDelete.namaLengkap}. ${error.code}`
              )
            );
          break;
        case 4:
          // DELETE DATA
          updateToast(
            toastId,
            "loading",
            `Menghapus Data ${pesertaToDelete.namaLengkap}`
          );
          deleteDoc(doc(firestore, "pesertas", pesertaToDelete.id))
            .then(() => {
              updateToast(
                toastId,
                "success",
                `Data ${pesertaToDelete.namaLengkap} Berhasil dihapus`
              );
            })
            .catch((error) =>
              updateToast(
                toastId,
                "error",
                `Gagal Menghapus Data ${pesertaToDelete.namaLengkap}. ${error.code}`
              )
            );
          break;
      }
    };
    stepController(1);
  };

  const cancelDelete = () => {
    setPesertaToDelete(dataPesertaInitialValue);
    setDeleteRodal(false);
  };

  const checkKeteranganSehat = (add: boolean, id: string) => {
    if (add) {
      setKeteranganSehats((prev) => [...prev, id]);
    } else {
      let arr = [...keteranganSehats];
      arr.splice(arr.indexOf(id), 1);
      setKeteranganSehats(arr);
    }
  };
  const checkRekomendasi = (add: boolean, id: string) => {
    if (add) {
      setRekomendasis((prev) => [...prev, id]);
    } else {
      let arr = [...rekomendasis];
      arr.splice(arr.indexOf(id), 1);
      setRekomendasis(arr);
    }
  };
  const checkRapot = (add: boolean, id: string) => {
    if (add) {
      setRapots((prev) => [...prev, id]);
    } else {
      let arr = [...rapots];
      arr.splice(arr.indexOf(id), 1);
      setRapots(arr);
    }
  };
  const checkKartuKeluarga = (add: boolean, id: string) => {
    if (add) {
      setKartuKeluargas((prev) => [...prev, id]);
    } else {
      let arr = [...kartuKeluargas];
      arr.splice(arr.indexOf(id), 1);
      setKartuKeluargas(arr);
    }
  };

  const checkAllPersyaratan = (add: boolean, tipe: string, ids: string[]) => {
    if (add) {
      switch (tipe) {
        case "keteranganSehat":
          const arr1 = Array.from(new Set(keteranganSehats.concat(ids)));
          setKeteranganSehats(arr1);
          break;
        case "rekomendasi":
          const arr2 = Array.from(new Set(rekomendasis.concat(ids)));
          setRekomendasis(arr2);
          break;
        case "rapot":
          const arr3 = Array.from(new Set(rapots.concat(ids)));
          setRapots(arr3);
          break;
        case "kartuKeluarga":
          const arr4 = Array.from(new Set(kartuKeluargas.concat(ids)));
          setKartuKeluargas(arr4);
          break;
      }
    } else {
      switch (tipe) {
        case "keteranganSehat":
          let arr1 = [...keteranganSehats];
          const result1 = arr1.filter((item) => !ids.includes(item));
          setKeteranganSehats(result1);
          break;
        case "rekomendasi":
          let arr2 = [...rekomendasis];
          const result2 = arr2.filter((item) => !ids.includes(item));
          setRekomendasis(result2);
          break;
        case "rapot":
          let arr3 = [...rapots];
          const result3 = arr3.filter((item) => !ids.includes(item));
          setRapots(result3);
          break;
        case "kartuKeluarga":
          let arr4 = [...kartuKeluargas];
          const result4 = arr4.filter((item) => !ids.includes(item));
          setKartuKeluargas(result4);
          break;
      }
    }
  };

  useEffect(() => {
    fetchPersyaratan();
  }, [selectedPesertas]);

  const fetchPersyaratan = () => {
    if (selectedPesertas.length) {
      let keteranganSehat: string[] = [];
      let rekomendasi: string[] = [];
      let rapot: string[] = [];
      let kartuKeluarga: string[] = [];
      selectedPesertas.map((peserta: any) => {
        if (peserta.keteranganSehat) {
          keteranganSehat.push(peserta.id);
        }
        if (peserta.rekomendasi) {
          rekomendasi.push(peserta.id);
        }
        if (peserta.rapot) {
          rapot.push(peserta.id);
        }
        if (peserta.kartuKeluarga) {
          kartuKeluarga.push(peserta.id);
        }
      });
      setKeteranganSehats(keteranganSehat);
      setRekomendasis(rekomendasi);
      setRapots(rapot);
      setKartuKeluargas(kartuKeluarga);
    }
  };

  const savePersyaratan = (tipe: "sdsmp" | "smadewasa") => {
    let pesertaToUpdate: string[] = [];
    pesertaToMap.map((peserta) => {
      if (
        (peserta.tingkatanPertandingan.includes("SD") ||
          peserta.tingkatanPertandingan.includes("SMP")) &&
        tipe == "sdsmp"
      ) {
        pesertaToUpdate.push(peserta.id);
      }
      if (
        (peserta.tingkatanPertandingan.includes("SMA") ||
          peserta.tingkatanPertandingan.includes("Dewasa")) &&
        tipe == "smadewasa"
      ) {
        pesertaToUpdate.push(peserta.id);
      }
    });
    newToast(toastId, "loading", "Menyimpan Persyaratan");
    const repeater = (index: number) => {
      if (index < 0) {
        updateToast(toastId, "success", "Persyaratan berhasil disimpan");
      } else {
        const id = pesertaToUpdate[index];
        updateDoc(doc(firestore, "pesertas", id), {
          keteranganSehat: keteranganSehats.includes(id),
          rekomendasi: rekomendasis.includes(id),
          rapot: rapots.includes(id),
          kartuKeluarga: kartuKeluargas.includes(id),
        })
          .then(() => repeater(index - 1))
          .catch((error) =>
            updateToast(
              toastId,
              "error",
              `Peryaratan gagal disimpan. ${error.code}`
            )
          );
      }
    };
    repeater(pesertaToUpdate.length - 1);
  };

  return (
    <div className="w-fit">
      <ToastContainer />
      {/* DELETE RODAL */}
      <Rodal visible={deleteRodal} onClose={cancelDelete}>
        <div className="flex flex-col h-full justify-around items-center">
          <h1 className="font-bold text-lg">Hapus Peserta</h1>
          <p>
            Nama Peserta: <b>{pesertaToDelete.namaLengkap.toUpperCase()}</b>
          </p>
          <p>
            Kelas Pertandingan:{" "}
            <b>
              {pesertaToDelete.tingkatanPertandingan} |{" "}
              {pesertaToDelete.kategoriPertandingan}
            </b>
          </p>
          <p>
            Nama Kontingen:{" "}
            <b>
              {findNamaKontingen(
                kontingens,
                pesertaToDelete.idKontingen
              ).toUpperCase()}
            </b>
          </p>

          <div className="flex gap-2">
            <button className="btn_red btn_full" onClick={deletePeserta}>
              Delete
            </button>
            <button className="btn_green btn_full" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </Rodal>
      {/* DELETE RODAL */}

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
              <img
                src={kkUrl}
                alt="kk"
                className="w-[500px] h-[500px] object-contain mx-auto"
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
              <img
                src={fotoUrl}
                alt="kk"
                className="w-[400px] h-[300px] object-contain"
              />
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
              <img
                src={ktpUrl}
                alt="kk"
                className="w-[400px] h-[300px] object-contain"
              />
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
        <button className="btn_green btn_full" onClick={onDownload}>
          Download
        </button>
        {!selectedKontingen.idKontingen && (
          <button className="btn_green btn_full" onClick={refreshPesertas}>
            Refresh
          </button>
        )}
        {pesertasLoading && <InlineLoading />}
      </div>
      {selectedKontingen.idKontingen && (
        <div className="flex flex-col w-fit gap-1 mb-1">
          <button
            className="btn_green btn_full"
            onClick={() => savePersyaratan("sdsmp")}
          >
            Save Persyaratan <b>SD & SMP</b>
          </button>
          <button
            className="btn_green btn_full"
            onClick={() => savePersyaratan("smadewasa")}
          >
            Save Persyaratan <b>SMA & DEWASA</b>
          </button>
          <button className="btn_green btn_full" onClick={fetchPersyaratan}>
            Fetch Persyaratan
          </button>
        </div>
      )}
      {/* BUTTONS */}

      {selectedKontingen.idKontingen && (
        <CheckAllPersyaratanButton
          checkAll={checkAllPersyaratan}
          arrays={{
            keteranganSehat: keteranganSehats,
            rekomendasi: rekomendasis,
            rapot: rapots,
            kartuKeluarga: kartuKeluargas,
          }}
          pesertas={pesertaToMap}
        />
      )}

      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item, i) => (
              <>
                <th key={item}>{item}</th>
                {i == 1 && selectedKontingen.idKontingen ? (
                  <th>Persyaratan</th>
                ) : null}
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {pesertaToMap
            .sort(compare("waktuPendaftaran", "asc"))
            .map((peserta: DataPesertaState, i: number) => (
              <tr key={peserta.id}>
                <td>{i + 1}</td>
                <td>{peserta.namaLengkap.toUpperCase()}</td>
                <td>
                  {findNamaKontingen(
                    kontingens,
                    peserta.idKontingen
                  ).toUpperCase()}
                </td>
                {selectedKontingen.idKontingen && (
                  <td className="whitespace-nowrap">
                    <ul>
                      <li>
                        <PersyaratanButton
                          id={peserta.id}
                          label="Surat Keterangan Sehat"
                          data={keteranganSehats}
                          check={checkKeteranganSehat}
                        />
                      </li>
                      <li>
                        <PersyaratanButton
                          id={peserta.id}
                          label="Surat Rekomendasi"
                          data={rekomendasis}
                          check={checkRekomendasi}
                        />
                      </li>
                      {(peserta.tingkatanPertandingan == "Dewasa" ||
                        peserta.tingkatanPertandingan == "SMA") && (
                        <li>
                          <PersyaratanButton
                            id={peserta.id}
                            label="Kartu Keluarga"
                            data={kartuKeluargas}
                            check={checkKartuKeluarga}
                          />
                        </li>
                      )}
                      {peserta.tingkatanPertandingan == "SMA" && (
                        <li>
                          <PersyaratanButton
                            id={peserta.id}
                            label="Rapot"
                            data={rapots}
                            check={checkRapot}
                          />
                        </li>
                      )}
                    </ul>
                  </td>
                )}
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
                <td>
                  {peserta.pembayaran ? (
                    "Dibayar"
                  ) : (
                    <span className="text-red-500">Belum dibayar</span>
                  )}
                </td>
                <td>{peserta.idPembayaran}</td>
                <td>{formatTanggal(peserta.infoPembayaran.waktu)}</td>
                <td>{peserta.confirmedPembayaran ? "Yes" : "No"}</td>
                <td>
                  {peserta.infoKonfirmasi ? peserta.infoKonfirmasi.email : "-"}
                </td>
                <td>{peserta.creatorEmail}</td>
                <td>
                  {peserta.idPembayaran ? null : (
                    <button
                      className="btn_red btn_full text-white"
                      onClick={() => deleteHandler(peserta)}
                    >
                      Delete
                    </button>
                  )}
                </td>
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
