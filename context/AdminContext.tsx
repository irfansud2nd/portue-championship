"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";
import { dataKontingenInitialValue, jenisKelamin } from "@/utils/constants";
import InlineLoading from "@/components/admin/InlineLoading";
import { getAllKontingens } from "@/utils/kontingen/kontingenActions";
import { getAllOfficials } from "@/utils/official/officialActions";
import { getAllPesertas } from "@/utils/peserta/pesertaActions";
import { FirebaseError } from "firebase/app";

const Context = createContext<any>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [kontingens, setKontingens] = useState<KontingenState[]>([]);
  const [unconfirmedKongtingens, setUncofirmedKontingens] = useState<
    KontingenState[]
  >([]);
  const [confirmedKontingens, setCofirmedKontingens] = useState<
    KontingenState[]
  >([]);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [selectedPesertas, setSelectedPesertas] = useState<PesertaState[]>([]);
  const [officials, setOfficials] = useState<OfficialState[]>([]);
  const [selectedOfficials, setSelectedOfficials] = useState<OfficialState[]>(
    []
  );
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);
  const [mode, setMode] = useState("");
  const [selectedKontingen, setSelectedKontingen] = useState<KontingenState>(
    dataKontingenInitialValue
  );
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
  const refreshKontingens = async () => {
    setSelectedKontingen(dataKontingenInitialValue);
    setKontingensLoading(true);
    try {
      const { result, error } = await getAllKontingens();
      if (error) throw error;

      setKontingens(result);
      setKontingensLoading(false);
    } catch (error) {
      setError((error as FirebaseError).message);
    }
  };

  // GET OFFICIAL
  const refreshOfficials = async () => {
    setSelectedKontingen(dataKontingenInitialValue);
    setOfficialsLoading(true);
    try {
      const { result, error } = await getAllOfficials();
      if (error) throw error;

      setOfficials(result);
      setOfficialsLoading(false);
    } catch (error) {
      setError((error as FirebaseError).message);
    }
  };

  // GET PESERTA
  const refreshPesertas = async () => {
    setSelectedKontingen(dataKontingenInitialValue);
    setPesertasLoading(true);
    try {
      const { result, error } = await getAllPesertas();
      if (error) throw error;

      setPesertas(result);
      setPesertasLoading(false);
    } catch (error) {
      setError((error as FirebaseError).message);
    }
  };

  // GET PESERTAS AND OFFICIALS BASED ON KONTINGEN ID
  useEffect(() => {
    if (selectedKontingen.id) {
      setSelectedKategori("");
      setUncofirmedKontingens([]);
      setCofirmedKontingens([]);
      setSelectedOfficials(
        getOfficialsByKontingen(selectedKontingen.id, officials)
      );
      setSelectedPesertas(
        getPesertasByKontingen(selectedKontingen.id, pesertas)
      );
    } else {
      setSelectedOfficials([]);
      setSelectedPesertas([]);
    }
  }, [selectedKontingen]);

  // GET UNCORFIMED KONTINGENS
  const getUnconfirmedKontingens = () => {
    setMode("kontingen");
    let selected: KontingenState[] = [];
    kontingens.map((kontingen) => {
      if (kontingen.unconfirmedPembayaran.length) selected.push(kontingen);
    });
    setUncofirmedKontingens(selected);
  };

  // GET UNCORFIMED KONTINGENS
  const getConfirmedKontingens = () => {
    setMode("kontingen");
    let selected: KontingenState[] = [];
    kontingens.map((kontingen) => {
      if (kontingen.confirmedPembayaran.length) selected.push(kontingen);
    });
    setCofirmedKontingens(selected);
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
    let result: PesertaState[] = [];
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
    setSelectedPesertas(result);
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
        cekKuota,
        selectedKategori,
        setSelectedKategori,
        selectedPesertas,
        setSelectedPesertas,
        selectedOfficials,
        setSelectedOfficials,
        getUnconfirmedKontingens,
        unconfirmedKongtingens,
        setUncofirmedKontingens,
        getConfirmedKontingens,
        confirmedKontingens,
        setCofirmedKontingens,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminContext = () => {
  return useContext(Context);
};
