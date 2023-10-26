import { firestore } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { Id, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JadwalChanger = () => {
  const [gelanggang, setGelanggang] = useState<string>();
  const [partai, setPartai] = useState<string>();
  const changePartai = () => {
    if (!gelanggang || !partai || partai == "0") {
      newToast(toastId, "error", "Tolong Pilih Gelanggang dan Lengkapi Partai");
    } else {
      newToast(toastId, "loading", "Menyimpan perubahan partai");
      updateDoc(doc(firestore, "gelanggangs", `gelanggang-${gelanggang}`), {
        partai: partai,
      })
        .then(() =>
          updateToast(toastId, "success", "Perubahan partai berhasil disipan")
        )
        .catch((error) =>
          updateToast(
            toastId,
            "error",
            `Perubahan partai gagal disipan. ${error.code}`
          )
        );
    }
  };
  const toastId = useRef(null);
  return (
    <div className="bg-white rounded-md p-1 flex gap-1 items-center w-fit">
      <ToastContainer />
      <select
        value={gelanggang}
        onChange={(e) => setGelanggang(e.target.value)}
      >
        <option value={0}></option>
        <option value={"a"}>Gelanggang A</option>
        <option value={"b"}>Gelanggang B</option>
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
