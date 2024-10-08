import { AdminContext } from "@/context/AdminContext";
import { dataKontingenInitialValue } from "@/utils/constants";
import TabelPesertaAdmin from "./tabels/TabelPesertaAdmin";
import TabelKontingenAdmin from "./tabels/TabelKontingenAdmin";
import TabelOfficialAdmin from "./tabels/TabelOfficialAdmin";
import CustomTabel from "./tabels/CustomTabel";
import TabelPembayaran from "./tabels/TabelPembayaran";

const TabelAdmin = () => {
  const {
    mode,
    setMode,
    selectedKontingen,
    setSelectedKontingen,
    setSelectedKategori,
    setSelectedPesertas,
    setSelectedOfficials,
    setUncofirmedKontingens,
    setCofirmedKontingens,
  } = AdminContext();
  return (
    <div className="bg-gray-200 rounded-md p-2">
      <button
        className="btn_green btn_full mb-1"
        onClick={() => {
          setMode("");
          setSelectedKontingen(dataKontingenInitialValue);
          setSelectedKategori("");
          setSelectedPesertas([]);
          setSelectedOfficials([]);
          setUncofirmedKontingens([]);
          setCofirmedKontingens([]);
        }}
      >
        Dashboard
      </button>

      {selectedKontingen && (
        <h1 className="capitalize mb-1 text-3xl font-extrabold p-1 w-fit bg-black text-white">
          Kontingen {selectedKontingen.namaKontingen}
        </h1>
      )}

      {mode == "custom" && <CustomTabel />}

      {(mode == "kontingen" || selectedKontingen) && <TabelKontingenAdmin />}
      {(mode == "peserta" || selectedKontingen) && <TabelPesertaAdmin />}
      {(mode == "official" || selectedKontingen) && <TabelOfficialAdmin />}
      {mode == "pembayaran" && <TabelPembayaran />}
    </div>
  );
};
export default TabelAdmin;
