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
  deleteImage,
  deletePerson,
  getData,
  getDatas,
  limitImage,
  movePerson,
  setUserKontingens,
  updateData,
  uploadData,
  uploadImage,
} from "@/utils/sharedFunctions";
import {
  DataOfficialState,
  ErrorValidationMessagesForOfficials,
  FormProps,
} from "@/utils/types";
import { DocumentData, DocumentReference } from "firebase/firestore";
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
  const [prevKontingen, setPrevKontingen] = useState("");

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
    setUserKontingens(user, kontingens, data, setData);
  }, [user, kontingens]);

  // GET ALL OFFICIAL - TRIGGER
  useEffect(() => {
    if (user) getOfficials();
  }, [user]);

  // GET ALL OFFICIAL - GETTER
  const getOfficials = () => {
    getDatas("officials", user).then((res) => setOfficials(res));
  };

  // VALIDATE IMAGE
  const imageChangeHandler = (file: File) => {
    limitImage(file, clearInputImage, setImageSelected, setImagePreviewSrc);
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
      uploadImage("officials", imageSelected, data, setData, toastId)
        .then(() => addOfficial())
        .catch((error) => {
          console.log(error);
          resetData();
        });
    } else {
      alert("tolong lengkapi data terlebih dahulu");
    }
  };

  // SEND NEW DATA - STEP 3 - IF IMAGE UPLOADED
  const addOfficial = () => {
    uploadData("officials", data, toastId)
      .then()
      .then(() => {
        sendOfficialToKontingen();
      })
      .catch((error) => alert(error));
  };

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

  // EDIT - STEP 1 - EDIT HANDLER
  const handleEdit = (idOfficial: string) => {
    setUpdating(true);
    getOfficial(idOfficial);
  };

  // EDIT - STEP 2 - GET ONE OFFICIAL
  const getOfficial = (id: string) => {
    getData("officials", id, setData).then((res: DataOfficialState) => {
      setPrevKontingen(res.idKontingen);
      setImagePreviewSrc(res.downloadFotoUrl);
    });
  };

  // EDIT - STEP 4 - UPDATE BUTTON HANDLER AND CHECK IMAGE CHANGED
  const updateDataHandler = () => {
    deleteOldImage();
  };

  // EDIT - STEP 5 - DELETE OLD IMAGE IF IMAGE CHANGED
  const deleteOldImage = () => {
    if (updating && imagePreviewSrc != data.downloadFotoUrl) {
      deleteImage(officials, data.idOfficial, toastId)
        .then(() => {
          uploadNewImage();
        })
        .catch((error) => {
          console.log(error);
          resetData();
        });
    } else {
      moveOfficialToOtherKontingen();
    }
  };

  // EDIT - STEP 6 - UPLOAD NEW IMAGE IF IMAGE CHANGED
  const uploadNewImage = () => {
    uploadImage("officials", imageSelected, data, setData, toastId, false)
      .then(() => {
        moveOfficialToOtherKontingen();
      })
      .catch(() => resetData());
  };

  const moveOfficialToOtherKontingen = () => {
    if (prevKontingen != data.idKontingen) {
      movePerson(
        "delete",
        kontingens,
        prevKontingen,
        "official",
        data.idOfficial,
        data.namaLengkap,
        toastId
      )
        .then(() => updateDataOfficial())
        .catch((error) => {
          console.log(error);
          resetDelete();
        });
    } else {
      updateDataOfficial();
    }
  };

  //EDIT - STEP 7 - SEND UPDATED DATA
  const updateDataOfficial = () => {
    updateData("officials", data, data.idOfficial, toastId)
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
        resetDelete();
      });
  };

  // DELETE - STEP 4 - DELETE OFFICIAL IMAGE
  const deleteOfficialImage = (idOfficial: string) => {
    deleteImage(officials, idOfficial, toastId).then(() => {
      // DELETE STEP 5 - DELETE OFFICIAL
      deletePerson("officials", idOfficial, deleteInfo.namaLengkap, toastId)
        .catch((error) => console.log(error))
        .finally(() => {
          resetDelete();
          getOfficials();
        });
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

  // RESET DELETE
  const resetDelete = () => {
    setModalVisible(false);
    setDeleteInfo(deleteInfoInitialValue);
    setPrevKontingen("");
    setImageUpdated(false);
  };

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
                  onClick={resetDelete}
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
