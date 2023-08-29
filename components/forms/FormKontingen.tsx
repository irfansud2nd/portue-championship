"use client";
import { useState, useEffect, useRef } from "react";
import {
  DocumentData,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { compare, newToast, updateToast } from "@/utils/sharedFunctions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "@/context/Context";
import { DataKontingenState, DeleteInfoState, FormProps } from "@/utils/types";
import {
  dataKontingenInitialValue,
  deleteInfoInitialValue,
} from "@/utils/constants";
import TabelKontingen from "../tabel/TabelKontingen";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const FormKontingen = ({ kontingens, setKontingens }: FormProps) => {
  const [data, setData] = useState<DataKontingenState | DocumentData>(
    dataKontingenInitialValue
  );
  const [newDataRef, setNewDataRef] = useState<DocumentReference<
    DocumentData,
    DocumentData
  > | null>(null);
  const [updating, setUpdating] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(dataKontingenInitialValue);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = MyContext();

  const toastId = useRef(null);

  // SET DATA USER
  useEffect(() => {
    setData({ ...data, creatorEmail: user.email, creatorUid: user.uid });
  }, [user]);

  // GET KONTINGENS ON DID MOUNT
  useEffect(() => {
    getKontingens();
  }, []);

  // GET ALL KONTIGENS
  const getKontingens = () => {
    console.log("getting kontingens");
    const container: any[] = [];
    const q = query(
      collection(firestore, "kontingens"),
      where("creatorUid", "==", user.uid)
    );
    getDocs(q)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          container.push(doc.data());
        })
      )
      .catch((error) => console.log(error))
      .finally(() =>
        setKontingens(container.sort(compare("waktuPendaftaran", "asc")))
      );
  };

  // GET ONE KONTINGEN
  const getKontingen = (id: string) => {
    console.log("getKontingen");
    getDoc(doc(firestore, "kontingens", id))
      .then((docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      })
      .catch((error) => console.log(error));
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveKontingen = (e: React.FormEvent) => {
    e.preventDefault();
    if (updating) {
      updateKontingen();
    } else {
      sendKontingen();
    }
  };

  // SEND KONTINGEN
  const sendKontingen = () => {
    if (data.namaKontingen !== "") {
      newToast(toastId, "loading", "Mendaftarkan Kontingen");
      const newDocRef = doc(collection(firestore, "kontingens"));
      setDoc(newDocRef, {
        ...data,
        idKontingen: newDocRef.id,
        waktuPendaftaran: Date.now(),
      })
        .then(() => {
          updateToast(toastId, "success", "Kontingen berhasil didaftarkan");
        })
        .catch((error) => alert(error))
        .finally(() => {
          resetData();
          getKontingens();
        });
    } else {
      alert("tolong lengkapi data terlebih dahulu");
    }
  };

  // UPDATE KONTINGEN
  const updateKontingen = () => {
    newToast(toastId, "loading", "Mengubah Data Kontingen");
    setDoc(doc(firestore, "kontingens", data.idKontingen), {
      ...data,
      waktuPerubahan: Date.now(),
    })
      .then(() => {
        updateToast(toastId, "success", "Data berhasil dirubah");
        getKontingens();
      })
      .catch((error) => alert(error))
      .finally(() => {
        resetData();
        getKontingens();
      });
  };

  // EDIT HANDLER
  const handleEdit = (data: DataKontingenState) => {
    setUpdating(true);
    setData(data);
  };

  // RESETER
  const resetData = () => {
    setData({
      ...dataKontingenInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
    });
    setNewDataRef(null);
    setUpdating(false);
  };

  // DELETE HANDLER
  const handleDelete = (data: DataKontingenState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setModalVisible(false);
    setDataToDelete(dataKontingenInitialValue);
  };

  // DELETING DATA - START
  // DELETE CONTROLLER
  const deleteData = () => {
    setModalVisible(false);
    if (dataToDelete.pesertas.length) {
      deletePesertas();
    } else if (dataToDelete.officials.length) {
      deleteOfficials();
    } else {
      deleteKontingen();
    }
  };

  //DELETE ALL PESERTA
  const deletePesertas = () => {
    // FIX ME
  };

  // DELETE ALL OFFICIAL
  const deleteOfficials = () => {
    // FIX ME
  };

  // DELETE KONTINGEN
  const deleteKontingen = () => {
    newToast(toastId, "loading", "Menghapus Kontingen");
    deleteDoc(doc(firestore, "kontingens", dataToDelete.idKontingen))
      .then(() => updateToast(toastId, "success", "Kontingen berhasil dihapus"))
      .catch((error) => {
        updateToast(
          toastId,
          "error",
          "Gagal mengapus semua official dari kontingen"
        );
        alert(error);
      })
      .finally(() => {
        getKontingens();
        cancelDelete();
      });
  };
  // DELETING DATA - END

  return (
    <div className="flex flex-col gap-2">
      <ToastContainer />
      {kontingens.length ? (
        <TabelKontingen
          data={kontingens}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ) : (
        <p>
          <p>Belum ada Kontingen yang didaftarkan</p>
        </p>
      )}
      <form onSubmit={(e) => saveKontingen(e)}>
        <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="h-full w-full">
            {dataToDelete.waktuPembayaran ? (
              <div className="h-full w-full flex flex-col justify-between">
                <h1 className="font-semibold text-red-500">
                  Tidak dapat menghapus kontingen
                </h1>
                <p>
                  Maaf, peserta yang sudah diselesaikan pembayarannya tidak
                  dapat dihapus
                </p>
                <button
                  onClick={cancelDelete}
                  className="self-end btn_green btn_full"
                  type="button"
                >
                  Ok
                </button>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col justify-between">
                <h1 className="font-semibold text-red-500">Hapus kontingen</h1>
                <p>
                  {dataToDelete.officials.length !== 0 ||
                  dataToDelete.officials.length !== 0 ? (
                    <span>
                      jika anda memilih untuk menghapus kontingen ini,{" "}
                      {dataToDelete.officials.length} Official dan{" "}
                      {dataToDelete.pesertas.length} Peserta yang tergabung di
                      dalam kontingen {dataToDelete.namaKontingen} akan ikut
                      terhapus
                      <br />
                    </span>
                  ) : null}
                  Apakah anda yakin akan menghapus Kontingen?
                </p>
                <div className="self-end flex gap-2">
                  <button
                    className="btn_red btn_full"
                    onClick={deleteData}
                    type="button"
                  >
                    Yakin
                  </button>
                  <button
                    className="btn_green btn_full"
                    onClick={cancelDelete}
                    type="button"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </Rodal>
        <div className="input_container">
          <label className="input_label">Nama Kontingen</label>
          <div className="flex gap-5">
            <input
              type="text"
              className="input"
              value={data.namaKontingen}
              onChange={(e) =>
                setData({ ...data, namaKontingen: e.target.value })
              }
            />
            <button
              className="btn_red btn_full"
              onClick={resetData}
              type="button"
            >
              Batal
            </button>
            <button className="btn_green btn_full" type="submit">
              {updating ? "Perbaharui" : "Simpan"}
            </button>
          </div>
        </div>
        <div className="flex gap-2"></div>
      </form>
    </div>
  );
};
export default FormKontingen;
