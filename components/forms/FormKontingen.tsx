"use client";
import { useState, useEffect, useRef } from "react";
import {
  DocumentData,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import {
  compare,
  deletePerson,
  deletePeserta,
  newToast,
  updateToast,
} from "@/utils/sharedFunctions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "@/context/Context";
import { DataKontingenState, FormKontingenProps } from "@/utils/types";
import { dataKontingenInitialValue } from "@/utils/constants";
import TabelKontingen from "../tabel/TabelKontingen";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { BiLoader } from "react-icons/bi";

const FormKontingen = ({ kontingens, setKontingens }: FormKontingenProps) => {
  const [data, setData] = useState<DataKontingenState | DocumentData>(
    dataKontingenInitialValue
  );
  const [updating, setUpdating] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(dataKontingenInitialValue);
  const [modalVisible, setModalVisible] = useState(false);
  const [tabelLoading, setTabelLoading] = useState(false);

  const { user, disable, setDisable } = MyContext();

  const toastId = useRef(null);

  // SET DATA USER
  useEffect(() => {
    setData({
      ...data,
      creatorEmail: user.email,
      creatorUid: user.uid,
    });
  }, [user]);

  // GET KONTINGENS ON DID MOUNT
  useEffect(() => {
    getKontingens();
  }, []);

  // GET ALL KONTIGENS
  const getKontingens = () => {
    // TABLE LOADING TRUE
    setTabelLoading(true);
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
      .catch((error) => newToast(toastId, "error", error.code))
      .finally(() => {
        setKontingens(container.sort(compare("waktuPendaftaran", "asc")));
        // TABEL LOADING FALSE
        setTabelLoading(false);
      });
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveKontingen = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.namaKontingen !== "") {
      setDisable(true);
      if (updating) {
        updateKontingen();
      } else {
        sendKontingen();
      }
    } else {
      newToast(toastId, "error", "Tolong lengkapi nama kontingen");
    }
  };

  // SEND KONTINGEN
  const sendKontingen = () => {
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
      .catch((error) =>
        updateToast(
          toastId,
          "error",
          `Gagal mendaftarkan kontingen. ${error.code}`
        )
      )
      .finally(() => {
        resetData();
        getKontingens();
      });
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
      .catch((error) =>
        updateToast(toastId, "error", `Gagal mengubah data. ${error.code}`)
      )
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
    setDisable(false);
    setData({
      ...dataKontingenInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
    });
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
    setDisable(false);
  };

  // DELETING DATA - START
  // DELETE CONTROLLER
  const deleteData = () => {
    setDisable(true);
    setModalVisible(false);
    deleteOfficials(dataToDelete.officials.length - 1);
  };

  // DELETE ALL OFFICIAL
  const deleteOfficials = (officialIndex: number) => {
    if (officialIndex >= 0) {
      const id = dataToDelete.officials[officialIndex];
      deletePerson(
        "officials",
        {
          namaLengkap: `${dataToDelete.officials.length} official`,
          idKontingen: dataToDelete.idKontingen,
          fotoUrl: `officials/${id}-image`,
          id: id,
        },
        kontingens,
        toastId,
        () => afterDeleteOfficial(officialIndex)
      );
    } else {
      deletePesertas(dataToDelete.pesertas.length - 1);
    }
  };

  const afterDeleteOfficial = (officialIndex: number) => {
    if (officialIndex != 0) {
      deleteOfficials(officialIndex - 1);
    } else {
      deletePesertas(dataToDelete.pesertas.length - 1);
    }
  };

  //DELETE ALL PESERTA
  const deletePesertas = (pesertaIndex: number) => {
    if (pesertaIndex >= 0) {
      const id = dataToDelete.pesertas[pesertaIndex];
      deletePeserta(
        "pesertas",
        {
          namaLengkap: `${dataToDelete.pesertas.length} peserta`,
          idKontingen: dataToDelete.idKontingen,
          fotoUrl: `pesertas/${id}-image`,
          id: id,
        },
        kontingens,
        toastId,
        () => afterDeletePeserta(pesertaIndex)
      );
    } else {
      deleteKontingen();
    }
  };

  const afterDeletePeserta = (pesertaIndex: number) => {
    if (pesertaIndex != 0) {
      deletePesertas(pesertaIndex - 1);
    } else {
      deleteKontingen();
    }
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
          `Gagal menghapus kontingen. ${error.code}`
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
      {kontingens.length ? (
        <TabelKontingen
          data={kontingens}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ) : tabelLoading ? (
        <p>
          Memuat Data Kontingen... <BiLoader className="animate-spin inline" />
        </p>
      ) : (
        <p>Belum ada Kontingen yang didaftarkan</p>
      )}
      <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="h-full w-full">
          {dataToDelete.idPembayaran.length ? (
            <div className="h-full w-full flex flex-col justify-between">
              <h1 className="font-semibold text-red-500">
                Tidak dapat menghapus kontingen
              </h1>
              <p>
                Maaf, kontingen yang pesertanya sudah diselesaikan pembayarannya
                tidak dapat dihapus
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
      {/* {updating && ( */}
      <form onSubmit={(e) => saveKontingen(e)}>
        <div className="input_container">
          <label className="input_label">Nama Kontingen</label>
          <div className="flex flex-wrap gap-y-2 gap-x-5">
            <input
              type="text"
              className="input uppercase"
              value={data.namaKontingen}
              onChange={(e) =>
                setData({
                  ...data,
                  namaKontingen: e.target.value.toLowerCase(),
                })
              }
            />

            <div className="flex gap-3">
              <button
                disabled={disable}
                className="btn_red btn_full"
                onClick={resetData}
                type="button"
              >
                Batal
              </button>
              <button
                disabled={disable}
                className="btn_green btn_full"
                type="submit"
              >
                {updating ? "Perbaharui" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2"></div>
      </form>
      {/* )} */}
    </div>
  );
};
export default FormKontingen;
