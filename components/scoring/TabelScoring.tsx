import { ScoringContext } from "@/context/ScoringContext";
import { KontingenScore } from "@/utils/scoringFunctions";
import { compare } from "@/utils/sharedFunctions";
import { useRef } from "react";
import { BsPlusLg } from "react-icons/bs";
import { HiMiniMinus } from "react-icons/hi2";
import { Id, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AddScore = (
  toastId: React.MutableRefObject<Id | null>,
  documentId: string,
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
    disable,
  }: {
    kontingens: KontingenScore;
    changeEmasSd: AddScore;
    changePerakSd: AddScore;
    changeEmasSmp: AddScore;
    changePerakSmp: AddScore;
    changePerungguSmp: AddScore;
    disable: boolean;
  } = ScoringContext();

  const toastId = useRef(null);

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold">REKAPITULASI PEROLEHAN MEDALI SD</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>Nama Kontingen</th>
            <th>Emas</th>
            <th>Perak</th>
          </tr>
        </thead>
        <tbody>
          {kontingens.scores
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen) => (
              <tr key={kontingen.idKontingen}>
                <td className="uppercase">{kontingen.namaKontingen}</td>
                {/* SD */}
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changeEmasSd(
                          toastId,
                          kontingens.documentId,
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
                          kontingens.documentId,
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
                          kontingens.documentId,
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
                          kontingens.documentId,
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
        </tbody>
      </table>
      <h1 className="text-2xl font-bold mt-2">
        REKAPITULASI PEROLEHAN MEDALI SMP
      </h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>Nama Kontingen</th>
            <th>Emas</th>
            <th>Perak</th>
            <th>Perunggu</th>
          </tr>
        </thead>
        <tbody>
          {kontingens.scores
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen) => (
              <tr>
                {/* SMP */}
                <td className="uppercase">{kontingen.namaKontingen}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      disabled={disable}
                      className="btn_green btn_full"
                      onClick={() =>
                        changeEmasSmp(
                          toastId,
                          kontingens.documentId,
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
                          kontingens.documentId,
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
                          kontingens.documentId,
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
                          kontingens.documentId,
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
                          kontingens.documentId,
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
                          kontingens.documentId,
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
        </tbody>
      </table>
    </div>
  );
};
export default TabelScoring;
