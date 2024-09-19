"use client";

import InlineLoading from "@/components/admin/InlineLoading";
import TabelScore from "@/components/score/TabelScore";
import PartaiCard from "@/components/scoring/PartaiCard";
import { fetchData, toastError } from "@/utils/functions";
import { getKontingenScores, getPartai } from "@/utils/scoring/scoringActions";
import { KontingenScore } from "@/utils/scoring/scoringFunctions";
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
      smaEmas: number;
      smaPerak: number;
      smaPerunggu: number;
      dewasaEmas: number;
      dewasaPerak: number;
      dewasaPerunggu: number;
    }[]
  >([]);
  const [partai, setPartai] = useState<
    {
      nama: string;
      partai: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

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
      smaEmas: number;
      smaPerak: number;
      smaPerunggu: number;
      dewasaEmas: number;
      dewasaPerak: number;
      dewasaPerunggu: number;
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
        smaEmas,
        smaPerak,
        smaPerunggu,
        dewasaEmas,
        dewasaPerak,
        dewasaPerunggu,
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
          smaEmas,
          smaPerak,
          smaPerunggu,
          dewasaEmas,
          dewasaPerak,
          dewasaPerunggu,
        };
      } else {
        result[key].sdEmas += sdEmas;
        result[key].sdPerak += sdPerak;
        result[key].smpEmas += smpEmas;
        result[key].smpPerak += smpPerak;
        result[key].smpPerunggu += smpPerunggu;
        result[key].smaEmas += smaEmas;
        result[key].smaPerak += smaPerak;
        result[key].smaPerunggu += smaPerunggu;
        result[key].dewasaEmas += dewasaEmas;
        result[key].dewasaPerak += dewasaPerak;
        result[key].dewasaPerunggu += dewasaPerunggu;
      }
    });

    const mergedArr: Item[] = Object.values(result);

    setKontingenScores(mergedArr);
    setLoading(false);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const score = await fetchData(() => getKontingenScores());
      processScore(score);

      const partai = await fetchData(() => getPartai());
      setPartai(partai);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
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
            getData();
          }}
        >
          Refresh
        </button>
        {loading && <InlineLoading />}
        <h1 className="text-2xl font-bold">PARTAI YANG SEDANG BERTANDING</h1>
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
            {/* SD */}
            <TabelScore
              label="SD"
              medalis={["sdEmas", "sdPerak"]}
              rawData={kontingenScores}
            />
            {/* SMP */}
            <TabelScore
              label="SMP"
              medalis={["smpEmas", "smpPerak", "smpPerunggu"]}
              rawData={kontingenScores}
            />
            {/* SMA */}
            <TabelScore
              medalis={["smaEmas", "smaPerak", "smaPerunggu"]}
              label="SMA"
              rawData={kontingenScores}
            />
            {/* DEWASA */}
            <TabelScore
              medalis={["dewasaEmas", "dewasaPerak", "dewasaPerunggu"]}
              label="Dewasa"
              rawData={kontingenScores}
            />
          </>
        ) : (
          <InlineLoading />
        )}
      </div>
    </div>
  );
};
export default ScorePage;
