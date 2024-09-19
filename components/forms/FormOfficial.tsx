"use client";

import { MyContext } from "@/context/Context";
import {
  dataOfficialInitialValue,
  errorOfficialInitialValue,
  jabatanOfficials,
  jenisKelamin,
} from "@/utils/constants";
import { KontingenState, OfficialState, ErrorOfficial } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import TabelOfficial from "../tabel/TabelOfficial";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { compare, validateImage } from "@/utils/functions";
import {
  createOfficial,
  deleteOfficial,
  getInputErrorOfficial,
  updateOfficial,
} from "@/utils/official/officialFunctions";

type Props = {
  kontingen: KontingenState | undefined;
  setKontingen: React.Dispatch<
    React.SetStateAction<KontingenState | undefined>
  >;
  officials: OfficialState[];
  addOfficials: (officials: OfficialState[]) => void;
  deleteOfficial: (id: string) => void;
};

const FormOfficial = ({
  kontingen,
  setKontingen,
  officials,
  addOfficials,
  deleteOfficial: deleteOfficialState,
}: Props) => {
  const [data, setData] = useState<OfficialState>(dataOfficialInitialValue);
  const [sendClicked, setSendClicked] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState<File | undefined>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [inputErrorMessages, setInputErrorMessages] = useState<ErrorOfficial>(
    errorOfficialInitialValue
  );
  const [dataToDelete, setDataToDelete] = useState<OfficialState | undefined>();
  const [prevData, setPrevData] = useState<OfficialState | undefined>();
  const [tabelLoading, setTabelLoading] = useState(false);

  const toastId = useRef(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const { user, disable, setDisable } = MyContext();

  // SET DATA USER
  useEffect(() => {
    if (user && kontingen) {
      setData({
        ...data,
        creatorEmail: user.email,
        creatorUid: user.uid,
        idKontingen: kontingen.id,
      });
    }
  }, [user, kontingen]);

  // VALIDATE IMAGE
  const imageChangeHandler = (file: File) => {
    if (validateImage(file, toastId)) {
      setImageSelected(file);
      setImagePreviewSrc(URL.createObjectURL(file));
    } else {
      clearInputImage();
    }
  };

  // RESET IMAGE INPUT
  const clearInputImage = async () => {
    if (inputImageRef.current) inputImageRef.current.value = "";
    setImagePreviewSrc("");
  };

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendClicked(true);
    if (
      !getInputErrorOfficial(
        data,
        imagePreviewSrc,
        inputErrorMessages,
        setInputErrorMessages
      ) ||
      !kontingen
    )
      return;

    setDisable(true);
    let result = data;

    try {
      if (updating) {
        result = await updateOfficial(data, imageSelected, toastId);
      } else {
        if (!imageSelected) return;

        const { official, kontingen: newKontingen } = await createOfficial(
          data,
          imageSelected,
          kontingen,
          toastId
        );

        setKontingen(newKontingen);
        result = official;
      }
      addOfficials([result]);
    } catch (error) {
      throw error;
    } finally {
      resetData();
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

  // RESET DATA
  const resetData = () => {
    setData({
      ...dataOfficialInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingen ? kontingen.id : "",
    });
    setPrevData(undefined);
    setUpdating(false);
    setDisable(false);
    setSendClicked(false);
    clearInputImage();
  };

  // EDIT - STEP 1 - EDIT BUTTON
  const handleEdit = (data: OfficialState) => {
    setUpdating(true);
    setData(data);
    setPrevData(data);
  };

  // EDIT - STEP 2 - SET IMAGE PREVIEW
  useEffect(() => {
    if (prevData?.downloadFotoUrl) setImagePreviewSrc(prevData.downloadFotoUrl);
  }, [prevData]);

  // DELETE - STEP 1 - DELETE BUTTON
  const handleDelete = (data: OfficialState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE - STEP 2 - DELETE PERSON
  const deleteData = async () => {
    setModalVisible(false);
    if (dataToDelete) {
      setDisable(true);

      try {
        const newKontingen = await deleteOfficial(
          dataToDelete,
          kontingen,
          toastId
        );

        if (newKontingen) setKontingen(newKontingen);
        deleteOfficialState(dataToDelete.id);
      } catch (error) {
        throw error;
      } finally {
        cancelDelete();
        resetData();
      }
    }
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setDisable(false);
    setModalVisible(false);
    setDataToDelete(undefined);
  };

  // INPUT FILE DISABLER
  useEffect(() => {
    if (inputImageRef.current) inputImageRef.current.disabled = disable;
  }, [disable]);

  return (
    <div className="flex flex-col gap-2">
      <TabelOfficial
        loading={tabelLoading}
        data={officials}
        kontingen={kontingen}
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
                <option value={kontingen?.id} className="uppercase">
                  {kontingen?.namaKontingen}
                </option>
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
