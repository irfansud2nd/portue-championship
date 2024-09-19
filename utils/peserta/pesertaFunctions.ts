import { PesertaState, ErrorPeserta, KontingenState } from "../types";
import { ToastId } from "../constants";
import {
  createData,
  deleteData,
  deleteFile,
  getNewDocId,
  updateData,
} from "../actions";
import { controlToast, getFileUrl, sendFile, toastError } from "../functions";
import { managePersonOnKontingen } from "../kontingen/kontingenActions";
import { error } from "console";

// GET INPUT ERROR PESERTA
export const getInputErrorPeserta = (
  data: PesertaState,
  imageUrl: string | null,
  kkRef: string | undefined,
  ktpRef: string | undefined,
  error: ErrorPeserta,
  setError: React.Dispatch<React.SetStateAction<ErrorPeserta>>,
  ignoreKk?: boolean,
  ignoreKtp?: boolean
) => {
  setError({
    ...error,
    pasFoto: imageUrl ? null : "Tolong lengkapi Pas Foto",
    namaLengkap: data.namaLengkap == "" ? "Tolong lengkapi Nama Lengkap" : null,
    NIK:
      data.NIK.length != 0 && data.NIK.length != 16
        ? "NIK tidak valid (!6 Digit)"
        : null,
    jenisKelamin:
      data.jenisKelamin == "" ? "Tolong lengkapi Jenis Kelamin" : null,
    alamatLengkap:
      data.alamatLengkap == "" ? "Tolong lengkapi Alamat Lengkap" : null,
    tempatLahir: data.tempatLahir == "" ? "Tolong lengkapi Tempat Lahir" : null,
    tanggalLahir:
      data.tanggalLahir == "" ? "Tolong lengkapi Tanggal Lahir" : null,
    tinggiBadan: data.tinggiBadan == 0 ? "Tolong lengkapi Tinggi Badan" : null,
    beratBadan: data.beratBadan == 0 ? "Tolong lengkapi Berat Badan" : null,
    idKontingen:
      data.idKontingen == "" ? "Tolong lengkapi Nama Kontingen" : null,
    tingkatanPertandingan:
      data.tingkatanPertandingan == ""
        ? "Tolong lengkapi Tingkatan Pertandingan"
        : null,
    jenisPertandingan:
      data.jenisPertandingan == ""
        ? "Tolong lengkapi Jenis Pertandingan"
        : null,
    kategoriPertandingan:
      data.kategoriPertandingan == ""
        ? "Tolong lengkapi kategori Pertandingan"
        : null,
    email: data.email == "" ? "Tolong lengkapi email" : null,
    noHp: data.noHp == "" ? "Tolong lengkapi nomor HP" : null,
    kk: kkRef ? null : "Lengkapi Kartu Keluarga",
    ktp: ktpRef ? null : "Lengkapi KTP",
  });
  if (
    imageUrl &&
    data.namaLengkap &&
    (data.NIK.length == 0 || data.NIK.length == 16) &&
    data.jenisKelamin &&
    data.alamatLengkap &&
    data.tempatLahir &&
    data.tanggalLahir &&
    data.tinggiBadan &&
    data.beratBadan &&
    data.idKontingen &&
    data.tingkatanPertandingan &&
    data.jenisPertandingan &&
    data.kategoriPertandingan &&
    data.email &&
    data.noHp &&
    (kkRef || ignoreKk) &&
    (ktpRef || ignoreKtp)
  ) {
    return true;
  } else {
    return false;
  }
};

export const createPeserta = async (
  peserta: PesertaState,
  foto: File,
  kk: File,
  ktp: File,
  kontingen: KontingenState,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Mendaftarkan peserta", true);
    let newPeserta: PesertaState = { ...peserta };
    newPeserta.id = await getNewDocId("pesertas");
    const { fotoUrl, kkUrl, ktpUrl } = getFileUrl("peserta", newPeserta.id);

    newPeserta.fotoUrl = fotoUrl;
    newPeserta.kkUrl = kkUrl;
    newPeserta.ktpUrl = ktpUrl;

    // UPLOAD IMAGE
    controlToast(toastId, "loading", "Mengunggah pas foto");
    newPeserta.downloadFotoUrl = await sendFile(foto, newPeserta.fotoUrl);

    // UPLOAD IMAGE
    controlToast(toastId, "loading", "Mengunggah KTP");
    newPeserta.downloadKtpUrl = await sendFile(ktp, newPeserta.ktpUrl);

    // UPLOAD IMAGE
    controlToast(toastId, "loading", "Mengunggah KK");
    newPeserta.downloadKkUrl = await sendFile(kk, newPeserta.kkUrl);

    // UPLOAD PERSON
    controlToast(toastId, "loading", "Mendaftarkan peserta");
    newPeserta.waktuPendaftaran = Date.now();
    const { error } = await createData("pesertas", newPeserta);
    if (error) throw error;

    // ADD PERSON TO KONTINGEN
    controlToast(toastId, "loading", "Menambahkan peserta ke kontingen");
    const { result: updatedKontingen, error: kontingenError } =
      await managePersonOnKontingen(kontingen, "peserta", newPeserta.id);
    if (kontingenError) throw error;

    // FINISH
    controlToast(toastId, "success", "Peserta berhasil didaftarkan");

    return { peserta: newPeserta, kontingen: updatedKontingen };
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const updatePeserta = async (
  peserta: PesertaState,
  foto?: File,
  kk?: File,
  ktp?: File,
  toastId?: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Memperbaharui peserta", true);

    let updatedPeserta: PesertaState = { ...peserta };

    // UPDATE FOTO
    if (foto) {
      controlToast(toastId, "loading", "Memperbaharui foto");
      updatedPeserta.downloadFotoUrl = await sendFile(
        foto,
        updatedPeserta.fotoUrl
      );
    }

    // UPDATE KTP
    if (ktp) {
      controlToast(toastId, "loading", "Memperbaharui KTP");
      updatedPeserta.downloadKtpUrl = await sendFile(
        ktp,
        updatedPeserta.ktpUrl
      );
    }

    // UPDATE KK
    if (kk) {
      controlToast(toastId, "loading", "Memperbaharui KK");
      updatedPeserta.downloadKkUrl = await sendFile(kk, updatedPeserta.kkUrl);
    }

    // UPDATE PERSON
    controlToast(toastId, "loading", "Memperbaharui peserta");
    updatedPeserta.waktuPerubahan = Date.now();

    const { error } = await updateData("pesertas", updatedPeserta);
    if (error) throw error;

    // FINISH

    controlToast(toastId, "success", "Peserta berhasil diperbaharui");

    return updatedPeserta;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const updatePesertas = async (pesertas: PesertaState[]) => {
  try {
    const updatePromises = pesertas.map(async (peserta) => {
      await updatePeserta(peserta);
    });

    Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

export const deletePeserta = async (
  peserta: PesertaState,
  kontingen?: KontingenState,
  toastId?: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Menghapus peserta", true);

    if (peserta.idPembayaran.length)
      throw new Error("Peserta sudah melakukan pembayaran");

    // DELETE FOTO
    controlToast(toastId, "loading", "Menghapus foto");

    const { error: fotoError } = await deleteFile(peserta.fotoUrl);
    if (fotoError) throw fotoError;

    // DELETE KTP
    controlToast(toastId, "loading", "Menghapus KTP");

    const { error: ktpError } = await deleteFile(peserta.ktpUrl);
    if (ktpError) throw ktpError;

    // DELETE KK
    controlToast(toastId, "loading", "Menghapus KK");

    const { error: kkError } = await deleteFile(peserta.kkUrl);
    if (kkError) throw kkError;

    // DELETE PERSON
    controlToast(toastId, "loading", "Menghapus peserta");

    const { error } = await deleteData("pesertas", peserta.id);
    if (error) throw error;

    // DELETE PERSON FROM KONTINGEN
    let updatedKontingen: KontingenState | undefined;
    if (kontingen) {
      const { result, error } = await managePersonOnKontingen(
        kontingen,
        "peserta",
        peserta.id,
        true
      );

      if (error) throw error;

      updatedKontingen = result;
    }

    // FINISH
    controlToast(toastId, "success", "Peserta berhasil dihapus");

    return updatedKontingen;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const deletePesertas = async (pesertas: PesertaState[]) => {
  try {
    const deletePromises = pesertas.map(async (peserta) => {
      await deletePeserta(peserta);
    });

    Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};
