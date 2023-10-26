import { ScoringContext } from "@/context/ScoringContext";
import InlineLoading from "../admin/InlineLoading";
import { KontingenScore } from "@/utils/scoringFunctions";
import TabelScoring from "./TabelScoring";
import JadwalChanger from "../admin/JadwalChanger";

const Scoring = () => {
  const {
    kontingensLoading,
    initializeKontingens,
    initializeLoading,
    refreshKontingens,
  } = ScoringContext();
  const { kontingens }: { kontingens: KontingenScore } = ScoringContext();

  return (
    <div>
      <button
        className="btn_green btn_full mb-1 mr-1"
        onClick={refreshKontingens}
      >
        Refresh
      </button>
      {kontingensLoading && (
        <>
          <InlineLoading /> Refreshing data...
        </>
      )}
      {initializeLoading ? (
        <InlineLoading />
      ) : kontingens ? (
        <>
          <JadwalChanger />
          {/* <TabelScoring /> */}
        </>
      ) : kontingensLoading ? (
        <InlineLoading />
      ) : (
        <button
          className="btn_green btn_full block"
          onClick={initializeKontingens}
        >
          Initialize
        </button>
      )}
    </div>
  );
};
export default Scoring;
