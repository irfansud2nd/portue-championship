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
    documentId: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    desc: boolean = false
  ) => {
    newToast(toastId, "loading", "Mengubah Jumlah Medali Emas");
    setDisable(true);
    updateDoc(doc(firestore, "kontingenScores", documentId), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", documentId), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak,
            smpEmas: desc ? smpEmas - 1 : smpEmas + 1,
            smpPerak,
            smpPerunggu,
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
    documentId: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Perak");
    updateDoc(doc(firestore, "kontingenScores", documentId), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,

        smpEmas,
        smpPerak,
        smpPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", documentId), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak,

            smpEmas,
            smpPerak: desc ? smpPerak - 1 : smpPerak + 1,
            smpPerunggu,
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
    documentId: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Perunggu");
    updateDoc(doc(firestore, "kontingenScores", documentId), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,

        smpEmas,
        smpPerak,
        smpPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", documentId), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak,
            smpEmas,
            smpPerak,
            smpPerunggu: desc ? smpPerunggu - 1 : smpPerunggu + 1,
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
  // ADD EMAS
  const changeEmasSd = (
    toastId: React.MutableRefObject<Id | null>,
    documentId: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Emas");
    updateDoc(doc(firestore, "kontingenScores", documentId), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,

        smpEmas,
        smpPerak,
        smpPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", documentId), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas: desc ? sdEmas - 1 : sdEmas + 1,
            sdPerak,

            smpEmas,
            smpPerak,
            smpPerunggu,
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
    documentId: string,
    idKontingen: string,
    namaKontingen: string,
    sdEmas: number,
    sdPerak: number,
    smpEmas: number,
    smpPerak: number,
    smpPerunggu: number,
    desc: boolean = false
  ) => {
    setDisable(true);
    newToast(toastId, "loading", "Mengubah Jumlah Medali Perak");
    updateDoc(doc(firestore, "kontingenScores", documentId), {
      scores: arrayRemove({
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
      }),
    })
      .then(() =>
        updateDoc(doc(firestore, "kontingenScores", documentId), {
          scores: arrayUnion({
            idKontingen,
            namaKontingen,
            sdEmas,
            sdPerak: desc ? sdPerak - 1 : sdPerak + 1,
            smpEmas,
            smpPerak,
            smpPerunggu,
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
        disable,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const ScoringContext = () => {
  return useContext(Context);
};
