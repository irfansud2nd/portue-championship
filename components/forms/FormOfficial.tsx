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
  compare,
  deletePerson,
  limitImage,
  sendPerson,
  updatePerson,
  updatePersonImage,
  updatePersonImageKontingen,
  updatePersonKontingen,
} from "@/utils/sharedFunctions";
import {
  DataOfficialState,
  ErrorValidationMessagesForOfficials,
  FormProps,
} from "@/utils/types";
import {
  DocumentData,
  DocumentReference,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabelOfficial from "../tabel/TabelOfficial";
import Rodal from "rodal";
import Image from "next/image";

const FormOfficial = ({ kontingens }: FormProps) => {
  const [data, setData] = useState<DataOfficialState | DocumentData>(
    dataOfficialInitialValue
  );

  const [officials, setOfficials] = useState<DataOfficialState[] | []>([]);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState<File | null>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [errorValidationMessages, setErrorValidationMessages] =
    useState<ErrorValidationMessagesForOfficials>(
      errorValidationMessagesForOfficials
    );
  const [dataToDelete, setDataToDelete] = useState<DataOfficialState | null>(
    null
  );
  const [prevData, setPrevData] = useState<DataOfficialState>(
    dataOfficialInitialValue
  );

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
      .catch((error) => alert(error))
      .finally(() =>
        setOfficials(container.sort(compare("waktuPendaftaran", "asc")))
      );
  };

  // VALIDATE IMAGE
  const imageChangeHandler = (file: File) => {
    if (limitImage(file)) {
      setImageSelected(file);
      setImagePreviewSrc(URL.createObjectURL(file));
    } else {
      clearInputImage();
    }
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (updating) {
      updateDataHandler();
    } else {
      if (imageSelected) {
        // SEND PERSON
        sendPerson("official", data, imageSelected, toastId, afterSendPerson);
      }
    }
  };

  // SEND PERSON CALLBACK
  const afterSendPerson = () => {
    getOfficials();
    resetData();
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
    setUpdating(false);
    clearInputImage();
  };

  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (inputImageRef.current) inputImageRef.current.value = "";
    setImagePreviewSrc("");
  };

  // EDIT - STEP 1 - EDIT BUTTON
  const handleEdit = (data: DataOfficialState) => {
    setUpdating(true);
    setData(data);
    setPrevData(data);
  };

  // EDIT - STEP 2 - SET IMAGE PREVIEW
  useEffect(() => {
    if (prevData.downloadFotoUrl) setImagePreviewSrc(prevData.downloadFotoUrl);
  }, [prevData.downloadFotoUrl]);

  // EDIT - STEP 3 - UPDATE CONTROLLER
  const updateDataHandler = () => {
    if (updating) {
      if (
        imagePreviewSrc !== prevData.downloadFotoUrl &&
        data.idKontingen !== prevData.idKontingen &&
        imageSelected
      ) {
        console.log("updatePersonImageKontingen");
        updatePersonImageKontingen(
          "official",
          data,
          prevData,
          toastId,
          imageSelected,
          resetEdit
        );
      } else if (
        imagePreviewSrc !== prevData.downloadFotoUrl &&
        imageSelected
      ) {
        console.log("updatePersonImage");
        updatePersonImage("official", data, toastId, imageSelected, resetEdit);
      } else if (data.idKontingen !== prevData.idKontingen) {
        console.log("updatePersonKontingen");
        updatePersonKontingen("official", data, prevData, toastId, resetEdit);
      } else if (
        imagePreviewSrc == prevData.downloadFotoUrl &&
        data.idKontingen == prevData.idKontingen
      ) {
        console.log("updatePerson");
        updatePerson("official", data, toastId, resetEdit);
      }
    }
  };

  // RESET EDIT
  const resetEdit = () => {
    getOfficials();
    setPrevData(dataOfficialInitialValue);
    clearInputImage();
  };

  // DELETE - STEP 1 - DELETE BUTTON
  const handleDelete = (data: DataOfficialState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE - STEP 2 - DELETE PERSON
  const deleteData = () => {
    setModalVisible(false);
    if (dataToDelete)
      deletePerson("officials", dataToDelete, toastId, afterDeletePerson);
  };

  // DELETE - STEP 3 - CALLBACK
  const afterDeletePerson = () => {
    cancelDelete();
    getOfficials();
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setModalVisible(false);
    setDataToDelete(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <ToastContainer />
      {officials.length ? (
        <TabelOfficial
          data={officials.sort(compare("namaLengkap", "asc"))}
          kontingens={kontingens}
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
            onChange={(e) =>
              e.target.files && imageChangeHandler(e.target.files[0])
            }
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
