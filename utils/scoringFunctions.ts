import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { getAllKontingen } from "./adminFunctions";
import { DataKontingenState } from "./types";
import { User } from "firebase/auth";

export type KontingenScore = {
  documentId: string;
  userUid: string;
  userEmail: string;
  scores: {
    idKontingen: string;
    namaKontingen: string;
    sdEmas: number;
    sdPerak: number;
    smpEmas: number;
    smpPerak: number;
    smpPerunggu: number;
  }[];
};

export const getKontingens = async (uid: string) => {
  try {
    let result: DocumentData | KontingenScore | null = null;
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "kontingenScores"),
        where("userUid", "==", uid)
      )
    );
    querySnapshot.forEach(
      (doc) => (result = { ...doc.data(), documentId: doc.id })
    );
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data kontingen, ${error}`);
  }
};

export const writeAllKontingen = async (user: User) => {
  let kontingens: any[] = [];
  let initialKontingenScore: {
    idKontingen: string;
    namaKontingen: string;
    sdEmas: number;
    sdPerak: number;
    smpEmas: number;
    smpPerak: number;
    smpPerunggu: number;
  }[] = [];
  getAllKontingen()
    .then((res: any) => {
      kontingens = res;
    })
    .catch((error) => alert(error))
    .finally(() => {
      kontingens.map((kontingen: DataKontingenState) => {
        initialKontingenScore.push({
          idKontingen: kontingen.idKontingen,
          namaKontingen: kontingen.namaKontingen,
          sdEmas: 0,
          sdPerak: 0,
          smpEmas: 0,
          smpPerak: 0,
          smpPerunggu: 0,
        });
      });
      addDoc(collection(firestore, "kontingenScores"), {
        userUid: user.uid,
        userEmail: user.email,
        scores: initialKontingenScore,
      });
    });
};