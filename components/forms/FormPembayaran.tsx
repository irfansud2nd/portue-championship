"use client";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";
import { useEffect, useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "@/context/Context";
import { validateImage } from "@/utils/functions";
import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { PiWarningCircleBold } from "react-icons/pi";
import Image from "next/image";
import TabelOfficial from "../tabel/TabelOfficial";
import TabelPeserta from "../tabel/TabelPeserta";

import logo_bjb from "@/public/images/logo-bjb.png";
import { createPembayaran } from "@/utils/pembayaran/pembayaranFunctions";

type Props = {
  kontingen: KontingenState | undefined;
  setKontingen: React.Dispatch<
    React.SetStateAction<KontingenState | undefined>
  >;
  officials: OfficialState[];
  pesertas: PesertaState[];
  addPesertas: (pesertas: PesertaState[]) => void;
};

const FormPembayaran = ({
  kontingen,
  setKontingen,
  officials,
  pesertas,
  addPesertas,
}: Props) => {
  const [noHp, setnoHp] = useState("");
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [imageSelected, setImageSelected] = useState<File | undefined>();
  const [unpaidPesertas, setUnpaidPesertas] = useState<PesertaState[]>([]);
  const inputErrorInitialValue = { foto: null, noHp: null };
  const [inputErrorMessages, setInputErrorMessages] = useState<{
    foto: string | null;
    noHp: string | null;
  }>(inputErrorInitialValue);

  const { disable, setDisable } = MyContext();

  // GENERATE TAGIHAN
  const generateTagihan = () => {
    let tagihan = 0;
    unpaidPesertas.map((data, i) => {
      if (!data.pembayaran) {
        tagihan += 300000;
      }
    });

    return tagihan;
  };

  // GENERATE NOMINAL
  const generateNominal = (telp: string) => {
    const tagihan = generateTagihan();
    const addToNominal = telp ? telp.slice(-3) : "000";
    return `${tagihan.toLocaleString("id").slice(0, -4)}.${addToNominal}`;
  };

  // IMAGE INPUT REF
  const inputImageRef = useRef<HTMLInputElement>(null);

  // VALIDATE IMAGE
  const imageChangeHandler = (file: File) => {
    if (validateImage(file, toastId)) {
      setImageSelected(file);
    } else {
      clearInputImage();
    }
  };

  // SET IMAGE PREVIEW
  useEffect(() => {
    if (imageSelected) setImagePreviewSrc(URL.createObjectURL(imageSelected));
  }, [imageSelected]);

  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (inputImageRef.current) inputImageRef.current.value = "";
    setImagePreviewSrc("");
  };

  const toastId = useRef(null);

  // SEND PEMBAYARAN
  const sendPembayaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !unpaidPesertas.length ||
      !imageSelected ||
      !noHp.length ||
      !kontingen
    ) {
      getInputError();
      return;
    }

    try {
      const { pesertas: updatedPesertas, kontingen: updatedKontingen } =
        await createPembayaran(
          kontingen,
          pesertas,
          imageSelected,
          noHp,
          generateTagihan(),
          toastId
        );
      setKontingen(updatedKontingen);
      addPesertas(updatedPesertas);
    } catch (error) {
      throw error;
    } finally {
      resetData();
    }
  };

  // GENERATE UNPAID PESERTA
  const getUnpaidPesertas = () => {
    let result: PesertaState[] = [];
    pesertas.map((peserta) => {
      if (!peserta.pembayaran) result.push(peserta);
    });
    setUnpaidPesertas(result);
  };

  // RESET DATA
  const resetData = () => {
    setnoHp("");
    setImageSelected(undefined);
    setImagePreviewSrc("");
    setInputErrorMessages(inputErrorInitialValue);
    setDisable(false);
  };

  // ERROR UPDATE LISTENER
  useEffect(() => {
    if (
      JSON.stringify(inputErrorMessages) !==
      JSON.stringify(inputErrorInitialValue)
    )
      getInputError();
  }, [noHp, inputErrorMessages, imageSelected]);

  // GET INPUT ERROR
  const getInputError = () => {
    setInputErrorMessages({
      ...inputErrorInitialValue,
      foto: !imageSelected ? "Tolong lengkapi foto bukti pembayaran" : null,
      noHp: !noHp.length ? "Tolong lengkapin No HP" : null,
    });
  };

  // INPUT FILE DISABLER
  useEffect(() => {
    if (inputImageRef.current) inputImageRef.current.disabled = disable;
  }, [disable]);

  useEffect(() => {
    getUnpaidPesertas();
  }, [pesertas]);

  return (
    <div>
      {/* DATA SUMMARY */}
      <div className="bg-gray-200 p-2 rounded-md mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold border-b-2 border-b-gray-700 pb-2 mb-2 w-fit">
          Ringkasan data Yang terdaftar
        </h1>
        <div className="border-b-2 border-b-gray-700 pb-2 mb-2">
          <h2 className="text-2xl font-bold">
            {kontingen?.namaKontingen || "-"}
          </h2>
          <div className="flex flex-wrap gap-1 items-baseline text-xl">
            <h3 className="font-semibold">Daftar Official</h3>
            <p className="whitespace-nowrap text-gray-700">
              (Total Official : {officials.length} orang)
            </p>
          </div>
          <TabelOfficial
            loading={false}
            kontingen={kontingen}
            data={officials}
          />
          <div className="flex flex-wrap gap-1 items-baseline text-xl mt-1">
            <h3 className="font-semibold">Daftar Peserta</h3>
            <p className="whitespace-nowrap text-gray-700">
              (Total Peserta : {pesertas.length} orang)
            </p>
          </div>
          <TabelPeserta loading={false} kontingen={kontingen} data={pesertas} />
        </div>
      </div>
      {/* DATA SUMMARY */}

      <div className="bg-gray-200 rounded-md p-2 mb-2">
        <Link
          href="https://chat.whatsapp.com/G10dT5i2t4OCrOXyhK5LR5"
          className="text-xl font-bold hover:underline"
          target="_blank"
        >
          Link Whatsapp Group Untuk Official
          <BsWhatsapp className="inline ml-2" />
        </Link>
      </div>

      {/* TOTAL TAGIHAN */}
      <div className="bg-gray-200 rounded-md p-2">
        <h1 className="text-2xl sm:text-3xl font-bold border-b-2 border-b-gray-700 pb-2 mb-2 w-fit">
          Total Tagihan
        </h1>

        {/* IMPORTANT NOTES */}
        <p className="p-2 bg-gray-100 rounded-md font-bold text-justify mb-2">
          <PiWarningCircleBold className="inline text-xl text-yellow-600 mr-1 animate-pulse" />
          PEMBAYARAN WAJIB PERKONTINGEN TIDAK OLEH PER ORANGAN/INDIVIDU KECUALI
          MEMANG HANYA DAFTAR 1 ATLET
        </p>
        {/* IMPORTANT NOTES */}

        <div className="flex flex-wrap">
          {/* KOLOM KIRI */}
          <div>
            {/* TABEL TAGIHAN */}
            <table className="whitespace-nowrap ">
              <thead>
                <tr className="text-center">
                  <th>Keterangan</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Biaya Pendaftaran</th>
                  <td className="text-end">Rp. 300.000</td>
                </tr>
                <tr>
                  <th>Jumlah Peserta</th>
                  <td className="text-end">{unpaidPesertas.length}</td>
                </tr>
                <tr className="font-bold">
                  <th>Total Biaya</th>
                  <td className="text-end">
                    Rp. {generateTagihan().toLocaleString("id")}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* TABEL TAGIHAN */}

            {/* KETENTUAN NOMINAL TRANSFER */}
            <div className="">
              <p>Nominal Transfer Wajib menggunakan akhiran 3 nomer telepon</p>
              <div className="flex flex-col w-[200px]">
                <label>No HP</label>
                <input
                  disabled={disable}
                  type="text"
                  onChange={(e) =>
                    setnoHp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  value={noHp}
                  className={`${
                    inputErrorMessages.noHp && "border-2 border-red-500"
                  }`}
                />
                <p className="text-red-500 text-center">
                  {inputErrorMessages.noHp}
                </p>
              </div>
              <div className="flex flex-col w-[200px]">
                <p>Nominal yang ditranfer: </p>
                <div className="bg-white w-full rounded-md px-1 translate-y-[1px] flex justify-between">
                  <span>Rp. {generateNominal(noHp)}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        generateNominal(noHp).replace(/[^0-9]/g, "")
                      );
                    }}
                  >
                    <FiCopy className="inline" />
                  </button>
                </div>
              </div>
            </div>
            {/* KETENTUAN NOMINAL TRANSFER */}

            {/* FASILITAS */}
            <div>
              <h5 className="mt-2">Fasilitas yang didapatkan:</h5>
              <ol>
                <li>1. Kartu Bandung Juara</li>
                <li>2. Buku rekening BJB</li>
                <li>3. Asuransi BPJS Ketenagakerjaan</li>
              </ol>
            </div>
            {/* FASILITAS */}

            {/* CONTACT PERSON */}
            <div className="flex flex-col ">
              <p>Setelah melakukan Pembayaran harap konfirmasi ke</p>
              <div className="w-fit">
                <div className="flex justify-between">
                  <p>Bob - 085794163821 </p>
                  <div>
                    <Link
                      href="https://wa.me/6285794163821"
                      target="_blank"
                      className="btn_wa"
                    >
                      <BsWhatsapp className="inline" />
                    </Link>{" "}
                    <button
                      className="btn_copy"
                      onClick={() => {
                        navigator.clipboard.writeText("6285794163821");
                      }}
                    >
                      <FiCopy className="inline" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p>Dede - 085759114495</p>
                  <div>
                    <Link
                      href="https://wa.me/6285759114495"
                      target="_blank"
                      className="btn_wa"
                    >
                      <BsWhatsapp className="inline" />
                    </Link>{" "}
                    <button
                      className="btn_copy"
                      onClick={() => {
                        navigator.clipboard.writeText("6285759114495");
                      }}
                    >
                      <FiCopy className="inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* CONTACT PERSON */}
          </div>
          {/* KOLOM KIRI */}

          {/* KOLOM KANAN */}
          <div className="w-[400px] lg:mx-auto">
            {/* REKENING */}
            <div className="bg-custom-navy p-2 rounded-md text-custom-yellow  text-center flex flex-col justify-around ">
              <p className="text-lg border-b border-b-custom-gold mb-1">
                Tagihan dibayarkan melalui Rekening
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="text-center">
                  <Image
                    src={logo_bjb}
                    alt="logo bjb"
                    className="w-24 h-fit mx-auto bg-white rounded-md p-2"
                  />
                  <p className="mx-auto">0129228164100 </p>
                  <p>a.n. ANDRA RAMDHAN MALELA POETRA</p>
                </div>
                <button
                  className="btn_copy"
                  onClick={() => {
                    navigator.clipboard.writeText("0129228164100");
                  }}
                >
                  <FiCopy className="inline" />
                </button>
              </div>
            </div>
            {/* REKENING */}

            {/* UPLOAD BUKTI PEMBAYARAN */}
            <form
              className="input_container max-w-[170px] flex flex-col items-center mx-auto"
              onSubmit={(e) => sendPembayaran(e)}
            >
              <label className="input_label text-center">
                Bukti Pembayaran
              </label>
              <p className="-mt-2 text-sm text-gray-600">Maks. 1MB</p>
              <div
                className={`
            ${inputErrorMessages.foto ? "input_error" : "input"}
            bg-white w-[150px] h-[200px] relative border-2 rounded-md`}
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
                disabled={disable}
                ref={inputImageRef}
                accept=".jpg, .jpeg, .png"
                type="file"
                multiple={false}
                onChange={(e) =>
                  e.target.files && imageChangeHandler(e.target.files[0])
                }
                className=" mt-1 w-full text-transparent input_bukti"
              />
              <p className="text-red-500 text-center">
                {inputErrorMessages.foto}
              </p>
              <button
                className="btn_green btn_full w-fit text-sm font-bold"
                type="submit"
                disabled={unpaidPesertas.length < 1}
              >
                Simpan
              </button>
              {/* IMPORTANT NOTES */}
            </form>
            <p className="p-2 bg-gray-100 rounded-md font-bold text-center mt-1">
              <PiWarningCircleBold className="inline text-xl text-yellow-600 mr-1 animate-pulse" />
              REFRESH HALAMAN SETELAH UPLOAD BUKTI PEMBAYARAN
            </p>
            {/* IMPORTANT NOTES */}
            {/* UPLOAD BUKTI PEMBAYARAN */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormPembayaran;
