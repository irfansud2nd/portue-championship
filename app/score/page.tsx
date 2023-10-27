"use client";

import InlineLoading from "@/components/admin/InlineLoading";
import PartaiCard from "@/components/scoring/PartaiCard";
import { firestore } from "@/utils/firebase";
import { KontingenScore } from "@/utils/scoringFunctions";
import { compare } from "@/utils/sharedFunctions";
import { collection, getDocs, query, where } from "firebase/firestore";
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
      pointSd: number;
      pointSmp: number;
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
    getDocs(
      query(
        collection(firestore, "kontingenScores"),
        where("visible", "==", true)
      )
    )
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

    let arr: any = [];

    mergedArr.map((item, i) => {
      arr.push({
        ...item,
        pointSd: item.sdEmas + item.sdPerak,
        pointSmp: item.smpEmas + item.smpPerak + item.smpPerunggu,
      });
    });

    arr.push({
      namaKontingen: "TERATAI SILAT CLUB",
      sdEmas: 0,
      sdPerak: 5,
      smpEmas: 0,
      smpPerak: 1,
      smpPerunggu: 0,
    });

    setKontingenScores(arr);
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
  const day5 = [
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday5%2FGelanggang%201.pdf?alt=media&token=bf85375e-abce-4ece-aea7-0e3d400276b2&_gl=1*18357cm*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5ODM3NDYzNS4yMTUuMS4xNjk4Mzc0NzYwLjYwLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday5%2FGelanggang%202.pdf?alt=media&token=ea47bdab-225b-41e1-9bd5-592824c2b6f0&_gl=1*27lkdg*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5ODM3NDYzNS4yMTUuMS4xNjk4Mzc0NzgxLjM5LjAuMA..",
  ];
  const selectedLinks = day5;
  const hideScore = false;

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gray-200 rounded-md p-2">
        <button
          className="bg-custom-navy hover:bg-custom-yellow text-custom-yellow hover:text-custom-navy border-2 border-custom-navy transition-all px-2 rounded-full font-semibold mb-1"
          onClick={() => {
            getScores();
            getPartai();
          }}
        >
          Refresh
        </button>
        <h1 className="text-2xl font-bold">PARTAI YANG SEDANG BERTANDING</h1>
        {loading && <InlineLoading />}
        <div className="flex gap-2 flex-wrap">
          {partai.map((item, i) => (
            <PartaiCard
              key={item.nama}
              label={item.nama}
              partai={item.partai}
              link={selectedLinks[i]}
              disabled={!selectedLinks[i]}
            />
          ))}
        </div>
        {hideScore ? (
          <div className="mt-1">
            <p className="text-xl font-bold">
              Mohon maaf, rekapitulasi medali sedang dalam tahap maintenance
            </p>
          </div>
        ) : kontingenScores.length ? (
          <>
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
                  {/* <th>Point</th> */}
                </tr>
              </thead>
              <tbody>
                {kontingenScores
                  .sort(compare("sdPerak", "desc"))
                  .sort(compare("sdEmas", "desc"))
                  .map((kontingen, i) => (
                    <>
                      <tr
                        key={kontingen.namaKontingen}
                        className={`${
                          kontingen.sdEmas == 0 &&
                          kontingen.sdPerak == 0 &&
                          "hidden"
                        }`}
                      >
                        <td>{i + 1}</td>
                        <td className="uppercase">{kontingen.namaKontingen}</td>
                        <td>{kontingen.sdEmas}</td>
                        <td>{kontingen.sdPerak}</td>
                        {/* <td>{kontingen.pointSd}</td> */}
                      </tr>
                    </>
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
                  .sort(compare("smpPerunggu", "desc"))
                  .sort(compare("smpPerak", "desc"))
                  .sort(compare("smpEmas", "desc"))
                  .map((kontingen, i) => (
                    <tr
                      key={kontingen.namaKontingen}
                      className={`${
                        kontingen.smpEmas == 0 &&
                        kontingen.smpPerak == 0 &&
                        kontingen.smpPerunggu == 0 &&
                        "hidden"
                      }`}
                    >
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
