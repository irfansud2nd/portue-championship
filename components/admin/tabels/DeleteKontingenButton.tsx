import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { dataKontingenInitialValue } from "@/utils/constants";
import { firestore, storage } from "@/utils/firebase";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRef, useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { AdminContext } from "@/context/AdminContext";

const DeleteKontingenButton = ({
  kontingen,
  toastSuccess,
  toastError,
  toastLoading,
  toastBaru,
}: {
  kontingen: DataKontingenState;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
  toastLoading: (msg: string) => void;
  toastBaru: (msg: string) => void;
}) => {
  const { pesertas, officials, refreshKontingens } = AdminContext();

  const [kontingenToDelete, setKontingenToDelete] =
    useState<DataKontingenState>(dataKontingenInitialValue);
  const [officialsToDelete, setOfficialsToDelete] = useState<
    DataOfficialState[]
  >([]);
  const [pesertasToDelete, setPesertasToDelete] = useState<DataPesertaState[]>(
    []
  );
  const [rodalVisible, setRodalVisible] = useState<boolean>(false);

  const deleteHandler = (kontingen: DataKontingenState) => {
    setRodalVisible(true);
    setKontingenToDelete(kontingen);
    setPesertasToDelete(
      getPesertasByKontingen(kontingen.idKontingen, pesertas)
    );
    setOfficialsToDelete(
      getOfficialsByKontingen(kontingen.idKontingen, officials)
    );
  };

  const cancelDelete = () => {
    setRodalVisible(false);
    setKontingenToDelete(dataKontingenInitialValue);
    setPesertasToDelete([]);
    setOfficialsToDelete([]);
  };

  const deleteData = () => {
    console.log("deleteData");
    deletePesertas(pesertasToDelete.length - 1);
    toastBaru(`Menghapus`);
  };

  const deletePesertas = (index: number) => {
    if (index < 0) {
      deleteOfficials(officialsToDelete.length - 1);
    } else {
      console.log("deletePesertas");
      const peserta = pesertasToDelete[index];
      const stepController = (step: number) => {
        switch (step) {
          case 1:
            if (peserta.ktpUrl) {
              // DELETE KTP
              deleteObject(ref(storage, peserta.ktpUrl))
                .then(() => stepController(2))
                .catch((error) =>
                  toastError(
                    `Gagal Menghapus KTP Peserta ${index + 1}. ${error.code}`
                  )
                );
            } else {
              stepController(2);
            }
            break;
          case 2:
            if (peserta.kkUrl) {
              // DELETE KK
              deleteObject(ref(storage, peserta.kkUrl))
                .then(() => stepController(3))
                .catch((error) =>
                  toastError(
                    `Gagal Menghapus KK Peserta ${index + 1}. ${error.code}`
                  )
                );
            } else {
              stepController(3);
            }
            break;
          case 3:
            // DELETE FOTO
            deleteObject(ref(storage, peserta.fotoUrl))
              .then(() => stepController(4))
              .catch((error) =>
                toastError(
                  `Gagal Menghapus KTP Peserta ${index + 1}. ${error.code}`
                )
              );
            break;
          case 4:
            // DELETE DATA
            deleteDoc(doc(firestore, "pesertas", peserta.id))
              .then(() => {
                deletePesertas(index - 1);
              })
              .catch((error) =>
                toastError(
                  `Gagal Menghapus Data Peserta ${index + 1}. ${error.code}`
                )
              );
            break;
        }
      };
      stepController(1);
    }
  };

  const deleteOfficials = (index: number) => {
    if (index < 0) {
      deleteKontingen();
    } else {
      console.log("deleteOfficials");
      const official = officialsToDelete[index];
      const stepController = (step: number) => {
        switch (step) {
          case 1:
            // DELETE FOTO
            deleteObject(ref(storage, official.fotoUrl))
              .then(() => stepController(2))
              .catch((error) =>
                toastError(
                  `Gagal Menghapus KTP Official ${index + 1}. ${error.code}`
                )
              );
            break;
          case 2:
            // DELETE DATA
            deleteDoc(doc(firestore, "officials", official.id))
              .then(() => {
                deleteOfficials(index - 1);
              })
              .catch((error) =>
                toastError(
                  `Gagal Menghapus Data Official ${index + 1}. ${error.code}`
                )
              );
            break;
        }
      };
      stepController(1);
    }
  };

  const deleteKontingen = () => {
    console.log("deleteKontingen");
    toastLoading("Menghapus Kontingen");
    deleteDoc(doc(firestore, "kontingens", kontingenToDelete.idKontingen))
      .then(() => {
        console.log("done");
        // refreshKontingens();
        toastSuccess(`Data Kontingen Berhasil dihapus`);
        cancelDelete();
      })
      .catch((error) =>
        toastError(`Gagal Menghapus Data Kontingen. ${error.code}`)
      );
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
