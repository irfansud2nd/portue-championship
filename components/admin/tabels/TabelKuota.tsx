import { AdminContext } from "@/context/AdminContext";
import { tingkatanKategori } from "@/utils/constants";

const TabelKuota = () => {
  const { cekKuota, setSelectedKategori, setMode } = AdminContext();
  return (
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
            <button
              className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`SMA,${item},Putra`);
              }}
            >
              {cekKuota("SMA", item, "Putra")}
            </button>
          ))}
        </div>
        <div className="border-b-2 border-b-yellow-500">
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
          ].kategoriTanding.map((item) => (
            <button
              className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`SMA,${item},Putri`);
              }}
            >
              {cekKuota("SMA", item, "Putri")}
            </button>
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
            <button
              className="border-r-2 border-white border-b-2 last:border-b-0 odd:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`SMA,${item},Putra`);
              }}
            >
              {cekKuota("SMA", item, "Putra")}
            </button>
          ))}
        </div>
        <div className="border-b-2 border-b-yellow-500">
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == "SMA")
          ].kategoriSeni.putri.map((item) => (
            <p
              className="border-r-2 border-white border-b-2 last:border-b-0 odd:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`SMA,${item},Putri`);
              }}
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
            <button
              className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`Dewasa,${item},Putra`);
              }}
            >
              {cekKuota("Dewasa", item, "Putra")}
            </button>
          ))}
        </div>
        <div className="border-b-2 border-b-yellow-500">
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
          ].kategoriTanding.map((item) => (
            <button
              className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`Dewasa,${item},Putri`);
              }}
            >
              {cekKuota("Dewasa", item, "Putri")}
            </button>
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
            <button
              className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`Dewasa,${item},Putra`);
              }}
            >
              {cekKuota("Dewasa", item, "Putra")}
            </button>
          ))}
        </div>
        <div>
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == "Dewasa")
          ].kategoriSeni.putri.map((item) => (
            <p
              className="border-r-2 border-white border-b-2 last:border-b-0 even:bg-gray-800 block w-full hover:text-yellow-500 transition"
              key={item}
              onClick={() => {
                setMode("custom");
                setSelectedKategori(`Dewasa,${item},Putri`);
              }}
            >
              {cekKuota("Dewasa", item, "Putri")}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TabelKuota;
