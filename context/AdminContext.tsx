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
import { dataKontingenInitialValue } from "@/utils/constants";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
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
  const [officials, setOfficials] = useState<DataOfficialState[]>([]);
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);
  const [mode, setMode] = useState("");
  const [selectedKontingen, setSelectedKontingen] =
    useState<DataKontingenState>(dataKontingenInitialValue);

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

  const getUnconfirmesKontingens = () => {
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
    if (!pesertasLoading) {
      pesertas.map((peserta) => {
        if (
          peserta.jenisKelamin == jenisKelamin &&
          peserta.kategoriPertandingan == kategoriPertandingan &&
          peserta.tingkatanPertandingan == tingkatanPertandingan
        ) {
          kuota -= 1;
        }
      });
      return (
        <span>
          {kuota}
          {/* <span className="text-gray-500"> / 16</span> */}
        </span>
      );
    }
    return <InlineLoading />;
  };

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
        getUnconfirmesKontingens,
        cekKuota,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminContext = () => {
  return useContext(Context);
};
