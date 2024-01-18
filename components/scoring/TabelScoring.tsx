"use client";

import { ScoringContext } from "@/context/ScoringContext";
import { KontingenScore } from "@/utils/scoringFunctions";
import { compare } from "@/utils/sharedFunctions";
import { useRef } from "react";
import { BsPlusLg } from "react-icons/bs";
import { HiMiniMinus } from "react-icons/hi2";
import { Id } from "react-toastify";

type Props = {
  label: string;
  medalis: string[];
};
const TabelScoring = ({ label, medalis }: Props) => {
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
      tipeMedali: string,
      desc?: boolean
    ) => void;
    disable: boolean;
    value: number;
    setValue: any;
  } = ScoringContext();

  const toastId = useRef(null);

  const getTotal = (medali: string) => {
    let total = 0;
    kontingens.scores.map((score: any) => {
      total += score[medali];
    });
    return total;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">
        REKAPITULASI PEROLEHAN MEDALI {label}
      </h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Emas</th>
            <th>Perak</th>
            {medalis.length > 2 && <th>Perunggu</th>}
          </tr>
        </thead>
        <tbody>
          {kontingens.scores
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen: any, i: number) => (
              <tr
                key={kontingen.idKontingen}
                className={`${
                  kontingen.namaKontingen.includes("copy") && "text-red-500"
                }`}
              >
                <td>{i + 1}</td>
                <td>{kontingen.namaKontingen.toUpperCase()}</td>
                {medalis.map((medali) => (
                  <td>
                    <div className="flex gap-2">
                      <button
                        disabled={disable}
                        className="btn_green btn_full"
                        onClick={() =>
                          changeMedali(
                            toastId,
                            kontingens.id,
                            kontingen.idKontingen,
                            kontingen.namaKontingen,
                            kontingen.sdEmas,
                            kontingen.sdPerak,
                            kontingen.smpEmas,
                            kontingen.smpPerak,
                            kontingen.smpPerunggu,
                            kontingen.smaEmas,
                            kontingen.smaPerak,
                            kontingen.smaPerunggu,
                            kontingen.dewasaEmas,
                            kontingen.dewasaPerak,
                            kontingen.dewasaPerunggu,
                            medali
                          )
                        }
                      >
                        <BsPlusLg />
                      </button>
                      <span className="font-bold">{kontingen[medali]}</span>
                      <button
                        disabled={disable}
                        className="btn_red btn_full"
                        onClick={() =>
                          changeMedali(
                            toastId,
                            kontingens.id,
                            kontingen.idKontingen,
                            kontingen.namaKontingen,
                            kontingen.sdEmas,
                            kontingen.sdPerak,
                            kontingen.smpEmas,
                            kontingen.smpPerak,
                            kontingen.smpPerunggu,
                            kontingen.smaEmas,
                            kontingen.smaPerak,
                            kontingen.smaPerunggu,
                            kontingen.dewasaEmas,
                            kontingen.dewasaPerak,
                            kontingen.dewasaPerunggu,
                            medali,
                            true
                          )
                        }
                      >
                        <HiMiniMinus />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          <tr>
            <td className="font-bold" colSpan={2}>
              Total
            </td>
            {medalis.map((medali) => (
              <td>{getTotal(medali)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TabelScoring;
