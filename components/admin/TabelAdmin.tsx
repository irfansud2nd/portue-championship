import { AdminContext } from "@/context/AdminContext";
import { dataKontingenInitialValue } from "@/utils/constants";
import TabelPesertaAdmin from "./tabels/TabelPesertaAdmin";
import TabelKontingenAdmin from "./tabels/TabelKontingenAdmin";
import TabelOfficialAdmin from "./tabels/TabelOfficialAdmin";

const TabelAdmin = () => {
  const { mode, setMode, selectedKontingen, setSelectedKontingen, refreshAll } =
    AdminContext();
  return (
    <div className="bg-gray-200 rounded-md p-2">
      <button
        className="btn_green btn_full mb-1"
        onClick={() => {
          setMode("");
          refreshAll();
          setSelectedKontingen(dataKontingenInitialValue);
        }}
      >
        Dashboard
      </button>

      {selectedKontingen.idKontingen && (
        <h1 className="capitalize mb-1 text-3xl font-extrabold p-1 w-fit bg-black text-white">
          Kontingen {selectedKontingen.namaKontingen}
        </h1>
      )}

      {mode == "kontingen" && <TabelKontingenAdmin />}
      {(mode == "peserta" || selectedKontingen.idKontingen) && (
        <TabelPesertaAdmin />
      )}
      {(mode == "official" || selectedKontingen.idKontingen) && (
        <TabelOfficialAdmin />
      )}
    </div>
  );
};
export default TabelAdmin;
