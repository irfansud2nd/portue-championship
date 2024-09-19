import { OfficialState, ErrorOfficial, KontingenState } from "../types";
import { ToastId } from "../constants";
import { controlToast, getFileUrl, sendFile, toastError } from "../functions";
import {
  createData,
  deleteData,
  deleteFile,
  getNewDocId,
  updateData,
} from "../actions";
import { managePersonOnKontingen } from "../kontingen/kontingenActions";

// GET INPUT ERROR OFFICIAL
export const getInputErrorOfficial = (
  data: OfficialState,
  imageUrl: string | null,
  error: ErrorOfficial,
  setError: React.Dispatch<React.SetStateAction<ErrorOfficial>>
) => {
  setError({
    ...error,
    pasFoto: imageUrl ? null : "Tolong lengkapi Pas Foto",
    namaLengkap: data.namaLengkap == "" ? "Tolong lengkapi Nama Lengkap" : null,
    jenisKelamin:
      data.jenisKelamin == "" ? "Tolong lengkapi Jenis Kelamin" : null,
    idKontingen:
      data.idKontingen == "" ? "Tolong lengkapi Nama Kontingen" : null,
    jabatan: data.jabatan == "" ? "Tolong lengkapi Jabatan" : null,
  });
  if (
    imageUrl &&
    data.namaLengkap &&
    data.jenisKelamin &&
    data.idKontingen &&
    data.jabatan
  ) {
    return true;
  } else {
    return false;
  }
};

export const createOfficial = async (
  official: OfficialState,
  foto: File,
  kontingen: KontingenState,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Mendaftarkan official", true);
    let newOfficial: OfficialState = { ...official };
    newOfficial.id = await getNewDocId("officials");
    const { fotoUrl } = getFileUrl("official", newOfficial.id);

    newOfficial.fotoUrl = fotoUrl;

    // UPLOAD IMAGE
    controlToast(toastId, "loading", "Mengunggah pas foto");
    newOfficial.downloadFotoUrl = await sendFile(foto, newOfficial.fotoUrl);

    // UPLOAD PERSON
    controlToast(toastId, "loading", "Mendaftarkan official");
    newOfficial.waktuPendaftaran = Date.now();
    const { error } = await createData("officials", newOfficial);
    if (error) throw error;

    // ADD PERSON TO KONTINGEN
    controlToast(toastId, "loading", "Menambahkan official ke kontingen");
    const { result: updatedKontingen, error: kontingenError } =
      await managePersonOnKontingen(kontingen, "official", newOfficial.id);
    if (kontingenError) throw error;

    // FINISH
    controlToast(toastId, "success", "Official berhasil didaftarkan");

    return { official: newOfficial, kontingen: updatedKontingen };
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const updateOfficial = async (
  official: OfficialState,
  foto?: File,
  toastId?: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Memperbaharui official", true);

    let updatedOfficial: OfficialState = { ...official };

    // UPDATE FOTO
    if (foto) {
      controlToast(toastId, "loading", "Memperbaharui foto");
      updatedOfficial.downloadFotoUrl = await sendFile(
        foto,
        updatedOfficial.fotoUrl
      );
    }

    // UPDATE PERSON
    controlToast(toastId, "loading", "Memperbaharui official");
    updatedOfficial.waktuPerubahan = Date.now();

    const { error } = await updateData("officials", updatedOfficial);
    if (error) throw error;

    // FINISH

    controlToast(toastId, "success", "Official berhasil diperbaharui");

    return updatedOfficial;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const deleteOfficial = async (
  official: OfficialState,
  kontingen?: KontingenState,
  toastId?: ToastId
) => {
  try {
    // DELETE FOTO
    controlToast(toastId, "loading", "Menghapus foto", true);

    const { error: fotoError } = await deleteFile(official.fotoUrl);
    if (fotoError) throw fotoError;

    // DELETE PERSON
    controlToast(toastId, "loading", "Menghapus official");

    const { error } = await deleteData("officials", official.id);
    if (error) throw error;

    // DELETE PERSON FROM KONTINGEN
    let updatedKontingen: KontingenState | undefined;
    if (kontingen) {
      const { result, error } = await managePersonOnKontingen(
        kontingen,
        "official",
        official.id,
        true
      );

      if (error) throw error;

      updatedKontingen = result;
    }

    // FINISH
    controlToast(toastId, "success", "Official berhasil dihapus");

    return updatedKontingen;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const deleteOfficials = async (officials: OfficialState[]) => {
  try {
    const deletePromises = officials.map(async (official) => {
      await deleteOfficial(official);
    });

    Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};
