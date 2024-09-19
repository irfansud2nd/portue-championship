import { ScoringContext } from "@/context/ScoringContext";
import { KontingenScore } from "@/utils/scoring/scoringFunctions";
import { compare } from "@/utils/functions";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { BsPlusLg } from "react-icons/bs";
import { HiMiniMinus } from "react-icons/hi2";
import { Id, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabelScoring from "./TabelScoring";

type AddScore = (
  toastId: React.MutableRefObject<Id | null>,
  id: string,
  idKontingen: string,
  namaKontingen: string,
  sdEmas: number,
  sdPerak: number,
  smpEmas: number,
  smpPerak: number,
  smpPerunggu: number,
  desc?: boolean
) => void;

const TabelScorings = () => {
  const {
    kontingens,
    changeMedali,
    disable,
    value,
    setValue,
  }: {
    kontingens: KontingenScore;
    changeMedali: (
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
      desc?: boolean
    ) => void;
    disable: boolean;
    value: number;
    setValue: any;
  } = ScoringContext();

  const toastId = useRef(null);

  const getTotal = () => {
    let sdEmas = 0;
    let sdPerak = 0;
    let smpEmas = 0;
    let smpPerak = 0;
    let smpPerunggu = 0;
    kontingens.scores.map((item) => {
      sdEmas += item.sdEmas;
      sdPerak += item.sdPerak;
      smpEmas += item.smpEmas;
      smpPerak += item.smpPerak;
      smpPerunggu += item.smpPerunggu;
    });

    return {
      sdEmas,
      sdPerak,
      smpEmas,
      smpPerak,
      smpPerunggu,
    };
  };

  const tabelRef = useRef(null);

  return (
    <div>
      <TabelScoring label="SD" medalis={["sdEmas", "sdPerak"]} />
      {/* SMP */}
      <TabelScoring
        label="SMP"
        medalis={["smpEmas", "smpPerak", "smpPerunggu"]}
      />
      {/* SMA */}
      <TabelScoring
        label="SMA"
        medalis={["smaEmas", "smaPerak", "smaPerunggu"]}
      />
      {/* DEWASA */}
      <TabelScoring
        label="DEWASA"
        medalis={["dewasaEmas", "dewasaPerak", "dewasaPerunggu"]}
      />
    </div>
  );
};
export default TabelScorings;
