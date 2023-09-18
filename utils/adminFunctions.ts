// DATA FETCHER - START

import { DocumentData, collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "./types";

// GET KONTINGEN
export const getAllKontingen = async () => {
  try {
    let result: DocumentData | DataKontingenState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "kontingens"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data kontingen, ${error.code}`);
  }
};

// GET OFFICIALS
export const getAllOfficial = async () => {
  try {
    let result: DocumentData | DataOfficialState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "officials"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data official, ${error.code}`);
  }
};

// GET PESERTAS
export const getAllPeserta = async () => {
  try {
    let result: DocumentData | DataPesertaState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "pesertas"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data peserta, ${error.code}`);
  }
};
// DATA FETCHER - END

// DATA FETCHER BY ID KONTINGEN - START
export const getPesertasByKontingen = (
  idKontingen: string,
  pesertas: DataPesertaState[]
) => {
  let result: DataPesertaState[] = [];

  pesertas.map((peserta) => {
    if (peserta.idKontingen == idKontingen) result.push(peserta);
  });

  return result;

  //   try {
  //     let result: DocumentData | DataPesertaState[] | [] = [];
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(firestore, "pesertas"),
  //         where("idKontingen", "==", idKontingen)
  //       )
  //     );
  //     querySnapshot.forEach((doc) => result.push(doc.data()));
  //     return result;
  //   } catch (error: any) {
  //     throw new Error(`Gagal mendapatkan data peserta, ${error.code}`);
  //   }
};
export const getOfficialsByKontingen = (
  idKontingen: string,
  officials: DataOfficialState[]
) => {
  let result: DataOfficialState[] = [];

  officials.map((official) => {
    if (official.idKontingen == idKontingen) result.push(official);
  });

  return result;

  //   try {
  //     let result: DocumentData | DataPesertaState[] | [] = [];
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(firestore, "pesertas"),
  //         where("idKontingen", "==", idKontingen)
  //       )
  //     );
  //     querySnapshot.forEach((doc) => result.push(doc.data()));
  //     return result;
  //   } catch (error: any) {
  //     throw new Error(`Gagal mendapatkan data peserta, ${error.code}`);
  //   }
};

// DATA FETCHER BY ID KONTINGEN - END

export const getKontingenUnpaid = (
  kontingen: DataKontingenState,
  pesertas: DataPesertaState[]
) => {
  let paidNominal = 0;

  kontingen.infoPembayaran.map((info) => {
    paidNominal += Math.floor(
      Number(info.nominal.replace(/[^0-9]/g, "")) / 1000
    );
  });

  const filteredPesertas = getPesertasByKontingen(
    kontingen.idKontingen,
    pesertas
  );
  let nominalToPay = filteredPesertas.length * 300000;

  return nominalToPay - paidNominal * 1000;
};

export const formatTanggal = (
  tgl: string | number | undefined,
  withHour?: boolean
) => {
  if (tgl) {
    const date = new Date(tgl);
    if (withHour) {
      return `${date.getDate()} ${date.toLocaleString("id", {
        month: "short",
      })}, ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
    } else {
      return `${date.getDate()} ${date.toLocaleString("id", {
        month: "short",
      })}, ${date.getFullYear()}`;
    }
  } else {
    return "-";
  }
};

// FIND NAMA KONTINGEN
export const findNamaKontingen = (
  dataKontingen: DataKontingenState[],
  idKontingen: string
) => {
  const index = dataKontingen.findIndex(
    (kontingen) => kontingen.idKontingen == idKontingen
  );
  return dataKontingen[index]
    ? dataKontingen[index].namaKontingen
    : "kontingen not found";
};
