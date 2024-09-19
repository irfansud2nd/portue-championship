import { AdminContext } from "@/context/AdminContext";
import { getKontingenUnpaid } from "@/utils/adminFunctions";
import { KontingenState, PesertaState } from "@/utils/types";
import InlineLoading from "./InlineLoading";
import TabelKuota from "./tabels/TabelKuota";
import TabelTingkatan from "./TabelTingkatan";

import Verified from "../Verified";

const DashboardAdmin = () => {
  const {
    fetchAll,
    fetchKontingens,
    fetchOfficials,
    fetchPesertas,
    kontingens,
    pesertas,
    officials,
    kontingensLoading,
    pesertasLoading,
    officialsLoading,
    setMode,
    getUnconfirmedKontingens,
    getConfirmedKontingens,
  } = AdminContext();

  const getPesertasPayment = (pesertas: PesertaState[]) => {
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
    let unconfirmedData: KontingenState[] = [];
    let confirmed = 0;
    kontingens.map((kontingen: KontingenState) => {
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

  const getNominalConfirmed = () => {
    let nominal = 0;
    kontingens.map((kontingen: KontingenState) => {
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
    let unverifiedKontingen: any = [];
    let verifiedKontingen: any = [];

    pesertas.map((peserta: any) => {
      if (peserta.keteranganSehat == true) {
        pesertaVerified.push(peserta);
        if (!verifiedKontingen.includes(peserta.idKontingen)) {
          verifiedKontingen.push(peserta.idKontingen);
        }
      } else {
        if (!unverifiedKontingen.includes(peserta.idKontingen)) {
          unverifiedKontingen.push(peserta.idKontingen);
        }
      }
    });

    const halfVerifiedKontingen = verifiedKontingen.filter((item: any) =>
      unverifiedKontingen.includes(item)
    );

    return {
      pesertaVerified,
      unverifiedKontingen,
      verifiedKontingen,
      halfVerifiedKontingen,
    };
  };

  const {
    confirmed: confirmedPeserta,
    unconfirmed: unconfirmedPeserta,
    unpaid: unpaidPeserta,
  } = getPesertasPayment(pesertas);

  const {
    confirmed: confirmedKontingen,
    unconfirmed: unconfirmedKontingen,
    unpaid: unpaidKontingen,
  } = getKontingensPayment();

  const {
    pesertaVerified,
    verifiedKontingen,
    halfVerifiedKontingen,
    unverifiedKontingen,
  } = getVerified();

  return (
    <div className="w-full h-full bg-gray-200 rounded-md p-2">
      <h1 className="text-4xl font-extrabold">Dashboard Admin</h1>
      <button className="btn_green btn_full" onClick={fetchAll}>
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
            <button onClick={fetchKontingens} className="btn_green btn_full">
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
            <button onClick={fetchOfficials} className="btn_green btn_full">
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
            <button onClick={fetchPesertas} className="btn_green btn_full">
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
            {pesertasLoading ? <InlineLoading /> : confirmedPeserta}{" "}
            {/* | {pesertaConfirmed} */}
          </p>
          <button
            className="text-2xl font-extrabold text-green-500"
            onClick={getConfirmedKontingens}
          >
            {kontingensLoading ? <InlineLoading /> : confirmedKontingen}
            {/* |{kontingenConfirmed} */}
          </button>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white px-2">
            Unconfirmed
          </p>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
            {pesertasLoading ? <InlineLoading /> : unconfirmedPeserta}{" "}
            {/* | {pesertaUnconfimed} */}
          </p>
          <button
            className="text-2xl font-extrabold text-yellow-500 hover:underline"
            onClick={getUnconfirmedKontingens}
          >
            {kontingensLoading ? <InlineLoading /> : unconfirmedKontingen}
            {/* |{kontingenConfirmed} */}
          </button>
          <p className="text-2xl font-extrabold text-blue-500  border-r-2 border-r-white">
            Paid
          </p>
          <p className="text-2xl font-extrabold text-blue-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              confirmedPeserta + unconfirmedPeserta
            )}{" "}
            {/* | {pesertaPaid} */}
          </p>
          <p className="text-2xl font-extrabold text-blue-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              unconfirmedKontingen + confirmedKontingen
            )}
            {/* |{kontingenPaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            Unpaid
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            {pesertasLoading ? <InlineLoading /> : unpaidPeserta}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500">
            {kontingensLoading ? <InlineLoading /> : unpaidKontingen}
            {/* |{kontingenUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-green-500  border-r-2 border-r-white">
            Verified
          </p>
          <p className="text-2xl font-extrabold text-green-500  border-r-2 border-r-white">
            {pesertasLoading ? <InlineLoading /> : pesertaVerified.length}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-green-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              verifiedKontingen.length - halfVerifiedKontingen.length
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
              halfVerifiedKontingen.length
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
              pesertas.length - pesertaVerified.length
            )}{" "}
            {/* | {pesertaUnpaid} */}
          </p>
          <p className="text-2xl font-extrabold text-red-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              unverifiedKontingen.length - halfVerifiedKontingen.length
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
