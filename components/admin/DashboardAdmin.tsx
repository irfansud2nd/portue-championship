import { AdminContext } from "@/context/AdminContext";
import { getKontingenUnpaid } from "@/utils/adminFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import InlineLoading from "./InlineLoading";
import TabelKuota from "./tabels/TabelKuota";
import TabelTingkatan from "./TabelTingkatan";

const DashboardAdmin = () => {
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
            {kontingensLoading ? <InlineLoading /> : kontingens.length}
          </p>
          <div className="flex justify-center gap-2">
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
            {officialsLoading ? <InlineLoading /> : officials.length}
          </p>
          <div className="flex justify-center gap-2">
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
            {pesertasLoading ? <InlineLoading /> : pesertas.length}
          </p>
          <div className="flex justify-center gap-2">
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

      {/* SECOND ROW */}
      <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit mt-2">
        <p className="font-semibold text-lg">Pembayaran</p>
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
            )}
          </p>
          <p className="text-2xl font-extrabold text-green-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().confirmed
            )}
          </p>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white px-2">
            Unconfirmed
          </p>
          <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getPesertasPayment(pesertas).unconfirmed
            )}
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
            )}
          </p>
          <p className="text-2xl font-extrabold text-blue-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().unconfirmed +
              getKontingensPayment().confirmed
            )}
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            Unpaid
          </p>
          <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
            {pesertasLoading ? (
              <InlineLoading />
            ) : (
              getPesertasPayment(pesertas).unpaid
            )}
          </p>
          <p className="text-2xl font-extrabold text-red-500">
            {kontingensLoading ? (
              <InlineLoading />
            ) : (
              getKontingensPayment().unpaid
            )}
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
