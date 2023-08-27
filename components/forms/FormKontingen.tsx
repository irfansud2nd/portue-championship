"use client";
import { useState, useEffect, useRef } from "react";
import {
  DocumentData,
  collection,
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
import { DataKontingenState, FormProps } from "@/utils/types";
import { dataKontingenInitialValue } from "@/utils/constants";
import TabelKontingen from "../tabel/TabelKontingen";

const FormKontingen = ({ kontingens, setKontingens }: FormProps) => {
  const [data, setData] = useState<DataKontingenState | DocumentData>(
    dataKontingenInitialValue
  );
  const [newDataRef, setNewDataRef] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
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

  // GET ONE KONTIGENS
  const getKontingen = (id: string) => {
    console.log("getKontingen");
    let container = {};
    getDoc(doc(firestore, "kontingens", id))
      .then((docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      })
      .catch((error) => console.log(error));
  };

  // SUBMIT HANDLER
  const saveKontingen = (e: React.FormEvent) => {
    e.preventDefault();
    if (updating) {
      updateData();
    } else {
      sendNewData();
    }
  };

  // SEND NEW DATA - START
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

  // SEND NEW DATA - IF HAVE ID
  useEffect(() => {
    console.log(data.idKontingen, newDataRef, data.waktuPendaftaran);
    if (data.idKontingen && newDataRef) {
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

  // CEK KONTINGENS ON DID MOUNT
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

  const handleDelete = (id: string) => {};

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
              className="button_red btn_full"
              onClick={resetData}
              type="button"
            >
              Batal
            </button>
            <button className="button_green btn_full" type="submit">
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
