"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import {
  getAllKontingen,
  getAllOfficial,
  getAllPeserta,
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import { dataKontingenInitialValue, jenisKelamin } from "@/utils/constants";
import InlineLoading from "@/components/admin/InlineLoading";

const Context = createContext<any>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [kontingens, setKontingens] = useState<DataKontingenState[]>([]);
  const [pesertas, setPesertas] = useState<DataPesertaState[]>([]);
  const [selectedPesertas, setselectedPesertas] = useState<DataPesertaState[]>(
    []
  );
  const [officials, setOfficials] = useState<DataOfficialState[]>([]);
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);
  const [mode, setMode] = useState("");
  const [selectedKontingen, setSelectedKontingen] =
    useState<DataKontingenState>(dataKontingenInitialValue);
  const [selectedKategori, setSelectedKategori] = useState("");

  const { user } = MyContext();

  useEffect(() => {
    refreshKontingens();
    refreshOfficials();
    refreshPesertas();
  }, []);

  const refreshAll = () => {
    refreshKontingens();
    refreshOfficials();
    refreshPesertas();
  };

  // GET KONTINGEN
  const refreshKontingens = () => {
    setSelectedKontingen(dataKontingenInitialValue);
    setKontingensLoading(true);
    getAllKontingen()
      .then((res: any) => {
        setKontingens(res);
        setKontingensLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET OFFICIALS
  const refreshOfficials = () => {
    setSelectedKontingen(dataKontingenInitialValue);
    setOfficialsLoading(true);
    getAllOfficial()
      .then((res: any) => {
        setOfficials(res);
        setOfficialsLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET PESERTA
  const refreshPesertas = () => {
    setSelectedKontingen(dataKontingenInitialValue);
    setPesertasLoading(true);
    getAllPeserta()
      .then((res: any) => {
        setPesertas(res);
        setPesertasLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET PESERTAS AND OFFICIALS BASED ON KONTINGEN ID
  useEffect(() => {
    if (selectedKontingen.idKontingen) {
      setKontingens([selectedKontingen]);
      setOfficials(
        getOfficialsByKontingen(selectedKontingen.idKontingen, officials)
      );
      setPesertas(
        getPesertasByKontingen(selectedKontingen.idKontingen, pesertas)
      );
    } else {
      refreshAll();
    }
  }, [selectedKontingen]);

  // GET UNCORFIMED KONTINGENS
  const getUnconfirmedKontingens = () => {
    setMode("kontingen");
    let selected: DataKontingenState[] = [];
    kontingens.map((kontingen) => {
      if (kontingen.unconfirmedPembayaran.length) selected.push(kontingen);
    });
    setKontingens(selected);
  };

  // CEK KUOTA
  const cekKuota = (
    tingkatanPertandingan: string,
    kategoriPertandingan: string,
    jenisKelamin: string
  ) => {
    let kuota = 16;
    let kuotaGanda = kuota * 2;
    let kuotaRegu = kuota * 3;
    if (!pesertasLoading) {
      pesertas.map((peserta) => {
        if (
          peserta.jenisKelamin == jenisKelamin &&
          peserta.kategoriPertandingan == kategoriPertandingan &&
          peserta.tingkatanPertandingan == tingkatanPertandingan
        ) {
          if (kategoriPertandingan.includes("Regu")) {
            kuotaRegu -= 1;
          } else if (kategoriPertandingan.includes("Ganda")) {
            kuotaGanda -= 1;
          } else {
            kuota -= 1;
          }
        }
      });
      return (
        <span>
          {kategoriPertandingan.includes("Regu")
            ? kuotaRegu
            : kategoriPertandingan.includes("Ganda")
            ? kuotaGanda
            : kuota}
          {/* <span className="text-gray-500"> / 16</span> */}
        </span>
      );
    }
    return <InlineLoading />;
  };

  // GET PESERTAS BASED ON KATEGORI
  useEffect(() => {
    let result: DataPesertaState[] = [];
    const tingkatan = selectedKategori.split(",")[0];
    const kategori = selectedKategori.split(",")[1];
    const gender = selectedKategori.split(",")[2];
    pesertas.map((peserta) => {
      if (
        peserta.tingkatanPertandingan == tingkatan &&
        peserta.kategoriPertandingan == kategori &&
        peserta.jenisKelamin == gender
      ) {
        result.push(peserta);
      }
    });
    setselectedPesertas(result);
  }, [selectedKategori]);

  return (
    <Context.Provider
      value={{
        error,
        kontingens,
        kontingensLoading,
        setKontingens,
        refreshKontingens,
        pesertas,
        pesertasLoading,
        setPesertas,
        refreshPesertas,
        officials,
        officialsLoading,
        setOfficials,
        refreshOfficials,
        refreshAll,
        mode,
        setMode,
        selectedKontingen,
        setSelectedKontingen,
        getUnconfirmedKontingens,
        cekKuota,
        selectedKategori,
        setSelectedKategori,
        selectedPesertas,
        setselectedPesertas,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminContext = () => {
  return useContext(Context);
};
