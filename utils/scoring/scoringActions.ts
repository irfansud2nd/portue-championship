"use server";

import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { ServerAction, ToastId } from "../constants";
import { action, fetchData } from "../functions";
import { KontingenScore, reduceKontingens } from "./scoringFunctions";
import { firestore } from "../firebase";
import { User } from "firebase/auth";
import { createData, getNewDocId } from "../actions";
import { getAllKontingens } from "../kontingen/kontingenActions";

export const getKontingenScores = async (): Promise<
  ServerAction<KontingenScore[]>
> => {
  try {
    let result: KontingenScore[] = [];
    const response = await getDocs(
      query(
        collection(firestore, "kontingenScores"),
        where("visible", "==", true)
      )
    );

    response.forEach((doc) => result.push(doc.data() as KontingenScore));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const getPartai = async (): Promise<ServerAction<any[]>> => {
  try {
    let result: any = [];
    const response = await getDocs(collection(firestore, "gelanggangs"));

    response.forEach((doc) => result.push(doc.data()));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const writeAllKontingen = async (
  user: User
): Promise<ServerAction<any>> => {
  let kontingens: any[] = [];
  let initialKontingenScore: {
    idKontingen: string;
    namaKontingen: string;
    sdEmas: number;
    sdPerak: number;
    smpEmas: number;
    smpPerak: number;
    smpPerunggu: number;
    smaEmas: number;
    smaPerak: number;
    smaPerunggu: number;
    dewasaEmas: number;
    dewasaPerak: number;
    dewasaPerunggu: number;
  }[] = [];
  try {
    const id = await getNewDocId("kontingenScores");
    const kontingens = await fetchData(() => getAllKontingens());

    let reducedKontingens = reduceKontingens(kontingens);

    reducedKontingens = reducedKontingens.map((kontingen: any) => {
      initialKontingenScore.push({
        idKontingen: kontingen.id,
        namaKontingen: kontingen.namaKontingen,
        sdEmas: 0,
        sdPerak: 0,
        smpEmas: 0,
        smpPerak: 0,
        smpPerunggu: 0,
        smaEmas: 0,
        smaPerak: 0,
        smaPerunggu: 0,
        dewasaEmas: 0,
        dewasaPerak: 0,
        dewasaPerunggu: 0,
      });
    });

    const { result, error } = await createData("kontingenScores", {
      visible: true,
      backup: false,
      id: id,
      userUid: user.uid,
      userEmail: user.email,
      scores: initialKontingenScore,
    });

    if (error) throw error;

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const getKontingensScoreByCreator = async (
  email: string
): Promise<ServerAction<any>> => {
  try {
    let result: KontingenScore | null = null;

    const response = await getDocs(
      query(
        collection(firestore, "kontingenScores"),
        where("userEmail", "==", email)
      )
    );

    response.forEach((doc) => (result = doc.data() as KontingenScore));

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};
