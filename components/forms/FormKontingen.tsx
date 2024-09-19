"use client";
import { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "@/context/Context";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";
import { dataKontingenInitialValue } from "@/utils/constants";
import TabelKontingen from "../tabel/TabelKontingen";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { BiLoader } from "react-icons/bi";
import {
  createKontingen,
  deleteKontingen,
  updateKontingen,
} from "@/utils/kontingen/kontingenFunctions";
import { toastError } from "@/utils/functions";

type Props = {
  kontingen: KontingenState | undefined;
  setKontingen: React.Dispatch<
    React.SetStateAction<KontingenState | undefined>
  >;
  pesertas: PesertaState[];
  setPesertas: React.Dispatch<React.SetStateAction<PesertaState[]>>;
  officials: OfficialState[];
  setOfficials: React.Dispatch<React.SetStateAction<OfficialState[]>>;
};

const FormKontingen = ({
  kontingen,
  setKontingen,
  pesertas,
  setPesertas,
  officials,
  setOfficials,
}: Props) => {
  const [data, setData] = useState<KontingenState>(dataKontingenInitialValue);
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

  // SUBMIT HANDLER - UPDATE OR NEW DATA
  const saveKontingen = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.namaKontingen.length) {
      toastError(toastId, "Tolong lengkapi nama kontingen");
      return;
    }

    try {
      setDisable(true);

      let result: KontingenState = data;

      if (updating) {
        result = await updateKontingen(data, toastId);
      } else {
        result = await createKontingen(data, toastId);
      }

      setKontingen(result);
    } catch (error) {
      throw error;
    } finally {
      resetData();
    }
  };

  // EDIT HANDLER
  const handleEdit = (data: KontingenState) => {
    setUpdating(true);
    setData(data);
  };

  // RESETER
  const resetData = () => {
    setDisable(false);
    setUpdating(false);
    setData({
      ...dataKontingenInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
    });
  };

  // DELETE HANDLER
  const handleDelete = (data: KontingenState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE CANCELER
  const cancelDelete = () => {
    setModalVisible(false);
    setDataToDelete(dataKontingenInitialValue);
    setDisable(false);
  };

  // DELETE CONTROLLER
  const deleteData = async () => {
    setDisable(true);
    setModalVisible(false);
    if (!kontingen) return;

    try {
      await deleteKontingen(kontingen, pesertas, officials, toastId);

      setKontingen(undefined);
      setPesertas([]);
      setOfficials([]);
    } catch (error) {
      throw error;
    } finally {
      cancelDelete();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {kontingen ? (
        <TabelKontingen
          data={[kontingen]}
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
      {(updating || !kontingen) && (
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
      )}
    </div>
  );
};
export default FormKontingen;
