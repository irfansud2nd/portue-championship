import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { dataKontingenInitialValue } from "@/utils/constants";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";
import { useRef, useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { AdminContext } from "@/context/AdminContext";
import { deleteKontingen } from "@/utils/kontingen/kontingenFunctions";

const DeleteKontingenButton = ({
  kontingen,
}: {
  kontingen: KontingenState;
}) => {
  const {
    pesertas,
    officials,
    deleteKontingen: deleteKontingenContext,
    deletePeserta,
    deleteOfficial,
  } = AdminContext();

  const [kontingenToDelete, setKontingenToDelete] = useState<KontingenState>(
    dataKontingenInitialValue
  );
  const [officialsToDelete, setOfficialsToDelete] = useState<OfficialState[]>(
    []
  );
  const [pesertasToDelete, setPesertasToDelete] = useState<PesertaState[]>([]);
  const [rodalVisible, setRodalVisible] = useState<boolean>(false);

  const deleteHandler = (kontingen: KontingenState) => {
    setRodalVisible(true);
    setKontingenToDelete(kontingen);
    setPesertasToDelete(getPesertasByKontingen(kontingen.id, pesertas));
    setOfficialsToDelete(getOfficialsByKontingen(kontingen.id, officials));
  };

  const cancelDelete = () => {
    setRodalVisible(false);
    setKontingenToDelete(dataKontingenInitialValue);
    setPesertasToDelete([]);
    setOfficialsToDelete([]);
  };

  const toastId = useRef(null);

  const deleteData = async () => {
    await deleteKontingen(
      kontingenToDelete,
      pesertasToDelete,
      officialsToDelete,
      toastId
    );

    pesertasToDelete.map((peserta) => deletePeserta(peserta.id));
    officialsToDelete.map((official) => deleteOfficial(official.id));
    deleteKontingenContext(kontingenToDelete.id);
    cancelDelete();
  };
  return (
    <>
      <Rodal visible={rodalVisible} onClose={cancelDelete}>
        <div className="flex flex-col h-full justify-around">
          <h1 className="font-bold text-lg">Hapus Kontingen</h1>
          <p>
            Nama Kontingen:{" "}
            <b>{kontingenToDelete.namaKontingen.toUpperCase()}</b>
          </p>
          <p>
            Official: <b>{officialsToDelete.length} Orang</b>
          </p>
          <p>
            Peserta: <b>{pesertasToDelete.length} Orang</b>
          </p>
          <div className="flex gap-2 justify-center">
            <button className="btn_red btn_full" onClick={deleteData}>
              Delete
            </button>
            <button className="btn_green btn_full" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </Rodal>
      <div>
        <button
          className="btn_red btn_full text-white"
          onClick={() => deleteHandler(kontingen)}
        >
          Delete
        </button>
      </div>
    </>
  );
};
export default DeleteKontingenButton;
