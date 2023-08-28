"use client";

import { MyContext } from "@/context/Context";
import {
  dataOfficialInitialValue,
  errorValidationMessagesForOfficials,
  jabatanOfficials,
  jenisKelamin,
} from "@/utils/constants";
import { firestore, storage } from "@/utils/firebase";
import {
  checkType,
  compare,
  deleteImage,
  deletePerson,
  movePerson,
  newToast,
  updateData,
  updateToast,
  uploadImage,
} from "@/utils/sharedFunctions";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
  ErrorValidationMessagesForOfficials,
  FormProps,
} from "@/utils/types";
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
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { ToastContainer, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabelOfficial from "../tabel/TabelOfficial";
import Rodal from "rodal";
import Image from "next/image";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const FormOfficial = ({ kontingens }: FormProps) => {
  const [data, setData] = useState<DataOfficialState | DocumentData>(
    dataOfficialInitialValue
  );
  const [newDataRef, setNewDataRef] = useState<DocumentReference<
    DocumentData,
    DocumentData
  > | null>(null);
  const [officials, setOfficials] = useState<DataOfficialState[] | []>([]);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState<File | null>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [errorValidationMessages, setErrorValidationMessages] =
    useState<ErrorValidationMessagesForOfficials>(
      errorValidationMessagesForOfficials
    );
  const [imageUpdated, setImageUpdated] = useState(false);

  const deleteInfoInitialValue = {
    idOfficial: "",
    namaLengkap: "",
    idKontingen: "",
  };
  const [deleteInfo, setDeleteInfo] = useState(deleteInfoInitialValue);

  const toastId = useRef(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const { user } = MyContext();

  // SET DATA USER
  useEffect(() => {
    if (user && kontingens.length == 0) {
      console.log("setting user");
      setData({ ...data, creatorEmail: user.email, creatorUid: user.uid });
    }
    if (user && kontingens.length !== 0) {
      console.log("setting user and kontingen");
      setData({
        ...data,
        creatorEmail: user.email,
        creatorUid: user.uid,
        namaKontingen: kontingens[0].namaKontingen,
        idKontingen: kontingens[0].idKontingen,
      });
    }
  }, [user, kontingens]);

  // GET ALL OFFICIAL - TRIGGER
  useEffect(() => {
    if (user) getOfficials();
  }, [user]);

  // GET ALL OFFICIAL - GETTER
  const getOfficials = () => {
    console.log("getting officials");
    const container: any[] = [];
    const q = query(
      collection(firestore, "officials"),
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
        setOfficials(container.sort(compare("waktuPendaftaran", "asc")))
      );
  };

  // VALIDATE IMAGE
  const limitImage = (file: File) => {
    const maxSize = 1 * 1024 * 1024; //1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      clearInputImage();
      alert(
        "Format file yang ada masukan tidak valid, yang diperbolehkan hanya .jpg, .jpeg, dan .png"
      );
      return;
    }
    if (file.size > maxSize) {
      clearInputImage();
      alert("File yang ada masukan terlalu besar, Makismal 1MB");
      return;
    }
    setImageSelected(file);
    setImagePreviewSrc(URL.createObjectURL(file));
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (updating) {
      updateDataHandler();
    } else {
      sendNewData();
    }
  };

  // SEND NEW DATA - STEP 1
  const sendNewData = () => {
    if (data.namaKontingen !== "") {
      newToast("loading", toastId, "Mendaftarkan Official");
      const newDocRef = doc(collection(firestore, "officials"));
      setData({
        ...data,
        idOfficial: newDocRef.id,
        waktuPendaftaran: Date.now(),
      });
      setNewDataRef(newDocRef);
    } else {
      alert("tolong lengkapi data terlebih dahulu");
    }
  };

  // SEND NEW DATA -  STEP 2 - UPLOAD IMAGE IF HAVE ID AND TIMESTAMP
  useEffect(() => {
    if (data.idOfficial && data.waktuPendaftaran && !updating) {
      uploadImage("officials", imageSelected, data, setData, toastId).catch(
        (error) => {
          console.log(error);
          resetData();
        }
      );
    }
  }, [data.idOfficial, data.waktuPendaftaran, updating]);

  // SEND NEW DATA - STEP 3 - IF IMAGE UPLOADED
  useEffect(() => {
    if (data.downloadFotoUrl && data.fotoUrl && newDataRef) {
      setDoc(newDataRef, data)
        .then(() => {
          sendOfficialToKontingen();
        })
        .catch((error) => alert(error));
    }
  }, [data.downloadFotoUrl, data.fotoUrl, newDataRef]);

  // SEND NEW DATA - STEP 4 - ADD OFFICIAL TO KONTINGEN
  const sendOfficialToKontingen = () => {
    movePerson(
      "add",
      kontingens,
      data.idKontingen,
      "official",
      data.idOfficial,
      data.namaLengkap,
      toastId,
      false
    )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        resetData();
        getOfficials();
      });
  };

  // RESET DATA
  const resetData = () => {
    setData({
      ...dataOfficialInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      namaKontingen: kontingens[0].namaKontingen,
      idKontingen: kontingens[0].idKontingen,
    });
    setNewDataRef(null);
    setImageUpdated(false);
    setUpdating(false);
    clearInputImage();
  };

  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (inputImageRef.current) inputImageRef.current.value = "";
    setImagePreviewSrc("");
  };

  // EDIT - STEP 1 - EDIT HANDLER
  const handleEdit = (idOfficial: string) => {
    setUpdating(true);
    getOfficial(idOfficial);
  };

  // EDIT - STEP 2 - GET ONE OFFICIAL
  const getOfficial = (id: string) => {
    console.log("get one official", id);
    getDoc(doc(firestore, "officials", id))
      .then((docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      })
      .catch((error) => console.log(error));
  };

  // EDIT - STEP 3 - SET IMAGE PREVIEW
  useEffect(() => {
    if ((data.downloadFotoUrl, updating))
      setImagePreviewSrc(data.downloadFotoUrl);
  }, [data.downloadFotoUrl, updating]);

  // EDIT - STEP 4 - UPDATE BUTTON HANDLER ABD CHECK IMAGE CHANGED
  const updateDataHandler = () => {
    if (updating && imagePreviewSrc != data.downloadFotoUrl) {
      deleteOldImage();
    } else {
      updateDataOfficial();
    }
  };

  // EDIT - STEP 5 - DELETE OLD IMAGE IF IMAGE CHANGED
  const deleteOldImage = () => {
    deleteImage(officials, data.idOfficial, toastId, false)
      .then(() => {
        uploadNewImage();
      })
      .catch((error) => {
        console.log(error);
        resetData();
      });
  };

  // EDIT - STEP 6 - UPLOAD NEW IMAGE IF IMAGE CHANGED
  const uploadNewImage = () => {
    if (!imageSelected) {
      alert("No image selected");
      return;
    }
    updateToast(toastId, "loading", "Mengunggah foto baru");
    const url = `offcials/${v4()}.${imageSelected.type.split("/")[1]}`;
    uploadBytes(ref(storage, url), imageSelected)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          setData({ ...data, downloadFotoUrl: downloadUrl, fotoUrl: url });
          setImageUpdated(true);
        });
      })
      .catch((error) => {
        console.log(error);
        updateToast(toastId, "error", "Gagal mengunggah pas foto baru");
        resetData();
      });
  };

  //EDIT - STEP 7 - SEND UPDATED DATA
  useEffect(() => {
    if (imageUpdated) updateDataOfficial();
  }, [imageUpdated]);

  const updateDataOfficial = () => {
    updateData("officials", data, data.idOfficial, toastId, !imageUpdated)
      .then(() => resetData())
      .catch((error) => console.log(error))
      .finally(() => getOfficials());
  };

  // DELETE - STEP 1 - DELETE BUTTON
  const handleDelete = (
    idOfficial: string,
    namaLengkap: string,
    idKontingen: string
  ) => {
    setDeleteInfo({ idOfficial, namaLengkap, idKontingen });
    setModalVisible(true);
  };

  // DELETE - STEP 2 - DELETE HANDLER
  const deleteData = () => {
    setModalVisible(false);
    deleteOffcialFromKontingen(deleteInfo.idOfficial, deleteInfo.idKontingen);
  };

  // DELETE - STEP 3 - OFFICIAL FROM KONTINGEN
  const deleteOffcialFromKontingen = (
    idOfficial: string,
    idKontingen: string
  ) => {
    movePerson(
      "delete",
      kontingens,
      idKontingen,
      "official",
      idOfficial,
      deleteInfo.namaLengkap,
      toastId
    )
      .then(() => {
        deleteOfficialImage(idOfficial);
      })
      .catch((error) => {
        console.log(error);
        cancelDelete();
      });
  };

  // DELETE - STEP 4 - DELETE OFFICIAL IMAGE
  const deleteOfficialImage = (idOfficial: string) => {
    deleteImage(officials, idOfficial, toastId).then(() => {
      deletePerson("officials", idOfficial, deleteInfo.namaLengkap, toastId)
        .catch((error) => console.log(error))
        .finally(() => {
          cancelDelete();
          getOfficials();
        });
      // deleteOfficial(idOfficial)
      //   .then(() => {
      //     updateToast(toastId, "success", "berhasil menghapus data");
      //   })
      //   .catch((error) => {
      //     updateToast(toastId, "error", "gagal menghapus data");
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     cancelDelete();
      //     getOfficials();
      //   });
    });
  };

  // DELETE - STEP 4 - DELETE OFFICIAL
  const deleteOfficial = async (idOfficial: string) => {
    newToast("loading", toastId, "Menghapus data official");
    try {
      await deleteDoc(doc(firestore, "officials", idOfficial));
    } catch (error) {
      return error;
    }
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setModalVisible(false);
    setDeleteInfo(deleteInfoInitialValue);
  };

  // TROUBLESHOOTER
  useEffect(() => {
    console.log("trouble", data.namaKontingen, data.idKontingen);
  }, [data.namaKontingen, data.idKontingen]);

  return (
    <div className="flex flex-col gap-2">
      <ToastContainer />
      {officials.length ? (
        <TabelOfficial
          data={officials.sort(compare("namaLengkap", "asc"))}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ) : (
        <p>
          <p>Belum ada Official yang didaftarkan</p>
        </p>
      )}
      <form
        className="grid grid-cols-[auto_1fr] gap-3"
        onSubmit={(e) => saveOfficial(e)}
      >
        <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="h-full w-full">
            <div className="h-full w-full flex flex-col justify-between">
              <h1 className="font-semibold text-red-500">Hapus kontingen</h1>
              <p>Apakah anda yakin akan menghapus Official ini?</p>
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
          </div>
        </Rodal>

        <div className="input_container max-w-[150px] ">
          <label className="input_label text-center">Pas Foto</label>
          <div
            className={`
          ${
            errorValidationMessages.pasFoto !== "" && imageSelected == null
              ? "input_error"
              : null
          }
          bg-white w-[150px] h-[200px] relative input
          `}
          >
            {imagePreviewSrc && (
              <Image
                src={imagePreviewSrc}
                alt="preview"
                fill
                className="object-cover rounded-md"
              />
            )}
          </div>
          <input
            ref={inputImageRef}
            accept=".jpg, .jpeg, .png"
            type="file"
            multiple={false}
            onChange={(e) => e.target.files && limitImage(e.target.files[0])}
            className={`
            ${
              errorValidationMessages.pasFoto !== "" &&
              imageSelected == null &&
              "input_error"
            }
            input_file mt-1 w-full text-transparent
            `}
          />
        </div>

        <div className="h-full w-fit flex flex-col justify-between">
          <div>
            <div className="inputs_container">
              <div className="input_container">
                <label className="input_label">Nama Lengkap</label>
                <input
                  className="input"
                  type="text"
                  value={data.namaLengkap}
                  onChange={(e) =>
                    setData({ ...data, namaLengkap: e.target.value })
                  }
                />
              </div>

              <div className="input_container">
                <label className="input_label">Jenis Kelamin</label>
                <select
                  className="input"
                  value={data.jenisKelamin}
                  onChange={(e) =>
                    setData({ ...data, jenisKelamin: e.target.value })
                  }
                >
                  {jenisKelamin.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="inputs_container">
              <div className="input_container">
                <label className="input_label">Jabatan</label>
                <select
                  className="input capitalize"
                  value={data.jabatan}
                  onChange={(e) =>
                    setData({ ...data, jabatan: e.target.value })
                  }
                >
                  {jabatanOfficials.map((item) => (
                    <option value={item} className="capitalize">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input_container">
                <label className="input_label">Nama Kontingen</label>
                <select
                  value={`${data.namaKontingen}-${data.idKontingen}`}
                  onChange={(e) => {
                    const value = e.target.value.split("-");
                    setData({
                      ...data,
                      namaKontingen: value[0],
                      idKontingen: value[1],
                    });
                  }}
                  className={`
                ${
                  errorValidationMessages.namaKontingen != "" &&
                  data.namaKontingen == "" &&
                  "input_error"
                }
                input
                `}
                >
                  {kontingens.length &&
                    kontingens.map((kontingen) => (
                      <option
                        value={`${kontingen.namaKontingen}-${kontingen.idKontingen}`}
                        key={kontingen.idKontingen}
                      >
                        {kontingen.namaKontingen}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-2 flex gap-2 justify-end self-end">
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
      </form>
    </div>
  );
};
export default FormOfficial;
