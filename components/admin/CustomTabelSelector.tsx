import { AdminContext } from "@/context/AdminContext";
import { jenisKelamin, tingkatanKategori } from "@/utils/constants";
import { useEffect, useState } from "react";

const CustomTabelSelector = () => {
  const [tingkatan, setTingkatan] = useState(tingkatanKategori[0].tingkatan);
  const [kategori, setKategori] = useState(
    tingkatanKategori[0].kategoriTanding[0]
  );
  const [gender, setGender] = useState<string>(jenisKelamin[0]);

  const { selectedKategori, setSelectedKategori } = AdminContext();

  useEffect(() => {
    setKategori(
      tingkatanKategori[
        tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
      ].kategoriTanding[0]
    );
  }, [tingkatan]);

  useEffect(() => {
    if (kategori.includes(jenisKelamin[0])) {
      setGender(jenisKelamin[0]);
    } else if (kategori.includes(jenisKelamin[1])) {
      setGender(jenisKelamin[1]);
    } else {
      setGender(jenisKelamin[0]);
    }
  }, [kategori]);

  return (
    <div className="bg-black text-white p-2 rounded-md w-fit mt-2">
      <p className="text-xl font-semibold">Custom Table</p>
      <div className="flex gap-2">
        <select
          value={tingkatan}
          className="text-black"
          onChange={(e) => setTingkatan(e.target.value)}
        >
          {tingkatanKategori.map((item) => (
            <option value={item.tingkatan}>{item.tingkatan}</option>
          ))}
        </select>
        <select
          value={gender}
          className="text-black"
          onChange={(e) => setGender(e.target.value)}
          disabled={kategori.includes("Putra") || kategori.includes("Putri")}
        >
          {jenisKelamin.map((item) => (
            <option value={item}>{item}</option>
          ))}
        </select>
        <select
          value={kategori}
          className="text-black"
          onChange={(e) => setKategori(e.target.value)}
        >
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
          ].kategoriTanding.map((item) => (
            <option value={item}>{item}</option>
          ))}
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
          ].kategoriSeni.putra.map((item) => (
            <option value={item}>{item}</option>
          ))}
          {tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
          ].kategoriSeni.putri.map((item) => (
            <option value={item}>{item}</option>
          ))}
        </select>
      </div>
      <button
        className="btn_green btn_full mt-1 text-black"
        onClick={() =>
          setSelectedKategori(`${tingkatan},${kategori},${gender}`)
        }
      >
        Generate Table
      </button>
      {/* <p>
        {tingkatan},{kategori},{gender}
      </p> */}
    </div>
  );
};
export default CustomTabelSelector;
