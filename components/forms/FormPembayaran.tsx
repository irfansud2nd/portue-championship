"use client";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import { useEffect, useState, useRef } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "@/context/Context";
import { firestore, storage } from "@/utils/firebase";
import {
  compare,
  limitImage,
  newToast,
  updateToast,
} from "@/utils/sharedFunctions";
import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { PiWarningCircleBold } from "react-icons/pi";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import TabelOfficial from "../tabel/TabelOfficial";
import TabelPeserta from "../tabel/TabelPeserta";

const FormPembayaran = ({
  kontingens,
  officials,
  pesertas,
}: {
  kontingens: DataKontingenState[];
  officials: DataOfficialState[];
  pesertas: DataPesertaState[];
}) => {
  const [fetchedOfficials, setFetchedOfficials] = useState<any[]>([]);
  const [fetchedPesertas, setFetchedPesertas] = useState<any[]>([]);
  const [fetched, setFetched] = useState({
    officials: false,
    pesertas: false,
  });
  const [tabelOfficialLoading, setTabelOfficialLoading] = useState(false);
  const [tabelPesertaLoading, setTabelPesertaLoading] = useState(false);
  const [noHp, setnoHp] = useState("");
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [imageSelected, setImageSelected] = useState<File | null>();

  const inputErrorInitialValue = { foto: null, noHp: null };
  const [inputErrorMessages, setInputErrorMessages] = useState<{
    foto: string | null;
    noHp: string | null;
  }>(inputErrorInitialValue);

  const { user, disable, setDisable } = MyContext();

  // FETCH OFFICIALS IF OFFICIALS EMPTY
  useEffect(() => {
    if (
      !fetched.officials &&
      !fetchedOfficials.length &&
      !officials.length &&
      user
    ) {
      setTabelOfficialLoading(true);
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
        .catch((error) => newToast(toastId, "error", error.messages))
        .finally(() => {
          setFetchedOfficials(container.sort(compare("namaLengkap", "asc")));
          setTabelOfficialLoading(false);
          setFetched({ ...fetched, officials: true });
        });
    }
  }, [fetchedOfficials, officials, fetched.officials, user]);

  // FETCH PESERTAS IF PESERTAS EMPTY
  useEffect(() => {
    if (
      !fetched.pesertas &&
      !fetchedPesertas.length &&
      !pesertas.length &&
      user
    ) {
      fetchPesertas();
    }
  }, [fetchedPesertas, pesertas, fetched.pesertas, user]);

  // FETSCH PESETAS
  const fetchPesertas = () => {
    setTabelPesertaLoading(true);
    const container: any[] = [];
    const q = query(
      collection(firestore, "pesertas"),
      where("creatorUid", "==", user.uid)
    );
    getDocs(q)
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          container.push(doc.data());
        })
      )
      .catch((error) => newToast(toastId, "error", error.messages))
      .finally(() => {
        setFetchedPesertas(container.sort(compare("namaLengkap", "asc")));
        setTabelPesertaLoading(false);
        setFetched({ ...fetched, pesertas: true });
      });
  };

  // GROUPING OFFICIALS
  const selectOfficials = (idKontingen: string) => {
    const selectedOfficials: DataOfficialState[] = [];
    if (officials.length >= fetchedOfficials.length) {
      officials.map((official, i) => {
        if (official.idKontingen == idKontingen) {
          selectedOfficials.push(officials[i]);
        }
      });
    } else {
      fetchedOfficials.map((official, i) => {
        if (official.idKontingen == idKontingen) {
          selectedOfficials.push(fetchedOfficials[i]);
        }
      });
    }
    return selectedOfficials;
  };

  // GROUPING PESERTAS
  const selectPesertas = (idKontingen: string) => {
    const selectedPesertas: DataPesertaState[] = [];
    if (pesertas.length >= fetchedPesertas.length) {
      pesertas.map((peserta, i) => {
        if (peserta.idKontingen == idKontingen)
          selectedPesertas.push(pesertas[i]);
      });
    } else {
      fetchedPesertas.map((peserta, i) => {
        if (peserta.idKontingen == idKontingen)
          selectedPesertas.push(fetchedPesertas[i]);
      });
    }
    return selectedPesertas;
  };

  // GENERATE TAGIHAN
  const generateTagihan = () => {
    let tagihan = 0;
    if (pesertas.length >= fetchedPesertas.length) {
      pesertas.map((data, i) => {
        if (data.waktuPembayaran == "") {
          tagihan += 300000;
        }
      });
    } else {
      fetchedPesertas.map((data, i) => {
        if (data.waktuPembayaran == "") {
          tagihan += 300000;
        }
      });
    }
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

  const toastId = useRef(null);

  // SEND PEMBAYARAN
  const sendPembayaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (getUnpaidPeserta()) {
      if (noHp != "" && imageSelected) {
        newToast(toastId, "loading", "sending image");
        setDisable(true);
        const time = Date.now();
        const url = `buktiPembayarans/${time}-${v4()}.${
          imageSelected.type.split("/")[1]
        }`;
        uploadBytes(ref(storage, url), imageSelected).then((snapshot) =>
          getDownloadURL(snapshot.ref).then((downloadUrl) => {
            updateToast(toastId, "loading", "sending url to pesertas");
            sendUrlToPesertas(
              downloadUrl,
              pesertas.length
                ? pesertas.length - 1
                : fetchedPesertas.length - 1,
              time
            );
          })
        );
      } else {
        getInputError();
      }
    } else {
      newToast(toastId, "error", "Tidak ada peserta yang belum dibayar");
    }
  };

  // SEND URL TO ALL PESERTA
  const sendUrlToPesertas = (
    url: string,
    pesertasIndex: number,
    time: number
  ) => {
    const id =
      pesertas.length >= fetchedPesertas.length
        ? pesertas[pesertasIndex].id
        : fetchedPesertas[pesertasIndex].id;
    const paid =
      pesertas.length >= fetchedPesertas.length
        ? pesertas[pesertasIndex].waktuPembayaran
        : fetchedPesertas[pesertasIndex].waktuPembayaran;
    if (pesertasIndex >= 0) {
      if (!paid) {
        if (id) {
          updateDoc(doc(firestore, "pesertas", id), {
            waktuPembayaran: time,
            downloadBuktiPembayaranUrl: url,
          })
            .then(() => {
              sendUrlToPesertasRepeater(url, pesertasIndex - 1, time);
            })
            .catch((error) =>
              updateToast(
                toastId,
                "error",
                `Gagal menyimpan data pembayaran ke peserta. ${error.messages}`
              )
            );
        } else {
          alert("id undefined");
        }
      } else {
        sendUrlToPesertasRepeater(url, pesertasIndex - 1, time);
      }
    } else {
      updateToast(toastId, "loading", "sending url to kontingen");
      sendUrlToKontingen(url, kontingens.length - 1, time);
    }
  };

  const sendUrlToPesertasRepeater = (
    url: string,
    pesertasIndex: number,
    time: number
  ) => {
    if (pesertasIndex <= 0) {
      updateToast(toastId, "loading", "sending url to kontingen");
      sendUrlToKontingen(url, kontingens.length - 1, time);
    } else {
      sendUrlToPesertas(url, pesertasIndex - 1, time);
    }
  };

  // SEND URL TO ALL KONTINGEN
  const sendUrlToKontingen = (
    url: string,
    kontingenIndex: number,
    time: number
  ) => {
    const id = kontingens[kontingenIndex].idKontingen;
    if (kontingenIndex >= 0) {
      if (id) {
        updateDoc(doc(firestore, "kontingens", id), {
          creatorPhoneNumber: arrayUnion(noHp),
          waktuPembayaran: arrayUnion(time),
          downloadBuktiPembayaranUrl: arrayUnion(`${time}-separator-${url}`),
        })
          .then(() => {
            if (kontingenIndex != 0) {
              sendUrlToKontingen(url, kontingenIndex - 1, time);
            } else {
              updateToast(toastId, "success", "done");
              resetData();
            }
          })
          .catch((error) =>
            updateToast(
              toastId,
              "error",
              `Gagal menyimpan data pembayaran ke kontingen ${error.messages}`
            )
          );
      } else {
        newToast(toastId, "error", "id undefined");
      }
    }
  };

  // GENERATE UNPAID PESERTA
  const getUnpaidPeserta = () => {
    let unpaidPeserta = 0;
    if (pesertas.length >= fetchedPesertas.length) {
      pesertas.map((data) => {
        if (data.waktuPembayaran == "") unpaidPeserta += 1;
      });
    } else {
      fetchedPesertas.map((data) => {
        if (data.waktuPembayaran == "") unpaidPeserta += 1;
      });
    }
    return unpaidPeserta;
  };

  // RESET DATA
  const resetData = () => {
    fetchPesertas();
    setnoHp("");
    setImageSelected(null);
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

  return (
    <div>
      <ToastContainer />
      {/* DATA SUMMARY */}
      <div className="bg-gray-200 p-2 rounded-md mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold border-b-2 border-b-gray-700 pb-2 mb-2 w-fit">
          Ringkasan data Yang terdaftar
        </h1>
        {kontingens.map((kontingen) => (
          <div className="border-b-2 border-b-gray-700 pb-2 mb-2">
            <h2 className="text-2xl font-bold">{kontingen.namaKontingen}</h2>
            <div className="flex flex-wrap gap-1 items-baseline text-xl">
              <h3 className="font-semibold">Daftar Official</h3>
              <p className="whitespace-nowrap text-gray-700">
                (Total Official :{" "}
                {selectOfficials(kontingen.idKontingen).length} orang)
              </p>
            </div>
            <TabelOfficial
              loading={tabelOfficialLoading}
              kontingens={kontingens}
              data={selectOfficials(kontingen.idKontingen)}
            />
            <div className="flex flex-wrap gap-1 items-baseline text-xl mt-1">
              <h3 className="font-semibold">Daftar Peserta</h3>
              <p className="whitespace-nowrap text-gray-700">
                (Total Peserta : {selectPesertas(kontingen.idKontingen).length}{" "}
                orang)
              </p>
            </div>
            <TabelPeserta
              loading={tabelPesertaLoading}
              kontingens={kontingens}
              data={selectPesertas(kontingen.idKontingen)}
            />
          </div>
        ))}
      </div>
      {/* DATA SUMMARY */}

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
                  <td className="text-end">{getUnpaidPeserta()}</td>
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
                disabled={disable}
              >
                Simpan
              </button>
            </form>
            {/* UPLOAD BUKTI PEMBAYARAN */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormPembayaran;
