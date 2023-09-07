import { firestore } from "@/utils/firebase";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import TabelPesertaAdmin from "./TabelPesertaAdmin";
import TabelKontingenAdmin from "./TabelKontingenAdmin";
import { compare } from "@/utils/sharedFunctions";
import AdminButtons from "./AdminButtons";
import TabelOfficialAdmin from "./TabelOfficialAdmin";
import SearchBox from "./SearchBox";
import { spawn } from "child_process";
import TablePesertaNew from "./TablePesertaNew";

const Authorized = () => {
  const [kontingens, setKontingens] = useState<DataKontingenState[]>([]);
  const [officials, setOfficials] = useState<DataOfficialState[]>([]);
  const [pesertas, setPesertas] = useState<DataPesertaState[]>([]);
  const [selectedKontingen, setSelectedKontingen] =
    useState<DataKontingenState | null>(null);
  const [mode, setMode] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH BASED ON MODE
  useEffect(() => {
    fetchData();
  }, [mode]);

  // FETCH CONTROLLER
  const fetchData = () => {
    if (!selectedKontingen) {
      alert("masuk");
      if (mode.indexOf("peserta") >= 0) {
        getAllPeserta();
      }
      if (mode.indexOf("kontingen") >= 0) {
        getAllKontingen();
      }
      if (mode.indexOf("official") >= 0) {
        getAllOffical();
      }
    }
  };

  // GET ALL PESERTA
  const getAllPeserta = () => {
    setLoading(true);
    let container: any = [];
    getDocs(collection(firestore, "pesertas"))
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => container.push(doc.data()))
      )
      .catch((error) => alert(error.code))
      .finally(() => {
        setLoading(false);
        setPesertas(container);
      });
  };

  // GET ALL OFFICIAL
  const getAllOffical = () => {
    setLoading(true);
    let container: any = [];
    getDocs(collection(firestore, "officials"))
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => container.push(doc.data()))
      )
      .catch((error) => alert(error.code))
      .finally(() => {
        setLoading(false);
        setOfficials(container);
      });
  };

  // GET ALL KONTINGEN
  const getAllKontingen = () => {
    setLoading(true);
    let container: any = [];
    getDocs(collection(firestore, "kontingens"))
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => container.push(doc.data()))
      )
      .catch((error) => alert(error.code))
      .finally(() => {
        setLoading(false);
        setKontingens(container);
      });
  };

  // FETCH BASED ON KONTINGEN
  useEffect(() => {
    if (selectedKontingen) {
      setMode(["peserta", "official"]);
      setLoading(true);
      let container: any = [];
      getDocs(
        query(
          collection(firestore, "pesertas"),
          where("idKontingen", "==", selectedKontingen.idKontingen)
        )
      )
        .then((querySnapshot) =>
          querySnapshot.forEach((doc) => {
            container.push(doc.data());
          })
        )
        .catch((error) => alert(error.code))
        .finally(() => {
          console.log(container);
          setPesertas(container);
          let container2: any = [];
          getDocs(
            query(
              collection(firestore, "officials"),
              where("idKontingen", "==", selectedKontingen.idKontingen)
            )
          )
            .then((querySnapshot) =>
              querySnapshot.forEach((doc) => container2.push(doc.data()))
            )
            .catch((error) => alert(error.code))
            .finally(() => {
              setOfficials(container2);
              setLoading(false);
            });
        });
    }
  }, [selectedKontingen]);

  // SELECTED KONTINGEN RESET
  useEffect(() => {
    if (mode.length < 2) setSelectedKontingen(null);
  }, [mode]);

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full p-2 bg-gray-200 rounded-md">
        <AdminButtons refresh={fetchData} setMode={setMode} />
        {/* <SearchBox
          setMode={setMode}
          setPesertas={setPesertas}
          setKontingens={setKontingens}
        /> */}
        <div className="max-w-full h-full mt-1">
          {selectedKontingen && (
            <h1 className="text-2xl font-bold border-b-2 border-b-black">
              {selectedKontingen.namaKontingen}
            </h1>
          )}
          {mode.length ? (
            loading ? (
              <p>Memuat Data</p>
            ) : (
              <>
                {mode.indexOf("peserta") >= 0 &&
                  (pesertas.length ? (
                    <TabelPesertaAdmin
                      pesertas={pesertas.sort(compare("namaLengkap", "asc"))}
                      kontingens={kontingens}
                    />
                  ) : (
                    // <TablePesertaNew
                    //   pesertas={pesertas}
                    //   kontingens={kontingens}
                    // />
                    <p>Data Peserta Kosong</p>
                  ))}
                {mode.indexOf("official") >= 0 &&
                  (officials.length ? (
                    <TabelOfficialAdmin
                      officials={officials}
                      kontingens={kontingens}
                    />
                  ) : (
                    <p>Data Official Kosong</p>
                  ))}
                {mode.indexOf("kontingen") >= 0 &&
                  (kontingens.length ? (
                    <TabelKontingenAdmin
                      kontingens={kontingens}
                      setSelectedKontingen={setSelectedKontingen}
                    />
                  ) : (
                    <p>Data Kontingen Kosong</p>
                  ))}
              </>
            )
          ) : (
            <p>Menunggu Perintah</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Authorized;
