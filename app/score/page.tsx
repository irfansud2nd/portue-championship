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

  useEffect(() => {
    getScores();
  }, []);

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gray-200 rounded-md p-2">
        <button className="btn_green btn_full mb-1" onClick={getScores}>
          Refresh
        </button>
        {loading && <InlineLoading />}
        {kontingenScores.length ? (
          <table className="w-full">
            <thead>
              <tr>
                <th>Nama Kontingen</th>
                <th>SD Emas</th>
                <th>SD Perak</th>
                <th>SMP Emas</th>
                <th>SMP Perak</th>
                <th>SMP Perunggu</th>
              </tr>
            </thead>
            <tbody>
              {kontingenScores
                .sort(compare("namaKontingen", "asc"))
                .map((kontingen) => (
                  <tr>
                    <td className="uppercase">{kontingen.namaKontingen}</td>
                    <td>{kontingen.sdEmas}</td>
                    <td>{kontingen.sdPerak}</td>
                    <td>{kontingen.smpEmas}</td>
                    <td>{kontingen.smpPerak}</td>
                    <td>{kontingen.smpPerunggu}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <InlineLoading />
        )}
      </div>
    </div>
  );
};
export default ScorePage;
