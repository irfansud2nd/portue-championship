"use server";

import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { ServerAction } from "../constants";
import { action } from "../functions";
import { OfficialState } from "../types";

// GET OFFICIAL
export const getOfficialsByEmail = async (
  email: string
): Promise<ServerAction<OfficialState[]>> => {
  try {
    let result: DocumentData | OfficialState[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "officials"),
        where("creatorEmail", "==", email)
      )
    );
    querySnapshot.forEach((doc) => result.push(doc.data()));

    return action.success(result as OfficialState[]);
  } catch (error) {
    return action.error(error);
  }
};

export const getAllOfficials = async (): Promise<
  ServerAction<OfficialState[]>
> => {
  try {
    let result: OfficialState[] = [];

    const response = await getDocs(collection(firestore, "officials"));
    response.forEach((doc) => result.push(doc.data() as OfficialState));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};
