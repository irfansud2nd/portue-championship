import { firestore } from "@/utils/firebase";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";

const SearchBox = ({
  setMode,
  setPesertas,
  setKontingens,
}: {
  setMode: React.Dispatch<React.SetStateAction<string[]>>;
  setPesertas: React.Dispatch<React.SetStateAction<DataPesertaState[]>>;
  setKontingens: React.Dispatch<React.SetStateAction<DataKontingenState[]>>;
}) => {
  const [inputText, setInputText] = useState("");

  const firstOptions = [
    "peserta",
    "kontingen",
    // "official"
  ];
  const [firstOption, setFirstOption] = useState(firstOptions[0]);

  const generateSecondOptions = () => {
    switch (firstOption) {
      case "peserta":
        return ["namaLengkap"];
      case "kontingen":
        return ["namaKontingen"];
      // case "official":
      //   return ["namaOFf"];
      default:
        return [];
    }
  };
  const secondOptions = generateSecondOptions();
  const [secondOption, setSecondOption] = useState(secondOptions[0]);

  // const generateThirdOptions = () => {
  //   switch (secondOption) {
  //     case "jenisKelamin":
  //       return jenisKelamin;
  //     case "jenisPertandingan":
  //       return jenisPertandingan;
  //     case "tingkatanPertandingan":
  //       return tingkatanKategori.map((item) => item.tingkatan);
  //     default:
  //       return [];
  //   }
  // };
  // const thirdOptions = generateThirdOptions();

  const search = () => {
    setMode([firstOption]);
    let container: any = [];
    console.log(`${firstOption}s`, secondOption, inputText.toLowerCase());
    getDocs(
      query(
        collection(firestore, `${firstOption}s`),
        where(secondOption, "==", inputText.toLowerCase())
      )
    ).then((res) => res.forEach((doc) => container.push(doc.data())));
    if (firstOption == "peserta") {
      setPesertas(container);
    } else {
      setKontingens(container);
    }
  };

  return (
    <div className="w-fit h-fit rounded-md bg-white px-2 py-1 mt-1">
      <select
        value={firstOption}
        className="capitalize"
        onChange={(e) => setFirstOption(e.target.value)}
      >
        {firstOptions.map((option) => (
          <option value={option} key={option} className="capitalize">
            {option}
          </option>
        ))}
      </select>
      <select
        value={secondOption}
        onChange={(e) => setSecondOption(e.target.value)}
      >
        {secondOptions.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button className="btn_green btn_full" onClick={search}>
        Search
      </button>
    </div>
  );
};
export default SearchBox;
