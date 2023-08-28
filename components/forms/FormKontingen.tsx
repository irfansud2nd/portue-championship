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
  const [deleteInfo, setDeleteInfo] = useState<DeleteInfoState>(
    deleteInfoInitialValue
  );
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = MyContext();

  const toastId = useRef(null);

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
      updateData();
    } else {
      sendNewData();
    }
  };

  // SEND NEW DATA - STEP 1
  const sendNewData = () => {
    newToast("loading", toastId, "Mendaftarkan Kontingen");
    if (data.namaKontingen !== "") {
      const newDocRef = doc(collection(firestore, "kontingens"));
      setData({
        ...data,
        idKontingen: newDocRef.id,
        waktuPendaftaran: Date.now(),
      });
      setNewDataRef(newDocRef);
    } else {
      alert("tolong lengkapi data terlebih dahulu");
    }
  };

  // SEND NEW DATA - STEP 2 - IF HAVE ID
  useEffect(() => {
    if (data.idKontingen && data.waktuPendaftaran && newDataRef) {
      setDoc(newDataRef, data)
        .then(() => {
          updateToast(toastId, "success", "Kontingen berhasil didaftarkan");
          getKontingens();
        })
        .catch((error) => alert(error))
        .finally(() => {
          resetData();
          getKontingens();
        });
    }
  }, [data.idKontingen, newDataRef, data.waktuPendaftaran]);

  // UPDATE DATA
  const updateData = () => {
    newToast("loading", toastId, "Mengubah Data Kontingen");
    setDoc(doc(firestore, "kontingens", data.idKontingen), data)
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

  // SET DATA USER
  useEffect(() => {
    setData({ ...data, creatorEmail: user.email, creatorUid: user.uid });
  }, [user]);

  // GET KONTINGENS ON DID MOUNT
  useEffect(() => {
    getKontingens();
  }, []);

  // EDIT HANDLER
  const handleEdit = (id: string) => {
    setUpdating(true);
    getKontingen(id);
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

  // DELETE CANCELER
  const cancelDelete = () => {
    setModalVisible(false);
    setDeleteInfo(deleteInfoInitialValue);
  };

  // DELETE HANDLER
  const handleDelete = (
    id: string,
    pesertas: string[] | [],
    officials: string[] | [],
    dibayar: boolean
  ) => {
    console.log(id, pesertas, officials, dibayar);
    setModalVisible(true);
    setDeleteInfo({ id, pesertas, officials, dibayar });
  };

  // DELETING DATA - START
  // DELETE CONTROLLER
  const deleteData = () => {
    setModalVisible(false);
    if (deleteInfo.pesertas.length) {
      deletePesertas();
    } else if (deleteInfo.officials.length) {
      deleteOfficials();
    } else {
      deleteKontingen();
    }
  };

  //DELETE ALL PESERTA
  const deletePesertas = () => {
    newToast("loading", toastId, "Menghapus Peserta");
    const jumlahPeserta = deleteInfo.pesertas.length;
    let pesertaDeleted = 0;
    while (pesertaDeleted <= jumlahPeserta) {
      if (pesertaDeleted < jumlahPeserta) {
        deleteDoc(
          doc(firestore, "pesertas", deleteInfo.pesertas[pesertaDeleted])
        )
          .then(() => (pesertaDeleted += 1))
          .catch((error) => {
            console.log(error);
            updateToast(
              toastId,
              "error",
              "Gagal mengapus semua peserta dari kontingen"
            );
            pesertaDeleted = jumlahPeserta;
            getKontingens();
            cancelDelete();
          });
      } else {
        updateToast(
          toastId,
          "success",
          "Berhasil menghapus semua official dari kontingen"
        );
        deleteOfficials();
      }
    }
  };

  // DELETE ALL OFFICIAL
  const deleteOfficials = () => {
    newToast("loading", toastId, "Menghapus Official");
    const jumlahOfficial = deleteInfo.officials.length;
    let officialDeleted = 0;
    while (officialDeleted <= jumlahOfficial) {
      if (officialDeleted < jumlahOfficial) {
        deleteDoc(
          doc(firestore, "officials", deleteInfo.officials[officialDeleted])
        )
          .then(() => (officialDeleted += 1))
          .catch((error) => {
            console.log(error);
            updateToast(
              toastId,
              "error",
              "Gagal mengapus semua official dari kontingen"
            );
            officialDeleted = jumlahOfficial;
            cancelDelete();
            getKontingens();
          });
      } else {
        updateToast(
          toastId,
          "success",
          "Berhasil menghapus semua official dari kontingen"
        );
        deleteKontingen();
      }
    }
  };

  // DELETE KONTINGEN
  const deleteKontingen = () => {
    newToast("loading", toastId, "Menghapus Kontingen");
    deleteDoc(doc(firestore, "kontingens", deleteInfo.id))
      .then(() => updateToast(toastId, "success", "Kontingen berhasil dihapus"))
      .catch((error) => {
        console.log(error);
        updateToast(
          toastId,
          "error",
          "Gagal mengapus semua official dari kontingen"
        );
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
            {deleteInfo.dibayar ? (
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
                  {deleteInfo.officials.length !== 0 ||
                  deleteInfo.officials.length !== 0 ? (
                    <span>
                      Kontingen anda terdiri dari {deleteInfo.officials.length}{" "}
                      Official dan {deleteInfo.pesertas.length} Peserta.
                      <br />
                      jika anda memilih untuk menghapus kontingen ini,{" "}
                      {deleteInfo.officials.length} Official dan{" "}
                      {deleteInfo.pesertas.length} Peserta yang tergabung di
                      dalam kontingen ini akan ikut terhapus
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
