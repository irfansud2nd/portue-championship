"use server";
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ServerAction } from "../constants";
import { KontingenState } from "../types";
import { firestore } from "../firebase";
import { action } from "../functions";

export const managePersonOnKontingen = async (
  kontingen: KontingenState,
  type: "peserta" | "official",
  personId: string,
  remove: boolean = false
): Promise<ServerAction<KontingenState>> => {
  try {
    let updatedKontingen = { ...kontingen };
    const key: "pesertas" | "officials" = `${type}s`;

    if (remove) {
      updatedKontingen[key] = updatedKontingen[key].filter(
        (item) => item != personId
      );
    } else {
      updatedKontingen[key] = [...updatedKontingen[key], personId];
    }

    await updateDoc(
      doc(firestore, "kontingens", kontingen.id),
      updatedKontingen
    );

    return action.success(updatedKontingen);
  } catch (error) {
    return action.error(error);
  }
};

// GET KONTINGEN
export const getKontingenByEmail = async (
  email: string
): Promise<ServerAction<KontingenState>> => {
  try {
    let result: any;
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "kontingens"),
        where("creatorEmail", "==", email)
      )
    );
    querySnapshot.forEach((doc) => (result = doc.data()));

    return action.success(result as KontingenState);
  } catch (error) {
    return action.error(error);
  }
};

export const getKontingenByIdPembayaran = async (
  idPembayaran: string
): Promise<ServerAction<KontingenState | undefined>> => {
  try {
    let result: KontingenState | undefined = undefined;
    const response = await getDocs(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "array-contains", idPembayaran)
      )
    );

    response.forEach((doc) => (result = doc.data() as KontingenState));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const getAllKontingens = async (): Promise<
  ServerAction<KontingenState[]>
> => {
  try {
    let result: KontingenState[] = [];

    const response = await getDocs(collection(firestore, "kontingens"));
    response.forEach((doc) => result.push(doc.data() as KontingenState));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};
