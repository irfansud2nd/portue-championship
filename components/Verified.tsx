import InlineLoading from "@/components/admin/InlineLoading";
import { firestore } from "@/utils/firebase";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
const Verified = () => {
  const [keteranganSehat, setKeteranganSehat] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const [rekomendasi, setRekomendasi] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const [rapot, setRapot] = useState<JSX.Element | number>(<InlineLoading />);
  const [kartuKeluarga, setKartuKeluarga] = useState<JSX.Element | number>(
    <InlineLoading />
  );

  const [sd, setSd] = useState<{
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
  }>({
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
  });
  const [smp, setSmp] = useState<{
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
  }>({
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
  });
  const [sma, setSma] = useState<{
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
    rapot: JSX.Element | number;
    kartuKeluarga: JSX.Element | number;
  }>({
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
    rapot: <InlineLoading />,
    kartuKeluarga: <InlineLoading />,
  });
  const [dewasa, setDewasa] = useState<{
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
    kartuKeluarga: JSX.Element | number;
  }>({
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
    kartuKeluarga: <InlineLoading />,
  });

  const getKeteranganSehatCount = () => {
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("keteranganSehat", "==", true)
      )
    ).then((res) => setKeteranganSehat(res.data().count));
  };
  const getRekomendasiCount = () => {
    getCountFromServer(
      query(collection(firestore, "pesertas"), where("rekomendasi", "==", true))
    ).then((res) => setRekomendasi(res.data().count));
  };
  const getRapotCount = () => {
    getCountFromServer(
      query(collection(firestore, "pesertas"), where("rapot", "==", true))
    ).then((res) => setRapot(res.data().count));
  };
  const getKartuKeluargaCount = () => {
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("kartuKeluarga", "==", true)
      )
    ).then((res) => setKartuKeluarga(res.data().count));
  };

  const getVerifiedSd = () => {
    let keteranganSehat = 0;
    let rekomendasi = 0;

    // KETERANGAN SEHAT
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("keteranganSehat", "==", true),
        where("tingkatanPertandingan", "==", "SD I")
      )
    ).then((res) => {
      keteranganSehat += res.data().count;
      getCountFromServer(
        query(
          collection(firestore, "pesertas"),
          where("keteranganSehat", "==", true),
          where("tingkatanPertandingan", "==", "SD II")
        )
      ).then((res) => {
        keteranganSehat += res.data().count;
        // REKOMENDASI
        getCountFromServer(
          query(
            collection(firestore, "pesertas"),
            where("rekomendasi", "==", true),
            where("tingkatanPertandingan", "==", "SD I")
          )
        ).then((res) => {
          rekomendasi += res.data().count;
          getCountFromServer(
            query(
              collection(firestore, "pesertas"),
              where("rekomendasi", "==", true),
              where("tingkatanPertandingan", "==", "SD II")
            )
          ).then((res) => {
            rekomendasi += res.data().count;
            setSd({ keteranganSehat, rekomendasi });
          });
        });
      });
    });
  };

  const getVerifiedSmp = () => {
    let keteranganSehat = 0;
    let rekomendasi = 0;

    // KETERANGAN SEHAT
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("keteranganSehat", "==", true),
        where("tingkatanPertandingan", "==", "SMP")
      )
    ).then((res) => {
      keteranganSehat += res.data().count;

      // REKOMENDASI
      getCountFromServer(
        query(
          collection(firestore, "pesertas"),
          where("rekomendasi", "==", true),
          where("tingkatanPertandingan", "==", "SMP")
        )
      ).then((res) => {
        rekomendasi += res.data().count;

        setSmp({
          keteranganSehat,
          rekomendasi,
        });
      });
    });
  };

  const getVerifiedSma = () => {
    let keteranganSehat = 0;
    let rekomendasi = 0;
    let rapot = 0;
    let kartuKeluarga = 0;

    // KETERANGAN SEHAT
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("keteranganSehat", "==", true),
        where("tingkatanPertandingan", "==", "SMA")
      )
    ).then((res) => {
      keteranganSehat += res.data().count;

      // REKOMENDASI
      getCountFromServer(
        query(
          collection(firestore, "pesertas"),
          where("rekomendasi", "==", true),
          where("tingkatanPertandingan", "==", "SMA")
        )
      ).then((res) => {
        rekomendasi += res.data().count;

        // RAPOT
        getCountFromServer(
          query(
            collection(firestore, "pesertas"),
            where("rapot", "==", true),
            where("tingkatanPertandingan", "==", "SMA")
          )
        ).then((res) => {
          rapot += res.data().count;

          // KARTU KELUARGA
          getCountFromServer(
            query(
              collection(firestore, "pesertas"),
              where("kartuKeluarga", "==", true),
              where("tingkatanPertandingan", "==", "SMA")
            )
          ).then((res) => {
            kartuKeluarga += res.data().count;
            setSma({ keteranganSehat, rekomendasi, rapot, kartuKeluarga });
          });
        });
      });
    });
  };

  const getVerifiedDewasa = () => {
    let keteranganSehat = 0;
    let rekomendasi = 0;
    let kartuKeluarga = 0;

    // KETERANGAN SEHAT
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("keteranganSehat", "==", true),
        where("tingkatanPertandingan", "==", "Dewasa")
      )
    ).then((res) => {
      keteranganSehat += res.data().count;

      // REKOMENDASI
      getCountFromServer(
        query(
          collection(firestore, "pesertas"),
          where("rekomendasi", "==", true),
          where("tingkatanPertandingan", "==", "Dewasa")
        )
      ).then((res) => {
        rekomendasi += res.data().count;

        // KARTU KELUARGA
        getCountFromServer(
          query(
            collection(firestore, "pesertas"),
            where("kartuKeluarga", "==", true),
            where("tingkatanPertandingan", "==", "Dewasa")
          )
        ).then((res) => {
          kartuKeluarga += res.data().count;

          setDewasa({ keteranganSehat, rekomendasi, kartuKeluarga });
        });
      });
    });
  };

  const refreshCount = () => {
    getKeteranganSehatCount();
    getRekomendasiCount();
    getRapotCount();
    getKartuKeluargaCount();
    getVerifiedSd();
    getVerifiedSmp();
    getVerifiedSma();
    getVerifiedDewasa();
  };

  useEffect(() => {
    refreshCount();
  }, []);
  return (
    <div>
      <p className="font-bold text-xl">Data yang telah diverifikasi</p>
      <button className="btn_green btn_full mb-1" onClick={refreshCount}>
        Refresh
      </button>
      <table>
        <thead>
          <tr>
            <th>Persyaratan</th>
            <th>SD</th>
            <th>SMP</th>
            <th>SMA</th>
            <th>Dewasa</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Surat Keterangan Sehat</td>
            <td>{sd.keteranganSehat}</td>
            <td>{smp.keteranganSehat}</td>
            <td>{sma.keteranganSehat}</td>
            <td>{dewasa.keteranganSehat}</td>
            <td>{keteranganSehat}</td>
          </tr>
          <tr>
            <td>Surat Rekomendasi</td>
            <td>{sd.rekomendasi}</td>
            <td>{smp.rekomendasi}</td>
            <td>{sma.rekomendasi}</td>
            <td>{dewasa.rekomendasi}</td>
            <td>{rekomendasi}</td>
          </tr>
          <tr>
            <td>Rapot</td>
            <td></td>
            <td></td>
            <td>{sma.rapot}</td>
            <td></td>
            <td>{rapot}</td>
          </tr>
          <tr>
            <td>Kartu Keluarga</td>
            <td></td>
            <td></td>
            <td>{sma.kartuKeluarga}</td>
            <td>{dewasa.kartuKeluarga}</td>
            <td>{kartuKeluarga}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Verified;
