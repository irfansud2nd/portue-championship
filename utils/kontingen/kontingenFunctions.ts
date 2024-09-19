import { createData, deleteData, getNewDocId, updateData } from "../actions";
import { ToastId } from "../constants";
import { controlToast, toastError } from "../functions";
import { deleteOfficials } from "../official/officialFunctions";
import { deletePesertas } from "../peserta/pesertaFunctions";
import { KontingenState, OfficialState, PesertaState } from "../types";

export const createKontingen = async (
  kontingen: KontingenState,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Mendaftarkan kontingen", true);

    let newKontingen: KontingenState = { ...kontingen };

    newKontingen.id = await getNewDocId("kontingens");
    newKontingen.waktuPendaftaran = Date.now();

    const { error } = await createData("kontingens", newKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Kontingen berhasil didaftarkan");
    return newKontingen;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const updateKontingen = async (
  kontingen: KontingenState,
  toastId?: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Memperbaharui kontingen", true);

    let newKontingen: KontingenState = { ...kontingen };

    newKontingen.waktuPerubahan = Date.now();

    const { error } = await updateData("kontingens", newKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Kontingen berhasil diperbaharui");
    return newKontingen;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const deleteKontingen = async (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  officials: OfficialState[],
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Menghapus kontingen", true);

    if (kontingen.idPembayaran.length)
      throw new Error("Kontingen sudah melakukan pembayaran");

    // DELETE PESERTAS
    if (pesertas.length) {
      controlToast(toastId, "loading", "Menghapus semua peserta");
      await deletePesertas(pesertas);
    }

    // DELETE OFFICIALS
    if (officials.length) {
      controlToast(toastId, "loading", "Menghapus semua official");
      await deleteOfficials(officials);
    }

    // DELETE KONTINGEN
    controlToast(toastId, "loading", "Menghapus kontingen");
    const { error } = await deleteData("kontingens", kontingen.id);

    if (error) throw error;

    // FINISH
    controlToast(toastId, "success", "Kontingen berhasil dihapus");

    return kontingen;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};
