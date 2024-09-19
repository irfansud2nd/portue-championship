import { deleteFile, updateData } from "../actions";
import { ToastId } from "../constants";
import {
  controlToast,
  getFileUrl,
  reduceData,
  sendFile,
  toastError,
} from "../functions";
import { updateKontingen } from "../kontingen/kontingenFunctions";
import { updatePesertas } from "../peserta/pesertaFunctions";
import { KontingenState, PesertaState } from "../types";

export const createPembayaran = async (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  image: File,
  noHp: string,
  total: number,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Menyimpan pembayaran", true);
    const now = Date.now();
    const id = kontingen.id + "-" + now;

    // UPLOAD IMAGE
    controlToast(toastId, "loading", "Mengunggah bukti pembayaran");
    const { fotoUrl: buktiUrl } = getFileUrl("pembayaran", id);
    const downloadUrl = await sendFile(image, buktiUrl);

    // SEND PEMBAYARAN TO PESERTAS
    controlToast(toastId, "loading", "Menyimpan pembayaran peserta");
    let updatedPesertas: PesertaState[] = pesertas;
    if (pesertas.length) {
      updatedPesertas = pesertas.map((peserta) => {
        let updatedPeserta = { ...peserta };

        updatedPeserta.pembayaran = true;
        updatedPeserta.idPembayaran = id;
        updatedPeserta.infoPembayaran = {
          waktu: now,
          noHp,
          buktiUrl: downloadUrl,
        };

        return updatedPeserta;
      });

      await updatePesertas(updatedPesertas);
    }

    // SEND PEMBAYARAN TO KONTINGEN
    controlToast(toastId, "loading", "Menyimpan pembayaran kontingen");
    let updatedKontingen: KontingenState = { ...kontingen };

    updatedKontingen.idPembayaran.push(id);
    updatedKontingen.unconfirmedPembayaran.push(id);
    updatedKontingen.infoPembayaran.push({
      idPembayaran: id,
      noHp,
      waktu: now,
      buktiUrl: downloadUrl,
      nominal: totalToNominal(total, noHp),
    });

    await updateKontingen(kontingen);

    // FINISH
    controlToast(toastId, "success", "Pembayaran berhasil disimpan");
    return { pesertas: updatedPesertas, kontingen: updatedKontingen };
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const deletePayment = async (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  idPembayaran: string,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Menghapus pembayaran", true);

    // DELETE IMAGE
    controlToast(toastId, "loading", "Menghapus bukti pembayaran");
    await deleteFile(getFileUrl("pembayaran", idPembayaran).fotoUrl);

    // UNPAID PESERTAS
    if (pesertas.length) {
      controlToast(toastId, "loading", "Membatalkan pembayaran peserta");
      await unpaidPesertas(pesertas);
    }

    // UNPAID KONTINGEN
    controlToast(toastId, "loading", "Membatalkan pembayaran kontingen");
    let updatedKontingen: KontingenState = { ...kontingen };

    updatedKontingen.idPembayaran = updatedKontingen.idPembayaran.filter(
      (item) => item != idPembayaran
    );

    updatedKontingen.unconfirmedPembayaran =
      updatedKontingen.unconfirmedPembayaran.filter(
        (item) => item != idPembayaran
      );

    updatedKontingen.infoPembayaran = updatedKontingen.infoPembayaran.filter(
      (item) => item.idPembayaran !== idPembayaran
    );

    await updateKontingen(updatedKontingen);

    // FINISH
    controlToast(toastId, "success", "Pembayaran berhasil dibatalkan");
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const totalToNominal = (total: number, noHp: string) => {
  return `Rp. ${(total / 1000).toLocaleString("id")}.${noHp
    .split("")
    .slice(-3)
    .join("")}`;
};

export const confirmPayment = async (
  infoPembayaran: {
    idPembayaran: string;
    noHp: string;
    waktu: number;
    buktiUrl: string;
    nominal: string;
  },
  kontingen: KontingenState,
  pesertas: {
    toConfirm: PesertaState[];
    toUnpaid: PesertaState[];
  },
  nominalToConfirm: string,
  user: any,
  toastId: ToastId
) => {
  const now = Date.now();

  try {
    controlToast(toastId, "loading", "Mengkonfirmasi pembayaran", true);

    // CONFIRM PAYMENT ON PESERTAS
    if (pesertas.toConfirm.length) {
      controlToast(toastId, "loading", "Mengkonfirmasi pembayaran peserta");

      const confirmPesertas = pesertas.toConfirm.map(async (peserta) => {
        let data: PesertaState = { ...peserta };

        data.confirmedPembayaran = true;
        data.infoKonfirmasi = {
          nama: user.displayName,
          email: user.email,
          waktu: now,
        };

        const { error } = await updateData("pesertas", data);

        if (error) throw error;
      });

      await Promise.all(confirmPesertas);
    }

    // DELETE PAYMENT ON PESERTAS
    if (pesertas.toUnpaid.length) {
      controlToast(toastId, "loading", "Membatalkan pembayaran peserta");
      await unpaidPesertas(pesertas.toUnpaid);
    }

    // CONFIRM PAYMENT ON KONTINGEN
    controlToast(toastId, "loading", "Mengkonfirmasi pembayaran kontingen");
    let updatedKontingen: KontingenState = { ...kontingen };

    updatedKontingen.confirmedPembayaran.push(infoPembayaran.idPembayaran);

    updatedKontingen.unconfirmedPembayaran =
      updatedKontingen.unconfirmedPembayaran.filter(
        (item) => item != infoPembayaran.idPembayaran
      );

    updatedKontingen.infoKonfirmasi.push({
      idPembayaran: infoPembayaran.idPembayaran,
      nama: user.displayName,
      email: user.email,
      waktu: now,
    });

    updatedKontingen.infoPembayaran = reduceData(
      [
        ...updatedKontingen.infoPembayaran,
        { ...infoPembayaran, nominal: nominalToConfirm },
      ],
      "idPembayaran"
    );

    const { error } = await updateData("kontingens", updatedKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Pembayaran berhasil diKonfirmasi");
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const unconfirmPayment = async (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  idPembayaran: string,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Membatalkan konfirmasi", true);

    // UNCONFIRM PAYMENT ON PESERTAS
    if (pesertas.length) {
      controlToast(
        toastId,
        "loading",
        "Membatalkan konfirmasi pembayaran peserta"
      );

      const unconfirmPesertas = pesertas.map(async (peserta) => {
        let data: PesertaState = { ...peserta };

        data.confirmedPembayaran = false;
        data.infoKonfirmasi = {
          nama: "",
          email: "",
          waktu: 0,
        };

        const { error } = await updateData("pesertas", data);

        if (error) throw error;
      });

      await Promise.all(unconfirmPesertas);
    }

    // CONFIRM PAYMENT ON KONTINGEN
    controlToast(
      toastId,
      "loading",
      "Membatalkan konfirmasi pembayaran kontingen"
    );
    let updatedKontingen: KontingenState = { ...kontingen };

    updatedKontingen.confirmedPembayaran =
      updatedKontingen.confirmedPembayaran.filter(
        (item) => item != idPembayaran
      );

    updatedKontingen.unconfirmedPembayaran.push(idPembayaran);

    updatedKontingen.infoKonfirmasi = updatedKontingen.infoKonfirmasi.filter(
      (item) => item.idPembayaran != idPembayaran
    );

    const { error } = await updateData("kontingens", updatedKontingen);
    if (error) throw error;

    // FINISH
    controlToast(toastId, "success", "Pembayaran berhasil diKonfirmasi");
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const unpaidPesertas = async (pesertas: PesertaState[]) => {
  try {
    const promises = pesertas.map(async (peserta) => {
      let updatedPeserta: PesertaState = { ...peserta };

      updatedPeserta.idPembayaran = "";
      updatedPeserta.pembayaran = false;
      updatedPeserta.infoPembayaran = {
        noHp: "",
        waktu: 0,
        buktiUrl: "",
      };

      const { error } = await updateData("pesertas", updatedPeserta);
      if (error) throw error;
    });

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

export const getInfoPembayaran = (
  kontingen: KontingenState,
  idPembayaran: string
) => {
  return kontingen.infoPembayaran.find(
    (item) => item.idPembayaran == idPembayaran
  );
};
