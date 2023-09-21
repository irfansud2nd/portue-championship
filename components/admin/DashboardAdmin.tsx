import { AdminContext } from "@/context/AdminContext";
import { getKontingenUnpaid } from "@/utils/adminFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import InlineLoading from "./InlineLoading";
import { tingkatanKategori } from "@/utils/constants";

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
    getUnconfirmesKontingens,
    cekKuota,
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
    let confirmed = 0;
    kontingens.map((kontingen: DataKontingenState) => {
      if (getKontingenUnpaid(kontingen, pesertas) > 0) unpaid += 1;
      if (kontingen.unconfirmedPembayaran.length) {
        unconfirmed += 1;
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
      <div>
        <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit mt-2">
          <p className="font-semibold text-lg">Pembayaran</p>
          <div className="grid grid-cols-[repeat(3,_auto)] grid-rows-[repeat(4,_auto)] w-fit">
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
              onClick={getUnconfirmesKontingens}
            >
              {kontingensLoading ? (
                <InlineLoading />
              ) : (
                getKontingensPayment().unconfirmed
              )}
            </button>
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
      </div>

      {/* THIRD ROW */}
      <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit min-w-[500px] mt-2">
        <p className="font-semibold text-lg">Sisa Kuota</p>
        <div className="grid grid-rows-[repeat(4,_auto)] grid-cols-[repeat(4,_auto)] ">
          <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-yellow-500">
            Tingkatan
          </p>
          <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-yellow-500">
            Kategori
          </p>
          <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-yellow-500 px-2">
            Putra
          </p>
          <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-yellow-500 px-2">
            Putri
          </p>
          <p className="border-r-2 border-white border-b-2 border-b-yellow-500">
            SMA Tanding
          </p>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
            ].kategoriTanding.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 px-2 whitespace-nowrap"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
            ].kategoriTanding.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {cekKuota("SMA", item, "Putra")}
              </p>
            ))}
          </div>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
            ].kategoriTanding.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {cekKuota("SMA", item, "Putri")}
              </p>
            ))}
          </div>
          <p className="border-r-2 border-white border-b-2 border-b-yellow-500">
            SMA Seni
          </p>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
            ].kategoriSeni.putra.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 odd:bg-gray-800"
                key={item}
              >
                {item.replace(" Putra", "")}
              </p>
            ))}
          </div>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
            ].kategoriSeni.putra.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 odd:bg-gray-800"
                key={item}
              >
                {cekKuota("SMA", item, "Putra")}
              </p>
            ))}
          </div>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
            ].kategoriSeni.putri.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 odd:bg-gray-800"
                key={item}
              >
                {cekKuota("SMA", item, "Putri")}
              </p>
            ))}
          </div>
          <p className="border-r-2 border-white  border-b-2 border-b-yellow-500">
            Dewasa Tanding
          </p>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
            ].kategoriTanding.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
            ].kategoriTanding.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {cekKuota("Dewasa", item, "Putra")}
              </p>
            ))}
          </div>
          <div className="border-b-2 border-b-yellow-500">
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
            ].kategoriTanding.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {cekKuota("Dewasa", item, "Putri")}
              </p>
            ))}
          </div>
          <p className="border-r-2 border-white">Dewasa Seni</p>
          <div>
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
            ].kategoriSeni.putra.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {item.replace(" Putra", "")}
              </p>
            ))}
          </div>
          <div>
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
            ].kategoriSeni.putra.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {cekKuota("Dewasa", item, "Putra")}
              </p>
            ))}
          </div>
          <div>
            {tingkatanKategori[
              tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
            ].kategoriSeni.putri.map((item) => (
              <p
                className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800"
                key={item}
              >
                {cekKuota("Dewasa", item, "Putri")}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardAdmin;
