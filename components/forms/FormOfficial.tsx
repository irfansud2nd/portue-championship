"use client";

import { MyContext } from "@/context/Context";
import {
  dataOfficialInitialValue,
  errorOfficialInitialValue,
  jabatanOfficials,
  jenisKelamin,
} from "@/utils/constants";
import { firestore, storage } from "@/utils/firebase";
import {
  compare,
  deletePerson,
  getInputErrorOfficial,
  limitImage,
  newToast,
  sendPerson,
  updatePerson,
  updatePersonImage,
  updatePersonImageKontingen,
  updatePersonKontingen,
} from "@/utils/sharedFunctions";
import {
  DataKontingenState,
  DataOfficialState,
  ErrorOfficial,
} from "@/utils/types";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabelOfficial from "../tabel/TabelOfficial";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import Image from "next/image";

const FormOfficial = ({
  kontingens,
  officials,
  setOfficials,
}: {
  kontingens: DataKontingenState[];
  officials: DataOfficialState[];
  setOfficials: React.Dispatch<React.SetStateAction<DataOfficialState[] | []>>;
}) => {
  const [data, setData] = useState<DataOfficialState | DocumentData>(
    dataOfficialInitialValue
  );
  const [sendClicked, setSendClicked] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState<File | null>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [inputErrorMessages, setInputErrorMessages] = useState<ErrorOfficial>(
    errorOfficialInitialValue
  );
  const [dataToDelete, setDataToDelete] = useState<DataOfficialState | null>(
    null
  );
  const [prevData, setPrevData] = useState<DataOfficialState>(
    dataOfficialInitialValue
  );
  const [tabelLoading, setTabelLoading] = useState(false);

  const toastId = useRef(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const { user, disable, setDisable } = MyContext();

  // SET DATA USER
  useEffect(() => {
    if (user && kontingens.length == 0) {
      setData({
        ...data,
        creatorEmail: user.email,
        creatorUid: user.uid,
      });
    }
    if (user && kontingens.length !== 0) {
      setData({
        ...data,
        creatorEmail: user.email,
        creatorUid: user.uid,
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
    // TABLE LOADING TRUE
    setTabelLoading(true);
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
      .catch((error) => newToast(toastId, "error", error.code))
      .finally(() => {
        setOfficials(container.sort(compare("waktuPendaftaran", "asc")));
        // TABEL LOADING FALSE
        setTabelLoading(false);
      });
  };

  // VALIDATE IMAGE
  const imageChangeHandler = (file: File) => {
    if (limitImage(file, toastId)) {
      setImageSelected(file);
      setImagePreviewSrc(URL.createObjectURL(file));
    } else {
      clearInputImage();
    }
  };

  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (inputImageRef.current) inputImageRef.current.value = "";
    setImagePreviewSrc("");
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    setSendClicked(true);
    if (
      getInputErrorOfficial(
        data,
        imagePreviewSrc,
        inputErrorMessages,
        setInputErrorMessages
      )
    ) {
      setDisable(true);
      if (updating) {
        updateDataHandler();
      } else {
        if (imageSelected) {
          // SEND PERSON
          sendPerson(
            "official",
            data,
            imageSelected,
            kontingens,
            toastId,
            afterSendPerson
          );
        }
      }
    }
  };

  // GET INPUT ERROR AFTER SEND CLICKED
  useEffect(() => {
    if (sendClicked) {
      getInputErrorOfficial(
        data,
        imagePreviewSrc,
        inputErrorMessages,
        setInputErrorMessages
      );
    }
  }, [data, sendClicked, imageSelected]);

  // SEND PERSON CALLBACK
  const afterSendPerson = () => {
    getOfficials();
    resetData();
    setDisable(false);
  };

  // RESET DATA
  const resetData = () => {
    setData({
      ...dataOfficialInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingens[0].idKontingen,
    });
    setUpdating(false);
    clearInputImage();
    setSendClicked(false);
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
        updatePersonImageKontingen(
          "official",
          data,
          prevData,
          kontingens,
          toastId,
          imageSelected,
          resetEdit
        );
      } else if (
        imagePreviewSrc !== prevData.downloadFotoUrl &&
        imageSelected
      ) {
        updatePersonImage("official", data, toastId, imageSelected, resetEdit);
      } else if (data.idKontingen !== prevData.idKontingen) {
        updatePersonKontingen(
          "official",
          data,
          prevData,
          kontingens,
          toastId,
          resetEdit
        );
      } else if (
        imagePreviewSrc == prevData.downloadFotoUrl &&
        data.idKontingen == prevData.idKontingen
      ) {
        updatePerson("official", data, toastId, resetEdit);
      }
    }
  };

  // RESET EDIT
  const resetEdit = () => {
    getOfficials();
    setPrevData(dataOfficialInitialValue);
    clearInputImage();
    setDisable(false);
    setUpdating(false);
  };

  // DELETE - STEP 1 - DELETE BUTTON
  const handleDelete = (data: DataOfficialState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE - STEP 2 - DELETE PERSON
  const deleteData = () => {
    setModalVisible(false);
    if (dataToDelete) {
      setDisable(true);
      deletePerson(
        "officials",
        dataToDelete,
        kontingens,
        toastId,
        afterDeletePerson
      );
    }
  };

  // DELETE - STEP 3 - CALLBACK
  const afterDeletePerson = () => {
    cancelDelete();
    getOfficials();
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setDisable(false);
    setModalVisible(false);
    setDataToDelete(null);
  };

  // INPUT FILE DISABLER
  useEffect(() => {
    if (inputImageRef.current) inputImageRef.current.disabled = disable;
  }, [disable]);

  return (
    <div className="flex flex-col gap-2">
      <TabelOfficial
        loading={tabelLoading}
        data={officials.sort(compare("waktuPendaftaran", "asc"))}
        kontingens={kontingens}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* RODAL */}
      <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="h-full w-full">
          <div className="h-full w-full flex flex-col justify-between">
            <h1 className="font-semibold text-red-500">Hapus Official</h1>
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
      {/* RODAL */}

      {/* FORM */}
      {/* {updating ? ( */}
      <form
        className="grid grid-rows-[1fr_auto] gap-2"
        onSubmit={(e) => saveOfficial(e)}
      >
        {/* BARIS 1 */}
        <div className="w-full flex flex-wrap sm:flex-nowrap justify-center gap-3">
          {/* KOLOM KIRI */}
          {/* PAS FOT0 */}
          <div className="input_container max-w-[150px]">
            <label className="input_label text-center">Pas Foto</label>
            <p className="-mt-2 text-sm text-gray-600 text-center">Maks. 1MB</p>
            <div
              className={`
            ${inputErrorMessages.pasFoto ? "input_error" : "input"}
            bg-white w-[150px] h-[200px] relative border-2 rounded-md`}
            >
              {imagePreviewSrc && (
                // <Image
                //   src={imagePreviewSrc}
                //   alt="preview"
                //   fill
                //   className="object-cover rounded-md"
                // />
                <img
                  src={imagePreviewSrc}
                  alt="preview"
                  className="w-[150px] h-[200px] object-cover rounded-md"
                />
              )}
            </div>
            <input
              disabled={disable}
              ref={inputImageRef}
              accept=".jpg, .jpeg, .png"
              type="file"
              multiple={false}
              onChange={(e) =>
                e.target.files && imageChangeHandler(e.target.files[0])
              }
              className="input_file mt-1 w-full text-transparent"
            />
            <p className="text-red-500 text-center">
              {inputErrorMessages.pasFoto}
            </p>
          </div>
          {/* PAS FOT0 */}
          {/* KOLOM KIRI */}

          {/* KOLOM KANAN */}
          <div className="w-full flex flex-wrap justify-center sm:justify-normal gap-3 h-fit">
            {/* NAMA LENGKAP */}
            <div className="input_container">
              <label className="input_label">Nama Lengkap</label>
              <input
                disabled={disable}
                className={`
                  ${inputErrorMessages.namaLengkap ? "input_error" : "input"}`}
                type="text"
                value={data.namaLengkap}
                onChange={(e) =>
                  setData({ ...data, namaLengkap: e.target.value })
                }
              />
              <p className="text-red-500">{inputErrorMessages.namaLengkap}</p>
            </div>
            {/* NAMA LENGKAP */}

            {/* JENIS KELAMIN */}
            <div className="input_container">
              <label className="input_label">Jenis Kelamin</label>
              <select
                disabled={disable}
                className={`
                  ${inputErrorMessages.jenisKelamin ? "input_error" : "input"}
                  `}
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
              <p className="text-red-500">{inputErrorMessages.jenisKelamin}</p>
            </div>
            {/* JENIS KELAMIN */}

            {/* JABATAN */}
            <div className="input_container">
              <label className="input_label">Jabatan</label>
              <select
                disabled={disable}
                className={`
                  ${inputErrorMessages.jabatan ? "input_error" : "input"}
                  `}
                value={data.jabatan}
                onChange={(e) => setData({ ...data, jabatan: e.target.value })}
              >
                {jabatanOfficials.map((item) => (
                  <option value={item} className="capitalize" key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <p className="text-red-500">{inputErrorMessages.jabatan}</p>
            </div>
            {/* JABATAN */}

            {/* NAMA KONTINGEN */}
            <div className="input_container">
              <label className="input_label">Nama Kontingen</label>
              <select
                disabled={disable}
                value={data.idKontingen}
                onChange={(e) => {
                  setData({
                    ...data,
                    idKontingen: e.target.value,
                  });
                }}
                className={`
                    ${inputErrorMessages.idKontingen ? "input_error" : "input"}
                  uppercase
                    `}
              >
                {kontingens.length &&
                  kontingens.map((kontingen) => (
                    <option
                      value={kontingen.idKontingen}
                      key={kontingen.idKontingen}
                      className="uppercase"
                    >
                      {kontingen.namaKontingen}
                    </option>
                  ))}
              </select>
              <p className="text-red-500">{inputErrorMessages.idKontingen}</p>
            </div>
            {/* NAMA KONTINGEN */}
          </div>
          {/* KOLOM KANAN */}
        </div>
        {/* BARIS 1 */}

        {/* BARIS 2 */}
        {/* BOTTONS */}
        <div className="mt-2 flex gap-2 justify-end self-end">
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
        {/* BUTTONS */}
        {/* BARIS 2 */}
      </form>
      {/* ) : null} */}
      {/* FORM */}
    </div>
  );
};
export default FormOfficial;
