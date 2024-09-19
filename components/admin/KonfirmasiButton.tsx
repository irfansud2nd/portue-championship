"use client";
import { MyContext } from "@/context/Context";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "@/context/AdminContext";
import { KontingenState, PesertaState } from "@/utils/types";
import Link from "next/link";
import InlineLoading from "./InlineLoading";
import { useRef, useState } from "react";
import { fetchData } from "@/utils/functions";
import { getPesertasByIdPembayaran } from "@/utils/peserta/pesertaActions";
import {
  confirmPayment,
  deletePayment,
  unconfirmPayment,
} from "@/utils/pembayaran/pembayaranFunctions";

type Props = {
  idPembayaran: string;
  infoPembayaran: {
    idPembayaran: string;
    nominal: string;
    noHp: string;
    waktu: number;
    buktiUrl: string;
  };
  kontingen: KontingenState;
  paid: boolean;
  infoKonfirmasi: {
    idPembayaran: string;
    nama: string;
    email: string;
    waktu: string;
  };
};

const KonfirmasiButton = ({
  idPembayaran,
  infoPembayaran,
  kontingen,
  paid,
  infoKonfirmasi,
}: Props) => {
  const [rodalVisible, setRodalVisible] = useState(false);
  const [pesertasToConfirm, setPesertasToConfirm] = useState<PesertaState[]>(
    []
  );

  const { user } = MyContext();
  const { addKontingens, addPesertas, pesertas } = AdminContext();

  const toastId = useRef(null);

  const getConfirmedPesertas = () => {
    let length = 0;
    pesertas.map((peserta: PesertaState) => {
      if (peserta.idPembayaran == idPembayaran && peserta.confirmedPembayaran) {
        length += 1;
      }
    });
    return length;
  };

  const konfirmasiHandler = () => {
    setRodalVisible(true);
    getPesertasToConfirm();
  };

  const getPesertasToConfirm = async () => {
    const result = await fetchData(() =>
      getPesertasByIdPembayaran(idPembayaran)
    );
    setPesertasToConfirm(result);
  };

  const konfirmasi = async () => {
    const { kontingen: updatedKontingen, pesertas: updatedPesertas } =
      await confirmPayment(
        infoPembayaran,
        kontingen,
        { toConfirm: pesertasToConfirm, toUnpaid: [] },
        infoPembayaran.nominal,
        user,
        toastId
      );
    setRodalVisible(false);
    addKontingens([updatedKontingen]);
    addPesertas(updatedPesertas);
  };

  const resetKonfirmasi = () => {
    setRodalVisible(false);
    setPesertasToConfirm([]);
  };

  const cancelPayment = async () => {
    await deletePayment(kontingen, pesertasToConfirm, idPembayaran, toastId);
  };

  const cancelKonfirmasi = async () => {
    await unconfirmPayment(kontingen, pesertasToConfirm, idPembayaran, toastId);
  };

  return (
    <>
      <Rodal
        visible={rodalVisible}
        onClose={resetKonfirmasi}
        customStyles={{
          height: "fit-content",
          width: "fit-content",
          maxHeight: "100vh",
          maxWidth: "100vw",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <h1>Konfirmasi Pembayaran</h1>
        <div>
          Jumlah Peserta:{" "}
          {/* <button className="mr-1 btn_green rounded-full px-1.5">+</button> */}
          {pesertasToConfirm.length ? (
            pesertasToConfirm.length
          ) : (
            <InlineLoading />
          )}
          {/* <button className="ml-1 btn_red rounded-full px-1.5">-</button> */}
        </div>
        <p>Jumlah Nominal: {infoPembayaran.nominal}</p>
        <div className="flex justify-center">
          <Link
            href={infoPembayaran.buktiUrl}
            target="_blank"
            className="btn_green btn_full"
          >
            Open Image in New Tab
          </Link>
        </div>
        <div className="w-[300px] h-[400px] mt-1 border-2 border-custom-navy relative mx-auto flex justify-center items-center">
          {infoPembayaran.buktiUrl ? (
            <img
              src={infoPembayaran.buktiUrl}
              alt="bukti pembayaran"
              // fill
              className="object-contain w-[300px] h-[400px]"
            />
          ) : null}
        </div>
        <div className="flex flex-col w-full justify-center gap-1 mt-1 ">
          {!pesertasToConfirm.length ? (
            <div className="mx-auto">
              <InlineLoading />
            </div>
          ) : (
            // !infoKonfirmasi.idPembayaran ?
            <>
              <Link
                href={`/konfirmasi-pembayaran/${idPembayaran}`}
                target="_blank"
                className="btn_green btn_full text-center"
              >
                Konfirmasi Sebagian
              </Link>
              <button className="btn_green btn_full" onClick={konfirmasi}>
                Konfirmasi Semua
              </button>
              <button className="btn_red btn_full" onClick={cancelPayment}>
                Batalkan Pembayaran
              </button>
              {/* </> */}
              {/* ) : ( */}
              <button className="btn_red btn_full" onClick={cancelKonfirmasi}>
                Batalkan Konfirmasi
              </button>
            </>
          )}
          <button className="btn_red btn_full" onClick={resetKonfirmasi}>
            {paid ? "Close" : "Batal"}
          </button>
        </div>
      </Rodal>
      <div className="border-b w-fit hover:border-b-custom-gold hover:text-custom-gold transition">
        <button
          onClick={konfirmasiHandler}
          className="hover:text-green-500 hover:underline transition"
        >
          {paid
            ? `Confirmed by ${infoKonfirmasi.email} | ${(
                getConfirmedPesertas() * 300000
              ).toLocaleString("id")}`
            : "Konfirmasi"}
        </button>
      </div>
    </>
  );
};
export default KonfirmasiButton;
