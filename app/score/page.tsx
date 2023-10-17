"use client";

import InlineLoading from "@/components/admin/InlineLoading";
import { firestore } from "@/utils/firebase";
import { KontingenScore } from "@/utils/scoringFunctions";
import { compare } from "@/utils/sharedFunctions";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const ScorePage = () => {
  const [kontingenScores, setKontingenScores] = useState<
    {
      idKontingen: string;
      namaKontingen: string;
      sdEmas: number;
      sdPerak: number;
      smpEmas: number;
      smpPerak: number;
      smpPerunggu: number;
    }[]
  >([]);
  const [partai, setPartai] = useState<
    {
      nama: string;
      partai: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getScores = () => {
    setLoading(true);

    let result: any = [];
    getDocs(collection(firestore, "kontingenScores"))
      .then((res) => res.forEach((doc) => result.push(doc.data())))
      .finally(() => {
        processScore(result);
      });
  };

  const processScore = (results: KontingenScore[]) => {
    let resultScores: Item[] = [];
    results.map((result) => {
      result.scores.map((score) => resultScores.push(score));
    });

    type Item = {
      idKontingen: string;
      namaKontingen: string;
      sdEmas: number;
      sdPerak: number;
      smpEmas: number;
      smpPerak: number;
      smpPerunggu: number;
    };

    const result: {
      [key: string]: Item;
    } = {};

    resultScores.forEach((item) => {
      const {
        idKontingen,
        namaKontingen,
        sdEmas,
        sdPerak,
        smpEmas,
        smpPerak,
        smpPerunggu,
      } = item;
      const key = `${idKontingen}_${namaKontingen}`;
      if (!result[key]) {
        result[key] = {
          idKontingen,
          namaKontingen,
          sdEmas,
          sdPerak,
          smpEmas,
          smpPerak,
          smpPerunggu,
        };
      } else {
        result[key].sdEmas += sdEmas;
        result[key].sdPerak += sdPerak;
        result[key].smpEmas += smpEmas;
        result[key].smpPerak += smpPerak;
        result[key].smpPerunggu += smpPerunggu;
      }
    });

    const mergedArr: Item[] = Object.values(result);

    setKontingenScores(mergedArr);
    setLoading(false);
  };

  const getPartai = () => {
    let result: any = [];
    getDocs(collection(firestore, "gelanggangs"))
      .then((res) => res.forEach((doc) => result.push(doc.data())))
      .finally(() => {
        setPartai(result);
      });
  };

  useEffect(() => {
    getScores();
    getPartai();
  }, []);

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gray-200 rounded-md p-2">
        <button
          className="btn_green btn_full mb-1"
          onClick={() => {
            getScores();
            getPartai();
          }}
        >
          Refresh
        </button>
        {loading && <InlineLoading />}
        {kontingenScores.length ? (
          <>
            <h1 className="text-2xl font-bold">
              PARTAI YANG SEDANG BERTANDING
            </h1>
            <table className="min-w-[400px]">
              <thead>
                <tr>
                  <th>Gelanggang</th>
                  <th>Partai</th>
                </tr>
              </thead>
              <tbody>
                {partai.map((item) => (
                  <tr key={item.nama}>
                    <td>{item.nama}</td>
                    <td>Partai {item.partai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h1 className="text-2xl font-bold">
              REKAPITULASI PEROLEHAN MEDALI SD
            </h1>
            <table className="w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kontingen</th>
                  <th>Emas</th>
                  <th>Perak</th>
                </tr>
              </thead>
              <tbody>
                {kontingenScores
                  .sort(compare("namaKontingen", "asc"))
                  .map((kontingen, i) => (
                    <tr key={kontingen.namaKontingen}>
                      <td>{i + 1}</td>
                      <td className="uppercase">{kontingen.namaKontingen}</td>
                      <td>{kontingen.sdEmas}</td>
                      <td>{kontingen.sdPerak}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <h1 className="text-2xl font-bold mt-2">
              REKAPITULASI PEROLEHAN MEDALI SMP
            </h1>
            <table className="w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kontingen</th>
                  <th>Emas</th>
                  <th>Perak</th>
                  <th>Perunggu</th>
                </tr>
              </thead>
              <tbody>
                {kontingenScores
                  .sort(compare("namaKontingen", "asc"))
                  .map((kontingen, i) => (
                    <tr key={kontingen.namaKontingen}>
                      <td>{i + 1}</td>
                      <td className="uppercase">{kontingen.namaKontingen}</td>
                      <td>{kontingen.smpEmas}</td>
                      <td>{kontingen.smpPerak}</td>
                      <td>{kontingen.smpPerunggu}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        ) : (
          <InlineLoading />
        )}
      </div>
    </div>
  );
};
export default ScorePage;
