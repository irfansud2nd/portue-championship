"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";
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
  const [error, setError] = useState<string | undefined>(undefined);
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
  const [selectedKontingen, setSelectedKontingen] = useState<
    KontingenState | undefined
  >(undefined);
  const [selectedKategori, setSelectedKategori] = useState("");

  const { user } = MyContext();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchKontingens();
    fetchOfficials();
    fetchPesertas();
  };

  // GET PESERTAS AND OFFICIALS BASED ON KONTINGEN ID
  useEffect(() => {
    if (selectedKontingen) {
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

  const reduceData = (data: any[], key: string = "id") => {
    const reducedData = Object.values(
      data.reduce((acc, obj) => {
        acc[obj[key]] = obj;
        return acc;
      }, {} as any)
    );
    return reducedData;
  };

  // KONTINGEN
  // FECTCH
  const fetchKontingens = async () => {
    setSelectedKontingen(undefined);
    setKontingensLoading(true);
    try {
      const { result, error } = await getAllKontingens();
      if (error) throw error;

      addKontingens(result);
      setKontingensLoading(false);
    } catch (error) {
      setError((error as FirebaseError).message);
    }
  };

  // ADD
  const addKontingens = (newKontingens: KontingenState[]) => {
    const data = reduceData([
      ...kontingens,
      ...newKontingens,
    ]) as KontingenState[];
    setKontingens(data);
  };

  // DELETE
  const deleteKontingen = (id: string) => {
    setKontingens(kontingens.filter((item) => item.id != id));
  };

  // PESERTA
  // FETCH
  const fetchPesertas = async () => {
    setSelectedKontingen(undefined);
    setPesertasLoading(true);
    try {
      const { result, error } = await getAllPesertas();
      if (error) throw error;

      addPesertas(result);
      setPesertasLoading(false);
    } catch (error) {
      setError((error as FirebaseError).message);
    }
  };
  // ADD
  const addPesertas = (newPesertas: PesertaState[]) => {
    const data = reduceData([...pesertas, ...newPesertas]) as PesertaState[];
    setPesertas(data);
  };
  // DELETE
  const deletePeserta = (id: string) => {
    setPesertas(pesertas.filter((item) => item.id != id));
  };

  // OFFICIAL
  // FETCH
  const fetchOfficials = async () => {
    setSelectedKontingen(undefined);
    setOfficialsLoading(true);
    try {
      const { result, error } = await getAllOfficials();
      if (error) throw error;

      addOfficials(result);
      setOfficialsLoading(false);
    } catch (error) {
      setError((error as FirebaseError).message);
    }
  };
  // ADD
  const addOfficials = (newOfficials: OfficialState[]) => {
    const data = reduceData([...officials, ...newOfficials]) as OfficialState[];
    setOfficials(data);
  };
  // DELETE
  const deleteOfficial = (id: string) => {
    setOfficials(officials.filter((item) => item.id != id));
  };

  return (
    <Context.Provider
      value={{
        error,
        kontingens,
        kontingensLoading,
        setKontingens,
        addKontingens,
        deleteKontingen,
        pesertas,
        pesertasLoading,
        setPesertas,
        addPesertas,
        deletePeserta,
        officials,
        officialsLoading,
        setOfficials,
        addOfficials,
        deleteOfficial,
        fetchAll,
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
  return useContext(Context) as {
    error: string;
    kontingens: KontingenState[];
    fetchKontingens: () => void;
    kontingensLoading: boolean;
    setKontingens: (kontingens: KontingenState[]) => void;
    addKontingens: (kontingens: KontingenState[]) => void;
    deleteKontingen: (id: string) => void;
    pesertas: PesertaState[];
    fetchPesertas: () => void;
    pesertasLoading: boolean;
    setPesertas: (pesertas: PesertaState[]) => void;
    addPesertas: (pesertas: PesertaState[]) => void;
    deletePeserta: (id: string) => void;
    officials: OfficialState[];
    fetchOfficials: () => void;
    officialsLoading: boolean;
    setOfficials: (officials: OfficialState[]) => void;
    addOfficials: (officials: OfficialState[]) => void;
    deleteOfficial: (id: string) => void;
    fetchAll: () => void;
    mode: string;
    setMode: (mode: string) => void;
    selectedKontingen: KontingenState | undefined;
    setSelectedKontingen: (kontingen: KontingenState | undefined) => void;
    cekKuota: (
      tingkatanPertandingan: string,
      kategoriPertandingan: string,
      jenisKelamin: string
    ) => JSX.Element;
    selectedKategori: string;
    setSelectedKategori: (value: string) => void;
    selectedPesertas: PesertaState[];
    setSelectedPesertas: (pesertas: PesertaState[]) => void;
    selectedOfficials: OfficialState[];
    setSelectedOfficials: (officials: OfficialState[]) => void;
    getUnconfirmedKontingens: () => void;
    unconfirmedKongtingens: KontingenState[];
    setUncofirmedKontingens: (kontingens: KontingenState[]) => void;
    getConfirmedKontingens: () => void;
    confirmedKontingens: KontingenState[];
    setCofirmedKontingens: (kontingens: KontingenState[]) => void;
  };
};
