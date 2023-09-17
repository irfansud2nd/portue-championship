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
  sdPerunggu: number,
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
    changePerungguSd,
    changeEmasSmp,
    changePerakSmp,
    changePerungguSmp,
    disable,
  }: {
    kontingens: KontingenScore;
    changeEmasSd: AddScore;
    changePerakSd: AddScore;
    changePerungguSd: AddScore;
    changeEmasSmp: AddScore;
    changePerakSmp: AddScore;
    changePerungguSmp: AddScore;
    disable: boolean;
  } = ScoringContext();

  const toastId = useRef(null);

  return (
    <div>
      <ToastContainer />
      <table className="w-full">
        <thead>
          <tr>
            <th>Nama Kontingen</th>
            <th>SD Emas</th>
            <th>SD Perak</th>
            <th>SD Perunggu</th>
            <th>SMP Emas</th>
            <th>SMP Perak</th>
            <th>SMP Perunggu</th>
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                        changePerungguSd(
                          toastId,
                          kontingens.documentId,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.sdPerunggu,
                          kontingen.smpEmas,
                          kontingen.smpPerak,
                          kontingen.smpPerunggu
                        )
                      }
                    >
                      <BsPlusLg />
                    </button>
                    <span className="font-bold">{kontingen.sdPerunggu}</span>
                    <button
                      disabled={disable}
                      className="btn_red btn_full"
                      onClick={() =>
                        changePerungguSd(
                          toastId,
                          kontingens.documentId,
                          kontingen.idKontingen,
                          kontingen.namaKontingen,
                          kontingen.sdEmas,
                          kontingen.sdPerak,
                          kontingen.sdPerunggu,
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
                {/* SMP */}
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
                          kontingen.sdPerunggu,
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
