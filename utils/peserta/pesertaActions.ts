"use server";

import {
  DocumentData,
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ServerAction } from "../constants";
import { PesertaState } from "../types";
import { firestore } from "../firebase";
import { action } from "../functions";

export const getPesertasByEmail = async (
  userEmail: string
): Promise<ServerAction<PesertaState[]>> => {
  try {
    let result: DocumentData | PesertaState[] | [] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "pesertas"),
        where("creatorEmail", "==", userEmail)
      )
    );

    querySnapshot.forEach((doc) => result.push(doc.data()));

    return action.success(result as PesertaState[]);
  } catch (error) {
    return action.error(error);
  }
};

export const countMatch = async (
  tingkatan: string,
  kategori: string,
  jenisKelamin: string
): Promise<ServerAction<number>> => {
  let result: number = 0;

  try {
    const response = await getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("tingkatanPertandingan", "==", tingkatan),
        where("kategoriPertandingan", "==", kategori),
        where("jenisKelamin", "==", jenisKelamin)
      )
    );
    result = response.data().count;
    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const getPesertasByIdPembayaran = async (
  idPembayaran: string
): Promise<ServerAction<PesertaState[]>> => {
  try {
    let result: PesertaState[] = [];
    const response = await getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", idPembayaran)
      )
    );
    response.forEach((doc) => result.push(doc.data() as PesertaState));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const getAllPesertas = async (): Promise<
  ServerAction<PesertaState[]>
> => {
  try {
    let result: PesertaState[] = [];

    const response = await getDocs(collection(firestore, "pesertas"));
    response.forEach((doc) => result.push(doc.data() as PesertaState));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};
