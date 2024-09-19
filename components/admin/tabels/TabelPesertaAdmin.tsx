import { AdminContext } from "@/context/AdminContext";
import {
  compare,
  controlToast,
  findNamaKontingen,
  formatTanggal,
  toastError,
} from "@/utils/functions";
import { PesertaState } from "@/utils/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import InlineLoading from "../InlineLoading";
import { dataPesertaInitialValue } from "@/utils/constants";
import "react-toastify/dist/ReactToastify.css";
import PersyaratanButton from "./PersyaratanButton";
import CheckAllPersyaratanButton from "./CheckAllPersyaratanButton";
import {
  deletePeserta,
  updatePesertas,
} from "@/utils/peserta/pesertaFunctions";

const TabelPesertaAdmin = () => {
  const {
    pesertas,
    kontingens,
    fetchPesertas,
    pesertasLoading,
    selectedKontingen,
    selectedKategori,
    selectedPesertas,
    addPesertas,
    deletePeserta: deletePesertaContext,
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
  const [pesertaToDelete, setPesertaToDelete] = useState<PesertaState>(
    dataPesertaInitialValue
  );
  const [pesertaToMap, setPesertaToMap] = useState<PesertaState[]>(pesertas);

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

  const deleteHandler = (peserta: PesertaState) => {
    setPesertaToDelete(peserta);
    setDeleteRodal(true);
  };

  const handleDelete = async () => {
    setDeleteRodal(false);
    await deletePeserta(pesertaToDelete, undefined, toastId);
    deletePesertaContext(pesertaToDelete.id);
  };

  const cancelDelete = () => {
    setPesertaToDelete(dataPesertaInitialValue);
    setDeleteRodal(false);
  };

  const checkKeteranganSehat = (add: boolean, id: string) => {
    if (add) {
      setKeteranganSehats((prev) => [...prev, id]);
    } else {
      let arr = keteranganSehats.filter((item) => item != id);
      setKeteranganSehats(arr);
    }
  };
  const checkRekomendasi = (add: boolean, id: string) => {
    if (add) {
      setRekomendasis((prev) => [...prev, id]);
    } else {
      let arr = rekomendasis.filter((item) => item != id);
      setRekomendasis(arr);
    }
  };
  const checkRapot = (add: boolean, id: string) => {
    if (add) {
      setRapots((prev) => [...prev, id]);
    } else {
      let arr = rapots.filter((item) => item != id);
      setRapots(arr);
    }
  };
  const checkKartuKeluarga = (add: boolean, id: string) => {
    if (add) {
      setKartuKeluargas((prev) => [...prev, id]);
    } else {
      let arr = kartuKeluargas.filter((item) => item != id);
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

  const savePersyaratan = async (tipe: "sdsmp" | "smadewasa") => {
    let pesertaToUpdate: PesertaState[] = [];
    pesertaToMap.map((peserta) => {
      if (
        (peserta.tingkatanPertandingan.includes("SD") ||
          peserta.tingkatanPertandingan.includes("SMP")) &&
        tipe == "sdsmp"
      ) {
        pesertaToUpdate.push(peserta);
      }
      if (
        (peserta.tingkatanPertandingan.includes("SMA") ||
          peserta.tingkatanPertandingan.includes("Dewasa")) &&
        tipe == "smadewasa"
      ) {
        pesertaToUpdate.push(peserta);
      }
    });

    let updatedPesertas = pesertaToUpdate.map((peserta) => ({
      ...peserta,
      keteranganSehat: keteranganSehats.includes(peserta.id),
      rekomendasi: rekomendasis.includes(peserta.id),
      rapot: rapots.includes(peserta.id),
      kartuKeluarga: kartuKeluargas.includes(peserta.id),
    }));

    try {
      controlToast(toastId, "loading", "Menyimpan Persyaratan", true);
      await updatePesertas(updatedPesertas);
      addPesertas(updatedPesertas);
      controlToast(toastId, "success", "Persyaratan berhasil disimpan");
    } catch (error) {
      toastError(toastId, error);
    }
  };

  return (
    <div className="w-fit">
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
            <button className="btn_red btn_full" onClick={handleDelete}>
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
        {!selectedKontingen && (
          <button className="btn_green btn_full" onClick={fetchPesertas}>
            Refresh
          </button>
        )}
        {pesertasLoading && <InlineLoading />}
      </div>
      {selectedKontingen && (
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

      {selectedKontingen && (
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
                {i == 1 && selectedKontingen ? <th>Persyaratan</th> : null}
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {pesertaToMap
            .sort(compare("waktuPendaftaran", "asc"))
            .map((peserta: PesertaState, i: number) => (
              <tr key={peserta.id}>
                <td>{i + 1}</td>
                <td>{peserta.namaLengkap.toUpperCase()}</td>
                <td>
                  {findNamaKontingen(
                    kontingens,
                    peserta.idKontingen
                  ).toUpperCase()}
                </td>
                {selectedKontingen && (
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
