import { AdminContext } from "@/context/AdminContext";
import CustomTabelSelector from "../CustomTabelSelector";
import TabelPesertaAdmin from "./TabelPesertaAdmin";
import InlineLoading from "../InlineLoading";

const CustomTabel = () => {
  const { selectedPesertas } = AdminContext();
  return (
    <div>
      <CustomTabelSelector />
      {selectedPesertas.length ? (
        <TabelPesertaAdmin />
      ) : (
        <p className="text-red-500 font-semibold">
          Belum ada peserta di kategori ini
        </p>
      )}
    </div>
  );
};
export default CustomTabel;
