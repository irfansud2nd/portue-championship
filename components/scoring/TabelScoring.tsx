import { ScoringContext } from "@/context/ScoringContext";
import { KontingenScore } from "@/utils/scoringFunctions";
import { compare } from "@/utils/sharedFunctions";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { BsPlusLg } from "react-icons/bs";
import { HiMiniMinus } from "react-icons/hi2";
import { Id, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const TabelScoring = () => {
  const {
    kontingens,
    changeEmasSd,
    changePerakSd,
    changeEmasSmp,
    changePerakSmp,
    changePerungguSmp,
    changeMedali,
    disable,
    value,
    setValue,
  }: {
    kontingens: KontingenScore;
    changeEmasSd: AddScore;
    changePerakSd: AddScore;
    changeEmasSmp: AddScore;
    changePerakSmp: AddScore;
    changePerungguSmp: AddScore;
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

  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: `Tabel Scoring ${kontingens.userEmail} - ${kontingens.id}`,
  });

  return (
    <div>
      <ToastContainer />
      {/* <button className="btn_green btn_full" onClick={onDownload}>
        Download
      </button> */}
      {/* <h1 className="text-2xl font-bold">REKAPITULASI PEROLEHAN MEDALI SD</h1> */}
      {/* <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Emas</th>
            <th>Perak</th>
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
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changeEmasSd(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.sdEmas}</span>
                    <button
                      disabled={disable}
                      className="btn_red btn_full"
                      onClick={() =>
                        changeEmasSd(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu,
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changePerakSd(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.sdPerak}</span>
                    <button
                      disabled={disable}
                      className="btn_red btn_full"
                      onClick={() =>
                        changePerakSd(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu,
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          <tr>
            <td className="font-bold" colSpan={2}>
              Total
            </td>
            <td>{getTotal().sdEmas}</td>
            <td>{getTotal().sdPerak}</td>
          </tr>
        </tbody>
      </table> */}
      {/* SMP */}
      {/* <h1 className="text-2xl font-bold mt-2">
        REKAPITULASI PEROLEHAN MEDALI SMP
      </h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Value</th>
            <th>Emas</th>
            <th>Perak</th>
            <th>Perunggu</th>
          </tr>
        </thead>
        <tbody>
          {kontingens.scores
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen, i) => (
              <tr key={kontingen.idKontingen}>
                <td className="uppercase">{kontingen.namaKontingen}</td>
                <td>
                  <input
                    type="text"
                    onChange={(e) => setValue(Number(e.target.value))}
                  />
                  <p>Value {value}</p>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changeEmasSmp(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.smpEmas}</span>
                    <button
                      disabled={disable}
                      className="btn_red btn_full"
                      onClick={() =>
                        changeEmasSmp(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu,
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changePerakSmp(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.smpPerak}</span>
                    <button
                      disabled={disable}
                      className="btn_red btn_full"
                      onClick={() =>
                        changePerakSmp(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu,
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changePerungguSmp(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.smpPerunggu}</span>
                    <button
                      disabled={disable}
                      className="btn_red btn_full"
                      onClick={() =>
                        changePerungguSmp(
                          toastId,
                          kontingens.id,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu,
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          <tr>
            <td className="font-bold" colSpan={2}>
              Total
            </td>
            <td>{getTotal().smpEmas}</td>
            <td>{getTotal().smpPerak}</td>
            <td>{getTotal().smpPerunggu}</td>
          </tr>
        </tbody>
      </table> */}
      {/* SMA */}
      {/* <h1 className="text-2xl font-bold mt-2">
        REKAPITULASI PEROLEHAN MEDALI SMA
      </h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Value</th>
            <th>Emas</th>
            <th>Perak</th>
            <th>Perunggu</th>
          </tr>
        </thead>
        <tbody>
          {kontingens.scores
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen, i) => (
              <tr key={kontingen.idKontingen}>
                <td>{i + 1}</td>
                <td className="uppercase">{kontingen.namaKontingen}</td>
                <td>
                  <input
                    type="text"
                    onChange={(e) => setValue(Number(e.target.value))}
                  />
                  <p>Value {value}</p>
                </td>
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
                          "smaEmas"
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.smaEmas}</span>
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
                          "smaEmas",
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
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
                          "smaPerak"
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.smaPerak}</span>
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
                          "smaPerak",
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
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
                          "smaPerunggu"
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.smaPerunggu}</span>
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
                          "smaPerunggu",
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          <tr>
            <td className="font-bold" colSpan={2}>
              Total
            </td>
            <td>{getTotal().smpEmas}</td>
            <td>{getTotal().smpPerak}</td>
            <td>{getTotal().smpPerunggu}</td>
          </tr>
        </tbody>
      </table> */}
      {/* DEWASA */}
      <h1 className="text-2xl font-bold mt-2">
        REKAPITULASI PEROLEHAN MEDALI DEWASA
      </h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Value</th>
            <th>Emas</th>
            <th>Perak</th>
            <th>Perunggu</th>
          </tr>
        </thead>
        <tbody>
          {kontingens.scores
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen, i) => (
              <tr key={kontingen.idKontingen}>
                {/* SMP */}
                <td>{i + 1}</td>
                <td className="uppercase">{kontingen.namaKontingen}</td>
                <td>
                  <input
                    type="text"
                    onChange={(e) => setValue(Number(e.target.value))}
                  />
                  <p>Value {value}</p>
                </td>
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
                          "dewasaEmas"
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.dewasaEmas}</span>
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
                          "dewasaEmas",
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
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
                          "dewasaPerak"
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.dewasaPerak}</span>
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
                          "dewasaPerak",
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
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
                          "dewasaPerunggu"
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">
                      {kontingen.dewasaPerunggu}
                    </span>
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
                          "dewasaPerunggu",
                          true
                        )
                      }
                    >
                      <HiMiniMinus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          <tr>
            <td className="font-bold" colSpan={2}>
              Total
            </td>
            <td>{getTotal().smpEmas}</td>
            <td>{getTotal().smpPerak}</td>
            <td>{getTotal().smpPerunggu}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TabelScoring;
