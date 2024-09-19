"use client";

import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import { getKontingenByEmail } from "@/utils/kontingen/kontingenActions";
import { getPesertasByEmail } from "@/utils/peserta/pesertaActions";
import { getOfficialsByEmail } from "@/utils/official/officialActions";
import { FirebaseError } from "firebase/app";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";

const Context = createContext<any>(null);

export const PendaftaranContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [kontingen, setKontingen] = useState<KontingenState | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [officials, setOfficials] = useState<OfficialState[]>([]);
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);

  const { user } = MyContext();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const reduceData = (data: any[], key: string = "id") => {
    const reducedData = Object.values(
      data.reduce((acc, obj) => {
        acc[obj[key]] = obj;
        return acc;
      }, {} as any)
    );
    return reducedData;
  };

  const fetchPesertas = async () => {
    try {
      setPesertasLoading(true);

      const { result, error } = await getPesertasByEmail(user.email);

      if (error) throw error;

      setPesertas(result);
      setPesertasLoading(false);
    } catch (error: any) {
      setError((error as FirebaseError).message);
    }
  };

  const fetchOfficials = async () => {
    try {
      setOfficialsLoading(true);

      const { result, error } = await getOfficialsByEmail(user.email);

      if (error) throw error;

      setOfficials(result);
      setOfficialsLoading(false);
    } catch (error: any) {
      setError((error as FirebaseError).message);
    }
  };

  const fetchData = async () => {
    fetchKontingen();
    fetchPesertas();
    fetchOfficials();
  };

  // KONTINGEN
  // FETCH

  const fetchKontingen = async () => {
    try {
      setKontingensLoading(true);

      const { result, error } = await getKontingenByEmail(user.email);

      if (error) throw error;

      setKontingen(result);
      setKontingensLoading(false);
    } catch (error: any) {
      setError((error as FirebaseError).message);
    }
  };

  // ADD
  const addKontingens = (newKontingen: KontingenState) => {
    setKontingen(newKontingen);
  };
  // DELETE
  const deleteKontingen = (id: string) => {
    setKontingen(undefined);
  };

  // PESERTA
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
        addKontingens,
        deleteKontingen,
        kontingen,
        kontingensLoading,
        addPesertas,
        deletePeserta,
        pesertas,
        pesertasLoading,
        addOfficials,
        deleteOfficial,
        officials,
        officialsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const PendaftaranContext = () => {
  return useContext(Context) as {
    error: string;
    addKontingens: (kontingen: KontingenState) => void;
    deleteKontingen: (id: string) => void;
    kontingens: KontingenState;
    kontingensLoading: boolean;
    addPesertas: (peserta: PesertaState[]) => void;
    deletePeserta: (id: string) => void;
    pesertas: PesertaState[];
    pesertasLoading: boolean;
    addOfficials: (official: OfficialState[]) => void;
    deleteOfficial: (id: string) => void;
    officials: OfficialState[];
    officialsLoading: boolean;
  };
};
