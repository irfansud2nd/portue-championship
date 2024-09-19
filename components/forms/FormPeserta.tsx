"use client";
import { MyContext } from "@/context/Context";
import {
  dataPesertaInitialValue,
  errorPesertaInitialValue,
  jenisKelamin,
  jenisPertandingan,
  tingkatanKategori,
} from "@/utils/constants";
import {
  compare,
  controlToast,
  fetchData,
  toastError,
  validateImage,
} from "@/utils/functions";
import { KontingenState, PesertaState, ErrorPeserta } from "@/utils/types";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import TabelPeserta from "../tabel/TabelPeserta";
import { BiLoader } from "react-icons/bi";
import { countFromCollection } from "@/utils/actions";
import {
  createPeserta,
  deletePeserta,
  getInputErrorPeserta,
  updatePeserta,
} from "@/utils/peserta/pesertaFunctions";
import { countMatch } from "@/utils/peserta/pesertaActions";

type Props = {
  kontingen: KontingenState | undefined;
  setKontingen: React.Dispatch<
    React.SetStateAction<KontingenState | undefined>
  >;
  pesertas: PesertaState[];
  addPesertas: (pesertas: PesertaState[]) => void;
  deletePeserta: (id: string) => void;
};

const FormPeserta = ({
  kontingen,
  setKontingen,
  pesertas,
  addPesertas,
  deletePeserta: deletePesertaState,
}: Props) => {
  const [data, setData] = useState<PesertaState>(dataPesertaInitialValue);
  const [sendClicked, setSendClicked] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pasFotoSelected, setPasFotoSelected] = useState<File | undefined>();
  const [kkSelected, setKkSelected] = useState<File | undefined>();
  const [ktpSelected, setKtpSelected] = useState<File | undefined>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [inputErrorMessages, setInputErrorMessages] = useState<ErrorPeserta>(
    errorPesertaInitialValue
  );
  const [dataToDelete, setDataToDelete] = useState<PesertaState | undefined>(
    undefined
  );
  const [prevData, setPrevData] = useState<PesertaState>(
    dataPesertaInitialValue
  );
  const [tabelLoading, setTabelLoading] = useState(false);
  const [kuotaKelas, setKuotaKelas] = useState<number>(16);
  const [kuotaLoading, setKuotaLoading] = useState(false);
  const [kelasTaken, setKelasTaken] = useState<string[]>([]);

  const toastId = useRef(null);
  const pasFotoRef = useRef<HTMLInputElement>(null);
  const kkRef = useRef<HTMLInputElement>(null);
  const ktpRef = useRef<HTMLInputElement>(null);

  const { user, disable, setDisable } = MyContext();

  // SET DATA USER
  useEffect(() => {
    if (user && kontingen) {
      setData({
        ...data,
        creatorEmail: user.email,
        creatorUid: user.uid,
        idKontingen: kontingen.id,
      });
    }
  }, [user, kontingen]);

  // VALIDATE PAS FOTO
  const pasFotoimageChangeHandler = (file: File) => {
    if (validateImage(file, toastId)) {
      setPasFotoSelected(file);
      setImagePreviewSrc(URL.createObjectURL(file));
    } else {
      if (pasFotoRef.current) pasFotoRef.current.value = "";
    }
  };

  // VALIDATE KK
  const kkChangeHandler = (file: File) => {
    if (validateImage(file, toastId)) {
      setKkSelected(file);
    } else {
      if (kkRef.current) kkRef.current.value = "";
    }
  };

  // VALIDATE KTP
  const ktpChangeHandler = (file: File) => {
    if (validateImage(file, toastId)) {
      setKtpSelected(file);
    } else {
      if (ktpRef.current) ktpRef.current.value = "";
    }
  };

  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (pasFotoRef.current) pasFotoRef.current.value = "";
    if (kkRef.current) kkRef.current.value = "";
    if (ktpRef.current) ktpRef.current.value = "";
    setImagePreviewSrc("");
  };

  // SANITIZE NUMBER
  const sanitizeNumber = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    return sanitizedValue;
  };

  // SANITIZE NIK
  const sanitizeNIK = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    if (sanitizedValue.length <= 16) {
      setData({ ...data, NIK: sanitizedValue.toString() });
    }
  };

  // VALIDATE KATEGORI
  useEffect(() => {
    watchKategori();
  }, [pesertas]);

  useEffect(() => {
    console.log("DATA", data);
  }, [data]);

  const watchKategori = (dataToUpdate?: PesertaState) => {
    let kategoris: string[] = [];
    let kategori = "";
    let countGandaPutra = 0;
    let countGandaPutri = 0;
    let countReguPutra = 0;
    let countReguPutri = 0;
    if (pesertas.length) {
      pesertas.map((peserta) => {
        if (
          peserta.tingkatanPertandingan == "SMA" ||
          peserta.tingkatanPertandingan == "Dewasa"
        ) {
          if (peserta.kategoriPertandingan.split(" ")[0] == "Ganda") {
            if (peserta.jenisKelamin == "Putra") {
              countGandaPutra += 1;
              if (countGandaPutra >= 2) {
                kategori = `${peserta.jenisPertandingan}-${peserta.tingkatanPertandingan}-${peserta.kategoriPertandingan}-${peserta.jenisKelamin}`;
              }
            } else {
              countGandaPutri += 1;
              if (countGandaPutri >= 2) {
                kategori = `${peserta.jenisPertandingan}-${peserta.tingkatanPertandingan}-${peserta.kategoriPertandingan}-${peserta.jenisKelamin}`;
              }
            }
          } else if (peserta.kategoriPertandingan.split(" ")[0] == "Regu") {
            if (peserta.jenisKelamin == "Putra") {
              countReguPutra += 1;
              if (countReguPutra >= 3) {
                kategori = `${peserta.jenisPertandingan}-${peserta.tingkatanPertandingan}-${peserta.kategoriPertandingan}-${peserta.jenisKelamin}`;
              }
            } else {
              countReguPutri += 1;
              if (countReguPutri >= 3) {
                kategori = `${peserta.jenisPertandingan}-${peserta.tingkatanPertandingan}-${peserta.kategoriPertandingan}-${peserta.jenisKelamin}`;
              }
            }
          } else {
            kategori = `${peserta.jenisPertandingan}-${peserta.tingkatanPertandingan}-${peserta.kategoriPertandingan}-${peserta.jenisKelamin}`;
          }
          if (kategoris.indexOf(kategori) < 0) {
            kategoris.push(kategori);
          }
        }
      });
      if (dataToUpdate?.jenisPertandingan) {
        if (
          dataToUpdate.tingkatanPertandingan == "SMA" ||
          dataToUpdate.tingkatanPertandingan == "Dewasa"
        ) {
          if (
            kategoris.indexOf(
              `${dataToUpdate.jenisPertandingan}-${dataToUpdate.tingkatanPertandingan}-${dataToUpdate.kategoriPertandingan}-${dataToUpdate.jenisKelamin}`
            ) >= 0
          ) {
            kategoris.splice(
              kategoris.indexOf(
                `${dataToUpdate.jenisPertandingan}-${dataToUpdate.tingkatanPertandingan}-${dataToUpdate.kategoriPertandingan}-${dataToUpdate.jenisKelamin}`
              ),
              1
            );
          }
          setKelasTaken(kategoris);
        }
      } else {
        setKelasTaken(kategoris);
      }
    }
  };

  //  GENERATE AGE
  const calculateAge = (date: any) => {
    const birthDate = new Date(date);
    const currentDate = new Date();
    currentDate.getTime();
    let age: string | Date | number = new Date(
      currentDate.getTime() - birthDate.getTime()
    );
    setData({ ...data, tanggalLahir: date, umur: age.getFullYear() - 1970 });
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendClicked(true);

    if (
      data.tingkatanPertandingan != "SMA" &&
      data.tingkatanPertandingan != "Dewasa"
    ) {
      sendPeserta();
      return;
    }

    try {
      controlToast(toastId, "loading", "Cek Kuota Kategori", true);
      const result = await cekKuota();

      if (!result)
        throw new Error("Kuota kategori yang dipilih tidak tersedia");

      controlToast(toastId, "success", "Kuota tersedia");
      sendPeserta();
    } catch (error) {
      toastError(toastId, error);
    }
  };

  const sendPeserta = async () => {
    if (
      kelasTaken.indexOf(
        `${data.jenisPertandingan}-${data.tingkatanPertandingan}-${data.kategoriPertandingan}-${data.jenisKelamin}`
      ) >= 0
    ) {
      toastError(
        toastId,
        "1 Kontingen hanya dapat mengirimkan 1 Orang / 1 Nomor per Kategori di tingkat SMA dan Dewasa"
      );

      return;
    }

    if (
      !getInputErrorPeserta(
        data,
        imagePreviewSrc,
        kkRef.current?.value,
        ktpRef.current?.value,
        inputErrorMessages,
        setInputErrorMessages,
        updating,
        updating
      ) ||
      kuotaKelas <= 0 ||
      !kontingen
    )
      return;

    try {
      setDisable(true);

      if (updating) {
        const updatedPeserta = await updatePeserta(
          data,
          pasFotoSelected,
          kkSelected,
          ktpSelected,
          toastId
        );

        addPesertas([updatedPeserta]);
        resetEdit();
      } else {
        if (!pasFotoSelected || !kkSelected || !ktpSelected) return;
        const jumlahPeserta = await fetchData(() =>
          countFromCollection("pesertas")
        );

        if (jumlahPeserta >= Number(process.env.NEXT_PUBLIC_KUOTA_MAKSIMUM)) {
          toastError(
            toastId,
            "Maaf jumlah peserta yang terdaftar telah mencapai batas maksimum"
          );
          return;
        }

        const { peserta: newPeserta, kontingen: updatedKontingen } =
          await createPeserta(
            data,
            pasFotoSelected,
            kkSelected,
            ktpSelected,
            kontingen,
            toastId
          );

        addPesertas([newPeserta]);
        setKontingen(updatedKontingen);
        resetData();
      }
    } catch (error) {
      throw error;
    } finally {
      setDisable(false);
    }
  };

  // GET INPUT ERROR AFTER SEND CLICKED
  useEffect(() => {
    if (sendClicked) {
      getInputErrorPeserta(
        data,
        imagePreviewSrc,
        kkRef.current?.value,
        ktpRef.current?.value,
        inputErrorMessages,
        setInputErrorMessages
      );
    }
  }, [
    data,
    sendClicked,
    pasFotoSelected,
    kkRef.current?.value,
    ktpRef.current?.value,
  ]);

  // RESET DATA
  const resetData = () => {
    setData({
      ...dataPesertaInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingen ? kontingen.id : "",
    });
    setUpdating(false);
    setSendClicked(false);
    setInputErrorMessages(errorPesertaInitialValue);
    clearInputImage();
    setPasFotoSelected(undefined);
    setKkSelected(undefined);
    setKtpSelected(undefined);
    watchKategori();
  };

  // DELETE - STEP 1 - DELETE BUTTON
  const handleDelete = (data: PesertaState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE - STEP 2 - DELETE PERSON
  const deleteData = async () => {
    setModalVisible(false);
    if (!dataToDelete) return;
    try {
      setDisable(true);

      const updatedKontingen = await deletePeserta(
        dataToDelete,
        kontingen,
        toastId
      );

      setKontingen(updatedKontingen);
      deletePesertaState(dataToDelete.id);
    } catch (error) {
      throw error;
    } finally {
      cancelDelete();
    }
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setDisable(false);
    setModalVisible(false);
    setDataToDelete(undefined);
  };

  // EDIT - STEP 1 - EDIT BUTTON
  const handleEdit = (data: PesertaState) => {
    setUpdating(true);
    setData(data);
    setPrevData(data);
    watchKategori(data);
  };

  // EDIT - STEP 2 - SET IMAGE PREVIEW
  useEffect(() => {
    if (prevData.downloadFotoUrl) setImagePreviewSrc(prevData.downloadFotoUrl);
  }, [prevData.downloadFotoUrl]);

  // RESET EDIT
  const resetEdit = () => {
    setDisable(false);
    resetData();
    setPrevData(dataPesertaInitialValue);
    clearInputImage();
    setUpdating(false);
  };

  // DATA LISTENER FOR CEK KUOTA
  useEffect(() => {
    if (
      data.tingkatanPertandingan == "SMA" ||
      data.tingkatanPertandingan == "Dewasa"
    ) {
      cekKuota();
    } else {
      setKuotaKelas(16);
    }
  }, [
    data.tingkatanPertandingan,
    data.kategoriPertandingan,
    data.jenisKelamin,
    data.jenisPertandingan,
  ]);

  // CEK KUOTA TINGKATAN SMA DAN DEWASA
  const cekKuota = async () => {
    let kuota = 16;
    let kuotaGanda = kuota * 2;
    let kuotaRegu = kuota * 3;
    setKuotaLoading(true);

    try {
      const { result: count, error } = await countMatch(
        data.tingkatanPertandingan,
        data.kategoriPertandingan,
        data.jenisKelamin
      );
      if (error) throw error;

      if (data.kategoriPertandingan.includes("Regu")) {
        kuotaRegu -= count;
      } else if (data.kategoriPertandingan.includes("Ganda")) {
        kuotaGanda -= count;
      } else {
        kuota -= count;
      }

      if (
        updating &&
        prevData.kategoriPertandingan == data.kategoriPertandingan &&
        prevData.jenisKelamin == data.jenisKelamin &&
        prevData.jenisPertandingan == data.jenisPertandingan
      ) {
        if (data.kategoriPertandingan.includes("Regu")) {
          kuotaRegu += 1;
        } else if (data.kategoriPertandingan.includes("Ganda")) {
          kuotaGanda += 1;
        } else {
          kuota += 1;
        }
      }
      if (data.kategoriPertandingan.includes("Regu")) {
        return kuotaRegu;
      } else if (data.kategoriPertandingan.includes("Ganda")) {
        return kuotaGanda;
      } else {
        return kuota;
      }
    } catch (error) {
      toastError(toastId, error);
      return;
    } finally {
      if (data.kategoriPertandingan.includes("Regu")) {
        setKuotaKelas(kuotaRegu);
      } else if (data.kategoriPertandingan.includes("Ganda")) {
        setKuotaKelas(kuotaGanda);
      } else {
        setKuotaKelas(kuota);
      }
      setKuotaLoading(false);
    }
  };

  // DATA LISTENER TO CHANGE DEFAULT KATEGORI
  useEffect(() => {
    const kategoriDefault =
      data.jenisPertandingan == jenisPertandingan[0]
        ? tingkatanKategori[
            tingkatanKategori.findIndex(
              (item) => item.tingkatan == data.tingkatanPertandingan
            )
          ].kategoriTanding[0]
        : data.jenisKelamin == jenisKelamin[0]
        ? tingkatanKategori[
            tingkatanKategori.findIndex(
              (item) => item.tingkatan == data.tingkatanPertandingan
            )
          ].kategoriSeni.putra[0]
        : tingkatanKategori[
            tingkatanKategori.findIndex(
              (item) => item.tingkatan == data.tingkatanPertandingan
            )
          ].kategoriSeni.putri[0];

    if (user && data.idKontingen) {
      if (
        prevData.tingkatanPertandingan != data.tingkatanPertandingan ||
        prevData.jenisPertandingan != data.jenisPertandingan ||
        prevData.jenisKelamin != data.jenisKelamin
      ) {
        setData({
          ...data,
          kategoriPertandingan: kategoriDefault,
        });
      }
    }
  }, [
    data.tingkatanPertandingan,
    data.jenisPertandingan,
    data.jenisKelamin,
    user,
    data.idKontingen,
  ]);

  // INPUT FILE DISABLER
  useEffect(() => {
    if (pasFotoRef.current) pasFotoRef.current.disabled = disable;
  }, [disable]);

  const editOnly = false;

  return (
    <div className="flex flex-col gap-2">
      <TabelPeserta
        loading={tabelLoading}
        data={pesertas.sort(compare("waktuPendaftaran", "asc"))}
        kontingen={kontingen}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      {/* RODAL */}
      <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="h-full w-full">
          <div className="h-full w-full flex flex-col justify-between">
            <h1 className="font-semibold text-red-500">Hapus Peserta</h1>
            <p>
              {dataToDelete?.pembayaran
                ? "Maaf peserta yang terlah diselesaikan pembayarannya tidak dapat dihapus"
                : "Apakah anda yakin akan menghapus Peserta ini?"}
            </p>
            <div className="self-end flex gap-2">
              {!dataToDelete?.pembayaran && (
                <button
                  className="btn_red btn_full"
                  onClick={deleteData}
                  type="button"
                >
                  Yakin
                </button>
              )}
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
      {/* RODAL */}

      {/* FORM */}
      {/* {updating ? ( */}
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="grid grid-rows-[1fr_auto] gap-2">
          {/* BARIS 1 */}
          {/* <div className="w-full flex flex-wrap sm:flex-nowrap justify-center gap-3"> */}
          <div className="w-full flex flex-wrap justify-center min-[825px]:grid min-[825px]:grid-cols-[auto_1fr] gap-3">
            {/* KOLOM KIRI */}
            {/* PAS FOTO */}
            {!editOnly && (
              <div className="input_container max-w-[150px] ">
                <label className="input_label text-center">Pas Foto</label>
                <p className="-mt-2 text-sm text-gray-600 text-center">
                  Maks. 1MB
                </p>
                <div
                  className={`
                ${inputErrorMessages.pasFoto ? "input_error" : "input"}
                bg-white w-[150px] h-[200px] relative border-2 rounded-md`}
                >
                  {imagePreviewSrc && (
                    // <Image
                    //   src={imagePreviewSrc}
                    //   alt="preview"
                    //   fill
                    //   className="object-cover rounded-md"
                    // />
                    <img
                      src={imagePreviewSrc}
                      alt="preview"
                      className="w-[150px] h-[200px] object-cover rounded-md"
                    />
                  )}
                </div>
                <input
                  disabled={disable}
                  ref={pasFotoRef}
                  accept=".jpg, .jpeg, .png"
                  type="file"
                  multiple={false}
                  onChange={(e) =>
                    e.target.files &&
                    pasFotoimageChangeHandler(e.target.files[0])
                  }
                  className="input_file mt-1 w-full text-transparent"
                />
                <p className="text-red-500 text-center">
                  {inputErrorMessages.pasFoto}
                </p>
              </div>
            )}
            {/* PAS FOTO */}
            {/* KOLOM KIRI */}

            {/* KOLOM KANAN */}
            <div className="w-full flex flex-wrap justify-center min-[825px]:justify-normal gap-3 h-fit">
              {/* NAMA LENGKAP */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">Nama Lengkap</label>
                  <input
                    disabled={disable}
                    className={`${
                      inputErrorMessages.namaLengkap ? "input_error" : "input"
                    } capitalize`}
                    type="text"
                    value={data.namaLengkap}
                    onChange={(e) =>
                      setData({
                        ...data,
                        namaLengkap: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <p className="text-red-500">
                    {inputErrorMessages.namaLengkap}
                  </p>
                </div>
              )}
              {/* NAMA LENGKAP */}

              {/* NIK */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">NIK</label>
                  <input
                    disabled={disable}
                    value={data.NIK}
                    type="text"
                    onChange={(e) => sanitizeNIK(e.target.value)}
                    className={`
                ${inputErrorMessages.NIK ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">{inputErrorMessages.NIK}</p>
                </div>
              )}
              {/* NIK */}

              {/* EDIT ONLY */}
              {/* JENIS KELAMIN */}
              <div className="input_container">
                <label className="input_label">Jenis Kelamin</label>
                <select
                  disabled={disable}
                  value={data.jenisKelamin}
                  onChange={(e) =>
                    setData({ ...data, jenisKelamin: e.target.value })
                  }
                  className={`
                ${inputErrorMessages.jenisKelamin ? "input_error" : "input"}
                `}
                >
                  {jenisKelamin.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className="text-red-500">
                  {inputErrorMessages.jenisKelamin}
                </p>
              </div>
              {/* JENIS KELAMIN */}
              {/* EDIT ONLY */}

              {/* ALAMAT LENGKAP */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">Alamat Lengkap</label>
                  <textarea
                    disabled={disable}
                    value={data.alamatLengkap}
                    onChange={(e) =>
                      setData({
                        ...data,
                        alamatLengkap: e.target.value,
                      })
                    }
                    className={`
                ${inputErrorMessages.alamatLengkap ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {inputErrorMessages.alamatLengkap}
                  </p>
                </div>
              )}
              {/* ALAMAT LENGKAP */}

              {/* TEMPAT LAHIR */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">Tempat Lahir</label>
                  <input
                    disabled={disable}
                    value={data.tempatLahir}
                    type="text"
                    onChange={(e) =>
                      setData({
                        ...data,
                        tempatLahir: e.target.value,
                      })
                    }
                    className={`
                ${inputErrorMessages.tempatLahir ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {inputErrorMessages.tempatLahir}
                  </p>
                </div>
              )}
              {/* TEMPAT LAHIR */}

              {/* TANGGAL LAHIR */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">Tanggal Lahir</label>
                  <input
                    disabled={disable}
                    value={data.tanggalLahir}
                    type="date"
                    onChange={(e) => calculateAge(e.target.value)}
                    className={`
                ${inputErrorMessages.tanggalLahir ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {inputErrorMessages.tanggalLahir}
                  </p>
                </div>
              )}
              {/* TANGGAL LAHIR */}

              {/* EMAIL */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">
                    Email{" "}
                    {data.umur >= 17 || data.umur == 0 ? (
                      "Peserta"
                    ) : (
                      <span className="bg-yellow-400 rounded-md px-0.5">
                        Orangtua
                      </span>
                    )}
                  </label>
                  <p className="text-xs">
                    Peserta &lt; 17 tahun gunakan email Orangtua
                  </p>
                  <input
                    disabled={disable}
                    value={data.email}
                    type="email"
                    onChange={(e) =>
                      setData({
                        ...data,
                        email: e.target.value,
                      })
                    }
                    className={`
                ${inputErrorMessages.email ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">{inputErrorMessages.email}</p>
                </div>
              )}
              {/* EMAIL */}

              {/* NO HP */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">
                    Nomor HP{" "}
                    {data.umur >= 17 || data.umur == 0 ? (
                      "Peserta"
                    ) : (
                      <span className="bg-yellow-400 rounded-md px-0.5">
                        Orangtua
                      </span>
                    )}
                  </label>
                  <p className="text-xs">
                    Peserta &lt; 17 tahun gunakan No HP Orangtua
                  </p>
                  <input
                    disabled={disable}
                    value={data.noHp}
                    type="string"
                    onChange={(e) =>
                      setData({
                        ...data,
                        noHp: sanitizeNumber(e.target.value),
                      })
                    }
                    className={`
                ${inputErrorMessages.noHp ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">{inputErrorMessages.noHp}</p>
                </div>
              )}
              {/* NO HP */}

              {/* KTP */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">
                    KTP{" "}
                    {data.umur >= 17 || data.umur == 0 ? (
                      "Peserta"
                    ) : (
                      <span className="bg-yellow-400 rounded-md px-0.5">
                        Orangtua
                      </span>
                    )}{" "}
                    <span className="text-sm text-gray-600">Maks. 1MB</span>
                  </label>
                  <p className="text-xs">
                    Peserta &lt; 17 tahun gunakan KTP Orangtua
                  </p>
                  <input
                    disabled={disable}
                    ref={ktpRef}
                    type="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    multiple={false}
                    onChange={(e) =>
                      e.target.files && ktpChangeHandler(e.target.files[0])
                    }
                    className={`input_kk
                ${inputErrorMessages.ktp ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {!updating && inputErrorMessages.ktp}
                  </p>
                </div>
              )}
              {/* KTP */}

              {/* KARTU KELUARGA */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">
                    Kartu Keluarga{" "}
                    <span className="text-sm text-gray-600">Maks. 1MB</span>
                  </label>
                  <input
                    disabled={disable}
                    ref={kkRef}
                    type="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    multiple={false}
                    onChange={(e) =>
                      e.target.files && kkChangeHandler(e.target.files[0])
                    }
                    className={`input_kk
                ${inputErrorMessages.kk ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {!updating && inputErrorMessages.kk}
                  </p>
                </div>
              )}
              {/* KARTU KELUARGA */}

              {/* TINGGI BADAN */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">
                    Tinggi Badan{" "}
                    <span className="text-sm text-gray-600">(CM)</span>
                  </label>
                  <input
                    disabled={disable}
                    value={data.tinggiBadan == 0 ? "" : data.tinggiBadan}
                    type="text"
                    onChange={(e) =>
                      setData({
                        ...data,
                        tinggiBadan: Number(sanitizeNumber(e.target.value)),
                      })
                    }
                    className={`
                ${inputErrorMessages.tinggiBadan ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {inputErrorMessages.tinggiBadan}
                  </p>
                </div>
              )}
              {/* TINGGI BADAN */}

              {/* BERAT BADAN */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">
                    Berat Badan{" "}
                    <span className="text-sm text-gray-600">(KG)</span>
                  </label>
                  <input
                    disabled={disable}
                    value={data.beratBadan == 0 ? "" : data.beratBadan}
                    type="text"
                    step={0.1}
                    onChange={(e) =>
                      setData({
                        ...data,
                        beratBadan: Number(sanitizeNumber(e.target.value)),
                      })
                    }
                    className={`
                ${inputErrorMessages.beratBadan ? "input_error" : "input"}
                `}
                  />
                  <p className="text-red-500">
                    {inputErrorMessages.beratBadan}
                  </p>
                </div>
              )}
              {/* BERAT BADAN */}

              {/* NAMA KONTINGEN */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">Nama Kontingen</label>
                  <select
                    disabled={disable}
                    value={data.idKontingen}
                    onChange={(e) => {
                      setData({
                        ...data,
                        idKontingen: e.target.value,
                      });
                    }}
                    className={`
                  uppercase
                  ${inputErrorMessages.idKontingen ? "input_error" : "input"}
                  `}
                  >
                    <option className="uppercase" value={kontingen?.id}>
                      {kontingen?.namaKontingen || ""}
                    </option>
                  </select>
                  <p className="text-red-500">
                    {inputErrorMessages.idKontingen}
                  </p>
                </div>
              )}
              {/* NAMA KONTINGEN */}

              {/* TINGKATAN */}
              {!editOnly && (
                <div className="input_container">
                  <label className="input_label">Tingkatan</label>
                  <select
                    disabled={disable}
                    value={data.tingkatanPertandingan}
                    onChange={(e) => {
                      setData({
                        ...data,
                        tingkatanPertandingan: e.target.value,
                      });
                    }}
                    className={`
                ${
                  inputErrorMessages.tingkatanPertandingan
                    ? "input_error"
                    : "input"
                }
                `}
                  >
                    {tingkatanKategori.map((item) => (
                      <option value={item.tingkatan} key={item.tingkatan}>
                        {item.tingkatan}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500">
                    {inputErrorMessages.tingkatanPertandingan}
                  </p>
                </div>
              )}
              {/* TINGKATAN */}

              {/* EDIT ONLY */}
              {/* JENIS PERTANDINGAN */}
              <div className="input_container">
                <label className="input_label">Jenis Pertaindingan</label>
                <select
                  disabled={disable}
                  value={data.jenisPertandingan}
                  onChange={(e) =>
                    setData({
                      ...data,
                      jenisPertandingan: e.target.value,
                      kategoriPertandingan:
                        e.target.value == "Tanding"
                          ? tingkatanKategori[
                              tingkatanKategori.findIndex(
                                (i) => i.tingkatan == data.tingkatanPertandingan
                              )
                            ].kategoriTanding[0]
                          : tingkatanKategori[
                              tingkatanKategori.findIndex(
                                (i) => i.tingkatan == data.tingkatanPertandingan
                              )
                            ].kategoriTanding[0],
                    })
                  }
                  className={`
                ${
                  inputErrorMessages.jenisPertandingan ? "input_error" : "input"
                }
                `}
                >
                  {jenisPertandingan.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className="text-red-500">
                  {inputErrorMessages.jenisPertandingan}
                </p>
              </div>
              {/* JENIS PERTANDINGAN */}

              {/* KATEGORI TANDING */}
              {data.jenisPertandingan == "Tanding" && (
                <div className="input_container">
                  <label className="input_label">Kategori Tanding</label>
                  <select
                    disabled={disable}
                    value={data.kategoriPertandingan}
                    onChange={(e) => {
                      setData({
                        ...data,
                        kategoriPertandingan: e.target.value,
                      });
                    }}
                    className={`
                  ${
                    inputErrorMessages.kategoriPertandingan
                      ? "input_error"
                      : kuotaKelas
                      ? "input"
                      : "input_error"
                  }
                  input
                  `}
                  >
                    {tingkatanKategori[
                      tingkatanKategori.findIndex(
                        (i) => i.tingkatan == data.tingkatanPertandingan
                      )
                    ].kategoriTanding.map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500">
                    {inputErrorMessages.kategoriPertandingan}
                  </p>
                  {(data.tingkatanPertandingan == "SMA" ||
                    data.tingkatanPertandingan == "Dewasa") &&
                    (kuotaLoading ? (
                      <p className="text-end">
                        Memuat kuota kategori{" "}
                        <BiLoader className="animate-spin inline" />
                      </p>
                    ) : !kuotaKelas ? (
                      <p className="text-end text-red-500">
                        Kuota kategori habis
                      </p>
                    ) : (
                      <p className="text-end">
                        Sisa kuota kategori: {kuotaKelas} peserta
                      </p>
                    ))}
                </div>
              )}

              {data.jenisPertandingan == "Seni" && (
                <div className="input_container">
                  <label className="input_label">Kategori Seni</label>
                  <select
                    disabled={disable}
                    value={data.kategoriPertandingan}
                    onChange={(e) =>
                      setData({
                        ...data,
                        kategoriPertandingan: e.target.value,
                      })
                    }
                    className={`
                  ${
                    inputErrorMessages.kategoriPertandingan
                      ? "input_error"
                      : "input"
                  }
                  input
                  `}
                  >
                    {data.jenisKelamin == "Putra"
                      ? tingkatanKategori[
                          tingkatanKategori.findIndex(
                            (i) => i.tingkatan == data.tingkatanPertandingan
                          )
                        ].kategoriSeni.putra.map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))
                      : tingkatanKategori[
                          tingkatanKategori.findIndex(
                            (i) => i.tingkatan == data.tingkatanPertandingan
                          )
                        ].kategoriSeni.putri.map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))}
                  </select>
                  <p className="text-red-500">
                    {inputErrorMessages.kategoriPertandingan}
                  </p>
                  {(data.tingkatanPertandingan == "SMA" ||
                    data.tingkatanPertandingan == "Dewasa") &&
                    (kuotaLoading ? (
                      <p className="text-end">
                        Memuat kuota kategori{" "}
                        <BiLoader className="animate-spin inline" />
                      </p>
                    ) : !kuotaKelas ? (
                      <p className="text-end text-red-500">
                        Kuota kategori habis
                      </p>
                    ) : (
                      <p className="text-end">
                        Sisa kuota kategori: {kuotaKelas} peserta
                      </p>
                    ))}
                </div>
              )}
              {/* KATEGORI TANDING */}
              {/* EDIT ONLY */}
            </div>
            {/* KOLOM KANAN */}
          </div>
          {/* BARIS 1 */}

          {/* BARIS 2 */}
          {/* BUTTONS */}
          <div className="mt-2 flex gap-2 justify-end w-full">
            <button
              disabled={disable}
              className="btn_red btn_full"
              onClick={resetData}
              type="button"
            >
              Batal
            </button>
            <button
              className="btn_green btn_full"
              type="submit"
              disabled={disable}
            >
              {updating ? "Perbaharui" : "Simpan"}
            </button>
          </div>
          {/* BUTTONS */}
          {/* BARIS 2 */}
        </div>
      </form>
      {/* ) : null} */}
      {/* FORM */}
    </div>
  );
};
export default FormPeserta;
