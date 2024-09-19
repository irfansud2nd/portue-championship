import { KontingenState } from "../types";
import { User } from "firebase/auth";

export type KontingenScore = {
  documentId: string;
  id: string;
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
    smaEmas: number;
    smaPerak: number;
    smaPerunggu: number;
    dewasaEmas: number;
    dewasaPerak: number;
    dewasaPerunggu: number;
  }[];
};

export const reduceKontingens = (array: any[]) => {
  const seen: any = [];
  const result: any = [];
  array.map((item: any) => {
    if (seen.indexOf(item.namaKontingen.toUpperCase().replace(/\s/g, "")) < 0) {
      seen.push(item.namaKontingen.toUpperCase().replace(/\s/g, ""));
      result.push(item);
    } else {
      // result.push({ namaKontingen: `${item.namaKontingen} - copy` });
    }
  });
  // console.log("SEEN", seen);
  // console.log("RESULT", result);
  return result;
};
