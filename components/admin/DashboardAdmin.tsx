import { AdminContext } from "@/context/AdminContext";
import { getKontingenUnpaid } from "@/utils/adminFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import InlineLoading from "./InlineLoading";
import TabelKuota from "./tabels/TabelKuota";
import TabelTingkatan from "./TabelTingkatan";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import Verified from "../Verified";

const DashboardAdmin = () => {
  const [pesertaTerdaftar, setPesertaTerdaftar] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [officialTerdaftar, setOfficialTerdaftar] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [kontingenTerdaftar, setKontingenTerdaftar] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [pesertaUnconfimed, setPesertaUnconfimed] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [pesertaConfirmed, setPesertaConfirmed] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [pesertaPaid, setPesertaPaid] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const [pesertaUnpaid, setPesertaUnpaid] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const [kontingenUnconfimed, setKontingenUnconfimed] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [kontingenConfirmed, setKontingenConfirmed] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [kontingenPaid, setKontingenPaid] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const [kontingenUnpaid, setKontingenUnpaid] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const {
    kontingens,
    pesertas,
    officials,
    kontingensLoading,
    pesertasLoading,
    officialsLoading,
    refreshKontingens,
    refreshOfficials,
    refreshPesertas,
    refreshAll,
    setMode,
    getUnconfirmedKontingens,
    getConfirmedKontingens,
  } = AdminContext();

  const getPesertasPayment = (pesertas: DataPesertaState[]) => {
    let unpaid = 0;
    let unconfirmed = 0;
    let confirmed = 0;
    pesertas.map((peserta) => {
      if (!peserta.pembayaran) {
        unpaid += 1;
      }
      if (!peserta.confirmedPembayaran && peserta.pembayaran) {
        unconfirmed += 1;
      }
      if (peserta.confirmedPembayaran) {
        confirmed += 1;
      }
    });
    return { unpaid, unconfirmed, confirmed };
  };

  const getKontingensPayment = () => {
    let unpaid = 0;
    let unconfirmed = 0;
    let unconfirmedData: DataKontingenState[] = [];
    let confirmed = 0;
    kontingens.map((kontingen: DataKontingenState) => {
      if (getKontingenUnpaid(kontingen, pesertas) > 0) unpaid += 1;
      if (kontingen.unconfirmedPembayaran.length) {
        unconfirmed += 1;
        unconfirmedData.push(kontingen);
      }
      if (kontingen.confirmedPembayaran.length) {
        confirmed += 1;
      }
    });
    return { unpaid, unconfirmed, confirmed };
  };

  const getJumlahKontingen = () => {
    setKontingenTerdaftar(<InlineLoading />);
    getCountFromServer(collection(firestore, "kontingens")).then((snapshot) =>
      setKontingenTerdaftar(snapshot.data().count)
    );
  };

  const getJumlahOfficial = () => {
    setOfficialTerdaftar(<InlineLoading />);
    getCountFromServer(collection(firestore, "officials")).then((snapshot) =>
      setOfficialTerdaftar(snapshot.data().count)
    );
  };

  const getJumlahPeserta = () => {
    setPesertaTerdaftar(<InlineLoading />);
    getCountFromServer(collection(firestore, "pesertas")).then((snapshot) =>
      setPesertaTerdaftar(snapshot.data().count)
    );
  };

  const getPesertaConfirmed = () => {
    setPesertaConfirmed(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("confirmedPembayaran", "==", true)
      )
    ).then((snapshot) => setPesertaConfirmed(snapshot.data().count));
  };

  const getPesertaUnconfirmed = () => {
    setPesertaUnconfimed(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("confirmedPembayaran", "==", false),
        where("pembayaran", "==", true)
      )
    ).then((snapshot) => setPesertaUnconfimed(snapshot.data().count));
  };

  const getPesertaPaid = () => {
    setPesertaPaid(<InlineLoading />);
    getCountFromServer(
      query(collection(firestore, "pesertas"), where("pembayaran", "==", true))
    ).then((snapshot) => setPesertaPaid(snapshot.data().count));
  };

  const getPesertaUnpaid = () => {
    setPesertaUnpaid(<InlineLoading />);
    getCountFromServer(
      query(collection(firestore, "pesertas"), where("pembayaran", "==", false))
    ).then((snapshot) => setPesertaUnpaid(snapshot.data().count));
  };

  const getKontingenConfirmed = () => {
    setPesertaConfirmed(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "kontingens"),
        where("confirmedPembayaran", "!=", "[]")
      )
    ).then((snapshot) => setKontingenUnconfimed(snapshot.data().count));
  };

  const getKontingenUnconfirmed = () => {
    setPesertaUnconfimed(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "kontingens"),
        where("unconfirmedPembayaran", "!=", "[]"),
        where("pembayaran", "==", true)
      )
    ).then((snapshot) => setPesertaUnconfimed(snapshot.data().count));
  };

  const getKontingenPaid = () => {
    setPesertaPaid(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "!=", "[]")
      )
    ).then((snapshot) => setPesertaPaid(snapshot.data().count));
  };

  const getKontingenUnpaidd = () => {
    setPesertaUnpaid(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "==", [])
      )
    ).then((snapshot) => setPesertaUnpaid(snapshot.data().count));
  };

  const getAllJumlah = () => {
    getJumlahKontingen();
    getJumlahOfficial();
    getJumlahPeserta();
  };

  const getAllPayment = () => {
    getPesertaUnconfirmed();
    getPesertaConfirmed();
    getPesertaPaid();
    getPesertaUnpaid();
    // getKontingenConfirmed();
    // getKontingenUnconfirmed();
    // getKontingenUnpaidd();
    // getKontingenPaid();
  };

  useEffect(() => {
    getAllJumlah();
    getAllPayment();
  }, []);

  const getNominalConfirmed = () => {
    let nominal = 0;
    kontingens.map((kontingen: DataKontingenState) => {
      if (kontingen.confirmedPembayaran.length) {
        kontingen.confirmedPembayaran.map((idPembayaran) => {
          let arr = [];
          arr =
            kontingen.infoPembayaran[
              kontingen.infoPembayaran.findIndex(
                (item) => item.idPembayaran == idPembayaran
              )
            ].nominal.split("");
          arr.splice(-3, 3);
          nominal += parseFloat(arr.join("").replace(/[Rp.,\s]/g, ""));
        });
      }
    });
    let arr = [];
    arr = nominal.toString().split("");
    arr.splice(-3, 3);
    return (nominal * 1000).toLocaleString("id");
  };

  const getVerified = () => {
    let pesertaVerified: any = [];
    let unVerifyKontingen: any = [];
    let verifiedKontingen: any = [];

    pesertas.map((peserta: any) => {
      if (peserta.keteranganSehat == true) {
        pesertaVerified.push(peserta);
        if (!verifiedKontingen.includes(peserta.idKontingen)) {
          verifiedKontingen.push(peserta.idKontingen);
        }
      } else {
        if (!unVerifyKontingen.includes(peserta.idKontingen)) {
          unVerifyKontingen.push(peserta.idKontingen);
        }
      }
    });

    const halfVerifiedKontingen = verifiedKontingen.filter((item: any) =>
      unVerifyKontingen.includes(item)
    );

    return {
      pesertaVerified,
      unVerifyKontingen,
      verifiedKontingen,
      halfVerifiedKontingen,
    };
  };

  return (
    <div className="w-full h-full bg-gray-200 rounded-md p-2">
      <h1 className="text-4xl font-extrabold">Dashboard Admin</h1>
      <button className="btn_green btn_full" onClick={refreshAll}>
        Refresh All
      </button>
      <button
        className="btn_green btn_full ml-1"
        onClick={() => setMode("custom")}
      >
        Custom Table
      </button>

      {/* FIRST ROW */}
      <div className="flex gap-2 flex-wrap mt-2">
        <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md">
          <p className="font-semibold text-lg">Total Kontingen terdaftar</p>
          <p className="text-2xl font-extrabold text-green-500">
            {/* {kontingenTerdaftar} */}
            {kontingensLoading ? <InlineLoading /> : kontingens.length}
          </p>
          <div className="flex justify-center gap-2">
            {/* <button onClick={getJumlahKontingen} className="btn_green btn_full"> */}
            <button onClick={refreshKontingens} className="btn_green btn_full">
              Refresh
            </button>
            <button
              onClick={() => setMode("kontingen")}
              className="btn_green btn_full"
            >
              Show Table
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md">
          <p className="font-semibold text-lg">Total Official terdaftar</p>
          <p className="text-2xl font-extrabold text-green-500">
            {/* {loading.officialTerdaftar ? <InlineLoading /> : terdaftar.official} */}
            {/* {officialTerdaftar} */}
            {officialsLoading ? <InlineLoading /> : officials.length}
          </p>
          <div className="flex justify-center gap-2">
            {/* <button onClick={getJumlahOfficial} className="btn_green btn_full"> */}
            <button onClick={refreshOfficials} className="btn_green btn_full">
              Refresh
            </button>
            <button
              onClick={() => setMode("official")}
              className="btn_green btn_full"
            >
              Show Table
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md">
          <p className="font-semibold text-lg">Total Peserta terdaftar</p>
          <p className="text-2xl font-extrabold text-green-500">
            {/* {loading.pesertaTerdaftar ? <InlineLoading /> : terdaftar.peserta} */}
            {/* {pesertaTerdaftar} */}
            {pesertasLoading ? <InlineLoading /> : pesertas.length}
          </p>
          <div className="flex justify-center gap-2">
            {/* <button onClick={getJumlahPeserta} className="btn_green btn_full"> */}
            <button onClick={refreshPesertas} className="btn_green btn_full">
              Refresh
            </button>
            <button
              onClick={() => setMode("peserta")}
              className="btn_green btn_full"
            >
              Show Table
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white w-fit rounded-md p-2 mt-2">
        <Verified detail />
      </div>

      {/* SECOND ROW */}
      <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit mt-2">
        <p className="font-semibold text-lg">Pembayaran</p>
        <p>
          Total Dana Masuk:{" "}
          {kontingens.length ? getNominalConfirmed() : <InlineLoading />}
        </p>
        <button
          className="btn_green btn_full mb-1"
          onClick={() => setMode("pembayaran")}
        >
          Tabel Pembayaran
        </button>
        <div className="grid grid-cols-[repeat(3,_auto)] grid-rows-[repeat(5,_auto)] w-fit">
          <p className="font-semibold text-lg border-r-2 border-r-white">
            Keterangan
          </p>
          <p className="font-semibold text-lg border-r-2 border-r-white px-2">
            Peserta
          </p>
          <p className="font-semibold text-lg px-2">Kontingen</p>
          <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
            Confirmed
          </p>
          <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getPesertasPayment(pesertas).confirmed
            )}{" "}
            {/* | {pesertaConfirmed} */}
          </p>
          <button
            className="text-2xl font-extrabold text-green-500"
            onClick={getConfirmedKontingens}
          >
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().confirmed
            )}
            {/* |{kontingenConfirmed} */}
          </button>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white px-2">
            Unconfirmed
          </p>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getPesertasPayment(pesertas).unconfirmed
            )}{" "}
            {/* | {pesertaUnconfimed} */}
          </p>
          <button
            className="text-2xl font-extrabold text-yellow-500 hover:underline"
            onClick={getUnconfirmedKontingens}
          >
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().unconfirmed
            )}
            {/* |{kontingenConfirmed} */}
          </button>
          <p className="text-2xl font-extrabold text-blue-500  border-r-2 border-r-white">
            Paid
          </p>
          <p className="text-2xl font-extrabold text-blue-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getPesertasPayment(pesertas).confirmed +
              getPesertasPayment(pesertas).unconfirmed
            )}{" "}
            {/* | {pesertaPaid} */}
          </p>
          <p className="text-2xl font-extrabold text-blue-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().unconfirmed +
              getKontingensPayment().confirmed
            )}
            {/* |{kontingenPaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            Unpaid
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getPesertasPayment(pesertas).unpaid
            )}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().unpaid
            )}
            {/* |{kontingenUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-green-500  border-r-2 border-r-white">
            Verified
          </p>
          <p className="text-2xl font-extrabold text-green-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getVerified().pesertaVerified.length
            )}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-green-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getVerified().verifiedKontingen.length -
              getVerified().halfVerifiedKontingen.length
            )}
            {/* |{kontingenUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
            Not Fully Verified
          </p>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
            {pesertasLoading ? <InlineLoading /> : "-"}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-yellow-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getVerified().halfVerifiedKontingen.length
            )}
            {/* |{kontingenUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            Unverified
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              pesertas.length - getVerified().pesertaVerified.length
            )}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getVerified().unVerifyKontingen.length -
              getVerified().halfVerifiedKontingen.length
            )}
            {/* |{kontingenUnpaid} */}
          </p>
        </div>
      </div>

      {/* THIRD ROW */}
      <TabelKuota />

      {/* FOURTH ROW */}
      <TabelTingkatan />
    </div>
  );
};
export default DashboardAdmin;
