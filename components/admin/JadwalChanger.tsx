import { updateData } from "@/utils/actions";
import { controlToast, toastError } from "@/utils/functions";
import { useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const JadwalChanger = () => {
  const [gelanggang, setGelanggang] = useState<string>();
  const [partai, setPartai] = useState<string>();

  const toastId = useRef(null);

  const changePartai = async () => {
    if (!gelanggang || !partai || partai == "0") {
      toastError(toastId, "Tolong Pilih Gelanggang dan Lengkapi Partai", true);
      return;
    }

    try {
      controlToast(toastId, "loading", "Menyimpan perubahan partai", true);

      const { result, error } = await updateData("gelanggangs", {
        id: `gelanggang-${gelanggang}`,
        partai,
      });

      if (error) throw error;

      controlToast(toastId, "success", "Perubahan partai berhasil disimpan");
    } catch (error) {
      toastError(toastId, error);
    }
  };

  return (
    <div className="bg-white rounded-md p-1 flex gap-1 items-center w-fit">
      <select
        value={gelanggang}
        onChange={(e) => setGelanggang(e.target.value)}
      >
        <option value={0}></option>
        <option value={"a"}>Gelanggang A</option>
        <option value={"b"}>Gelanggang B</option>
        <option value={"b"}>Gelanggang C</option>
        <option value={"b"}>Gelanggang D</option>
      </select>
      <p>Partai</p>
      <input
        type="text"
        value={partai}
        onChange={(e) => setPartai(e.target.value.replace(/[^0-9]/g, ""))}
      />
      <button className="btn_green btn_full" onClick={changePartai}>
        Save
      </button>
    </div>
  );
};
export default JadwalChanger;
