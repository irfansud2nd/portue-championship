"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import {
  KontingenScore,
  getKontingens,
  writeAllKontingen,
} from "@/utils/scoringFunctions";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { Id } from "react-toastify";
import { newToast, updateToast } from "@/utils/sharedFunctions";

const Context = createContext<any>(null);

export const ScoringContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [kontingens, setKontingens] = useState<KontingenScore>();
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [initializeLoading, setInitializeLoading] = useState(false);
  const [value, setValue] = useState(1);
  const [disable, setDisable] = useState(false);

  const { user } = MyContext();

  useEffect(() => {
    if (user) refreshKontingens();
  }, [user]);

  // GET KONTINGEN
  const refreshKontingens = () => {
    setKontingensLoading(true);
    getKontingens(user.uid)
      .then((res: any) => {
        setKontingens(res);
        setKontingensLoading(false);
      })
      .catch((error) => alert(error));
  };

  // INITIALIZE KONTINGENS
  const initializeKontingens = () => {
    setInitializeLoading(true);
    writeAllKontingen(user)
      .then(() => {
        setInitializeLoading(false);
        refreshKontingens();
      })
      .finally(() => refreshKontingens());
  };

  const changeEmasSmp = (
    toastId: React.MutableRefObject<Id | null>,
    id: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    smaEmas: number,
    smaPerak: number,
    smaPerunggu: number,
    dewasaEmas: number,
    dewasaPerak: number,
    dewasaPerunggu: number,
    desc: boolean = false
  ) => {
    newToast(toastId, "loading", "Mengubah Jumlah Medali Emas");
    setDisable(true);
    updateDoc(doc(firestore, "kontingenScores", id), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", id), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak,
            smpEmas: desc ? smpEmas - value : smpEmas + value,
            smpPerak,
            smpPerunggu,
            smaEmas,
            smaPerak,
            smaPerunggu,
            dewasaEmas,
            dewasaPerak,
            dewasaPerunggu,
          }),
        })
          .then(() => {
            updateToast(
              toastId,
              "success",
              "Berhasil Mengubah Jumlah Medali Emas"
            );
            refreshKontingens();
          })
          .catch((error) => alert(`adding - ${error}`))
      )
      .catch((error) => alert(`removing - ${error}`))
      .finally(() => setDisable(false));
  };

  const changePerakSmp = (
    toastId: React.MutableRefObject<Id | null>,
    id: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    smaEmas: number,
    smaPerak: number,
    smaPerunggu: number,
    dewasaEmas: number,
    dewasaPerak: number,
    dewasaPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Perak");
    updateDoc(doc(firestore, "kontingenScores", id), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", id), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak,
            smpEmas,
            smpPerak: desc ? smpPerak - value : smpPerak + value,
            smpPerunggu,
            smaEmas,
            smaPerak,
            smaPerunggu,
            dewasaEmas,
            dewasaPerak,
            dewasaPerunggu,
          }),
        })
          .then(() => {
            updateToast(
              toastId,
              "success",
              "Berhasil Mengubah Jumlah Medali Perak"
            );
            refreshKontingens();
          })
          .catch((error) => alert(`adding - ${error}`))
      )
      .catch((error) => alert(`removing - ${error}`))
      .finally(() => setDisable(false));
  };

  const changePerungguSmp = (
    toastId: React.MutableRefObject<Id | null>,
    id: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    smaEmas: number,
    smaPerak: number,
    smaPerunggu: number,
    dewasaEmas: number,
    dewasaPerak: number,
    dewasaPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Perunggu");
    updateDoc(doc(firestore, "kontingenScores", id), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", id), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak,
            smpEmas,
            smpPerak,
            smpPerunggu: desc ? smpPerunggu - value : smpPerunggu + value,
            smaEmas,
            smaPerak,
            smaPerunggu,
            dewasaEmas,
            dewasaPerak,
            dewasaPerunggu,
          }),
        })
          .then(() => {
            updateToast(
              toastId,
              "success",
              "Berhasil Mengubah Jumlah Medali Perunggu"
            );
            refreshKontingens();
          })
          .catch((error) => alert(`adding - ${error}`))
      )
      .catch((error) => alert(`removing - ${error}`))
      .finally(() => setDisable(false));
  };

  const changeEmasSd = (
    toastId: React.MutableRefObject<Id | null>,
    id: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    smaEmas: number,
    smaPerak: number,
    smaPerunggu: number,
    dewasaEmas: number,
    dewasaPerak: number,
    dewasaPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Emas");
    updateDoc(doc(firestore, "kontingenScores", id), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", id), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas: desc ? sdEmas - value : sdEmas + value,
            sdPerak,
            smpEmas,
            smpPerak,
            smpPerunggu,
            smaEmas,
            smaPerak,
            smaPerunggu,
            dewasaEmas,
            dewasaPerak,
            dewasaPerunggu,
          }),
        })
          .then(() => {
            updateToast(
              toastId,
              "success",
              "Berhasil Mengubah Jumlah Medali Emas"
            );
            refreshKontingens();
          })
          .catch((error) => alert(`adding - ${error}`))
      )
      .catch((error) => alert(`removing - ${error}`))
      .finally(() => setDisable(false));
  };

  const changePerakSd = (
    toastId: React.MutableRefObject<Id | null>,
    id: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    smaEmas: number,
    smaPerak: number,
    smaPerunggu: number,
    dewasaEmas: number,
    dewasaPerak: number,
    dewasaPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Perak");
    updateDoc(doc(firestore, "kontingenScores", id), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", id), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak: desc ? sdPerak - value : sdPerak + value,
            smpEmas,
            smpPerak,
            smpPerunggu,
            smaEmas,
            smaPerak,
            smaPerunggu,
            dewasaEmas,
            dewasaPerak,
            dewasaPerunggu,
          }),
        })
          .then(() => {
            updateToast(
              toastId,
              "success",
              "Berhasil Mengubah Jumlah Medali Perak"
            );
            refreshKontingens();
          })
          .catch((error) => alert(`adding - ${error}`))
      )
      .catch((error) => alert(`removing - ${error}`))
      .finally(() => setDisable(false));
  };

  const changeMedali = (
    toastId: React.MutableRefObject<Id | null>,
    id: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number = 0,
    sdPerak: number = 0,
    smpEmas: number = 0,
    smpPerak: number = 0,
    smpPerunggu: number = 0,
    smaEmas: number = 0,
    smaPerak: number = 0,
    smaPerunggu: number = 0,
    dewasaEmas: number = 0,
    dewasaPerak: number = 0,
    dewasaPerunggu: number = 0,
    tipeMedali:
      | "sdEmas"
      | "sdPerak"
      | "smpEmas"
      | "smpPerak"
      | "smpPerunggu"
      | "smaEmas"
      | "smaPerak"
      | "smaPerunggu"
      | "dewasaEmas"
      | "dewasaPerak"
      | "dewasaPerunggu",
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali");
    updateDoc(doc(firestore, "kontingenScores", id), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", id), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas:
              tipeMedali == "sdEmas"
                ? desc
                  ? sdEmas - value
                  : sdEmas + value
                : sdEmas,
            sdPerak:
              tipeMedali == "sdPerak"
                ? desc
                  ? sdPerak - value
                  : sdPerak + value
                : sdPerak,
            smpEmas:
              tipeMedali == "smpEmas"
                ? desc
                  ? smpEmas - value
                  : smpEmas + value
                : smpEmas,
            smpPerak:
              tipeMedali == "smpPerak"
                ? desc
                  ? smpPerak - value
                  : smpPerak + value
                : smpPerak,
            smpPerunggu:
              tipeMedali == "smpPerunggu"
                ? desc
                  ? smpPerunggu - value
                  : smpPerunggu + value
                : smpPerunggu,
            smaEmas:
              tipeMedali == "smaEmas"
                ? desc
                  ? smaEmas - value
                  : smaEmas + value
                : smaEmas,
            smaPerak:
              tipeMedali == "smaPerak"
                ? desc
                  ? smaPerak - value
                  : smaPerak + value
                : smaPerak,
            smaPerunggu:
              tipeMedali == "smaPerunggu"
                ? desc
                  ? smaPerunggu - value
                  : smaPerunggu + value
                : smaPerunggu,
            dewasaEmas:
              tipeMedali == "dewasaEmas"
                ? desc
                  ? dewasaEmas - value
                  : dewasaEmas + value
                : dewasaEmas,
            dewasaPerak:
              tipeMedali == "dewasaPerak"
                ? desc
                  ? dewasaPerak - value
                  : dewasaPerak + value
                : dewasaPerak,
            dewasaPerunggu:
              tipeMedali == "dewasaPerunggu"
                ? desc
                  ? dewasaPerunggu - value
                  : dewasaPerunggu + value
                : dewasaPerunggu,
          }),
        })
          .then(() => {
            updateToast(toastId, "success", "Berhasil Mengubah Jumlah Medali");
            refreshKontingens();
          })
          .catch((error) => alert(`adding - ${error}`))
      )
      .catch((error) => alert(`removing - ${error}`))
      .finally(() => setDisable(false));
  };

  return (
    <Context.Provider
      value={{
        initializeKontingens,
        initializeLoading,
        kontingens,
        kontingensLoading,
        refreshKontingens,
        changeEmasSmp,
        changePerakSmp,
        changePerungguSmp,
        changeEmasSd,
        changePerakSd,
        changeMedali,
        disable,
        value,
        setValue,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const ScoringContext = () => {
  return useContext(Context);
};
