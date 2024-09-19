"use server";

import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { ServerAction } from "../constants";
import { action, fetchData } from "../functions";
import { firestore } from "../firebase";

type DocType = "keteranganSehat" | "rekomendasi" | "rapot" | "kartuKeluarga";
type Tingkatan = "SD" | "SMP" | "SMA" | "Dewasa";

export const getVerifiedCountByDocType = async (
  docType: DocType
): Promise<ServerAction<number>> => {
  try {
    const response = await getCountFromServer(
      query(collection(firestore, "pesertas"), where(docType, "==", true))
    );

    return action.success(response.data().count);
  } catch (error) {
    return action.error(error);
  }
};

export const getAllVerifedDocCount = async (): Promise<
  ServerAction<{
    keteranganSehat: number;
    rekomendasi: number;
    rapot: number;
    kartuKeluarga: number;
  }>
> => {
  try {
    let result = {
      keteranganSehat: 0,
      rekomendasi: 0,
      rapot: 0,
      kartuKeluarga: 0,
    };

    result.keteranganSehat = await fetchData(() =>
      getVerifiedCountByDocType("keteranganSehat")
    );

    result.rekomendasi = await fetchData(() =>
      getVerifiedCountByDocType("rekomendasi")
    );

    result.rapot = await fetchData(() => getVerifiedCountByDocType("rapot"));

    result.kartuKeluarga = await fetchData(() =>
      getVerifiedCountByDocType("kartuKeluarga")
    );

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};

export const getVerifiedCountByTingkatan = async (
  tingkatan: Tingkatan
): Promise<
  ServerAction<{
    rekomendasi: number;
    keteranganSehat: number;
    kartuKeluarga: number;
    rapot: number;
  }>
> => {
  let level: string[] = [tingkatan];
  if (tingkatan == "SD") level = ["SD I", "SD II"];

  let result = {
    rekomendasi: 0,
    keteranganSehat: 0,
    kartuKeluarga: 0,
    rapot: 0,
  };
  try {
    // KETERANGAN SEHAT
    const ketSehatResponse = await getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("tingkatanPertandingan", "in", level),
        where("keteranganSehat", "==", true)
      )
    );
    result.keteranganSehat = ketSehatResponse.data().count;

    // REKOMENDASI
    const rekomendasiResponse = await getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("tingkatanPertandingan", "in", level),
        where("rekomendasi", "==", true)
      )
    );
    result.rekomendasi = rekomendasiResponse.data().count;

    // KARTU KELUARGA
    if (tingkatan == "SMA" || tingkatan == "Dewasa") {
      const kkResponse = await getCountFromServer(
        query(
          collection(firestore, "pesertas"),
          where("tingkatanPertandingan", "in", level),
          where("kartuKeluarga", "==", true)
        )
      );
      result.kartuKeluarga = kkResponse.data().count;
    }

    // RAPOT
    if (tingkatan == "SMA") {
      const rapotResponse = await getCountFromServer(
        query(
          collection(firestore, "pesertas"),
          where("tingkatanPertandingan", "in", level),
          where("rapot", "==", true)
        )
      );
      result.rapot = rapotResponse.data().count;
    }

    return action.success(result);
  } catch (error) {
    return action.error(error);
  }
};
