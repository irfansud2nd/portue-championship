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
      smpPerak: 0,
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

  const day1 = [
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday1%2FGelanggang%201.pdf?alt=media&token=ae42dbd1-8238-40b8-b79a-7bf59beabc0f&_gl=1*womjmo*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg3ODkzLjU1LjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday1%2FGelanggang%202.pdf?alt=media&token=432df379-e4e1-4b4f-9690-fac764ce6c6e&_gl=1*18s533k*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg3OTM2LjEyLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday1%2FGelanggang%203.pdf?alt=media&token=f47210b1-2cc5-414f-89d9-2bb312ff49bc&_gl=1*1kixtip*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg3OTUwLjYwLjAuMA..",
    "",
  ];
  const day2 = [
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday2%2FGelanggang%201.pdf?alt=media&token=3c1ad84f-74d9-41c8-8a96-52ad9dd47e3a&_gl=1*1lkobo6*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg4MDk5LjYwLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday2%2FGelanggang%202.pdf?alt=media&token=965d7126-e835-4614-8d15-b8d92ca23a9c&_gl=1*13mewml*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg4MDIxLjU4LjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday2%2FGelanggang%203.pdf?alt=media&token=ebbd31e1-e584-49f6-8ee7-2165003329c0&_gl=1*ztme1b*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg4MDM4LjQxLjAuMA..",
    "",
  ];
  const day2Malam = [
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday2Malam%2FGelanggang%201%20Malam.pdf?alt=media&token=3b87b76e-5ea0-4316-8492-1992bb39a6b7&_gl=1*1y610py*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg4MTQ2LjEzLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday2Malam%2FGelanggang%202%20Malam.pdf?alt=media&token=211d548d-4697-4ab9-8341-0652e5f994f3&_gl=1*1gwmr73*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg4MTY1LjYwLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday2Malam%2FGelanggang%203%20Malam.pdf?alt=media&token=b140cb0d-ed86-461b-b98d-477c4ef23405&_gl=1*1d60u21*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5Nzk4NzUwNy4xOTUuMS4xNjk3OTg4MTgyLjQzLjAuMA..",
    "",
  ];
  const day3 = [
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday3%2FGelanggang%201.pdf?alt=media&token=cc57fccf-748a-4c9d-a06c-9c1a9445f926",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday3%2FGelanggang%202.pdf?alt=media&token=61ff736f-02bb-4f65-8437-e8f9bc75f67a",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday3%2FGelanggang%203.pdf?alt=media&token=92daf6ed-a738-48e1-9ee5-e12c848cb32d",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday3%2FGelanggang%204.pdf?alt=media&token=899734e0-278c-4173-b09c-2b4e2bb0856f",
  ];
  const day4 = [
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday4%2FGelanggang%201.pdf?alt=media&token=9caf3962-2a3e-4baf-996c-0c5973713b17&_gl=1*1wa4cy5*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5ODI4NjcwNC4yMDguMS4xNjk4Mjg4NjAwLjYwLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday4%2FGelanggang%202.pdf?alt=media&token=fe2b103e-85c7-4f16-b0a8-111a43d73626&_gl=1*l8na8p*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5ODI4NjcwNC4yMDguMS4xNjk4Mjg4NjE1LjQ1LjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday4%2FGelanggang%203.pdf?alt=media&token=74e6a4b7-1ecd-476a-be72-13bc8655b0a6&_gl=1*spa343*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5ODI4NjcwNC4yMDguMS4xNjk4Mjg4NjI3LjMzLjAuMA..",
    "https://firebasestorage.googleapis.com/v0/b/portue-silat-bandung.appspot.com/o/tabelPartai%2Fday4%2FGelanggang%204.pdf?alt=media&token=5e90eeb3-2654-4214-b043-76ebdb454ff1&_gl=1*x2sw82*_ga*NjY5MDI5NTA4LjE2OTI3MDI0NjA.*_ga_CW55HF8NVT*MTY5ODI4NjcwNC4yMDguMS4xNjk4Mjg4NjM3LjIzLjAuMA..",
  ];
  const kosong = ["", "", "", ""];
  const selectedLinks = kosong;
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
        {loading && <InlineLoading />}
        <h1 className="text-2xl font-bold">PARTAI YANG SEDANG BERTANDING</h1>
        <div className="flex gap-2 flex-wrap">
          {partai.map((item, i) => (
            <PartaiCard
              key={item.nama}
              label={item.nama}
              partai={i != 3 ? "SELESAI" : `Partai ${item.partai}`}
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
                  {/* <th>Point</th> */}
                </tr>
              </thead>
              <tbody>
                {kontingenScores
                  .sort(compare("namaKontingen", "asc"))
                  .sort(compare("pointSmp", "desc"))
                  .map((kontingen, i) => (
                    <tr key={kontingen.namaKontingen}>
                      <td>{i + 1}</td>
                      <td className="uppercase">{kontingen.namaKontingen}</td>
                      <td>{kontingen.smpEmas}</td>
                      <td>{kontingen.smpPerak}</td>
                      <td>{kontingen.smpPerunggu}</td>
                      {/* <td>{kontingen.pointSmp}</td> */}
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
