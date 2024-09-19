import InlineLoading from "@/components/admin/InlineLoading";
import { useEffect, useState } from "react";
import VerifiedDetail from "./VerifiedDetail";
import { fetchData } from "@/utils/functions";
import {
  getAllVerifedDocCount,
  getVerifiedCountByDocType,
  getVerifiedCountByTingkatan,
} from "@/utils/verify/verifyActions";
const Verified = ({ detail }: { detail?: boolean }) => {
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
    total: JSX.Element | number;
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
  }>({
    total: <InlineLoading />,
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
  });
  const [smp, setSmp] = useState<{
    total: JSX.Element | number;
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
  }>({
    total: <InlineLoading />,
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
  });
  const [sma, setSma] = useState<{
    total: JSX.Element | number;
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
    rapot: JSX.Element | number;
    kartuKeluarga: JSX.Element | number;
  }>({
    total: <InlineLoading />,
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
    rapot: <InlineLoading />,
    kartuKeluarga: <InlineLoading />,
  });
  const [dewasa, setDewasa] = useState<{
    total: JSX.Element | number;
    keteranganSehat: JSX.Element | number;
    rekomendasi: JSX.Element | number;
    kartuKeluarga: JSX.Element | number;
  }>({
    total: <InlineLoading />,
    keteranganSehat: <InlineLoading />,
    rekomendasi: <InlineLoading />,
    kartuKeluarga: <InlineLoading />,
  });

  const getAllDocCount = async () => {
    try {
      const { keteranganSehat, rekomendasi, rapot, kartuKeluarga } =
        await fetchData(() => getAllVerifedDocCount());

      setKeteranganSehat(keteranganSehat);
      setRekomendasi(rekomendasi);
      setRapot(rapot);
      setKartuKeluarga(kartuKeluarga);
    } catch (error) {
      alert(error);
    }
  };

  const getVerifiedSd = async () => {
    const { keteranganSehat, rekomendasi } = await fetchData(() =>
      getVerifiedCountByTingkatan("SD")
    );

    setSd({ keteranganSehat, rekomendasi, total: 0 });
  };

  const getVerifiedSmp = async () => {
    const { keteranganSehat, rekomendasi } = await fetchData(() =>
      getVerifiedCountByTingkatan("SMP")
    );

    setSmp({ keteranganSehat, rekomendasi, total: 0 });
  };

  const getVerifiedSma = async () => {
    const { keteranganSehat, rekomendasi, rapot, kartuKeluarga } =
      await fetchData(() => getVerifiedCountByTingkatan("SMA"));

    setSma({ keteranganSehat, rekomendasi, rapot, kartuKeluarga, total: 0 });
  };

  const getVerifiedDewasa = async () => {
    const { keteranganSehat, rekomendasi, kartuKeluarga } = await fetchData(
      () => getVerifiedCountByTingkatan("Dewasa")
    );

    setDewasa({ keteranganSehat, rekomendasi, kartuKeluarga, total: 0 });
  };

  const refreshCount = () => {
    getAllDocCount();
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

      <div className="flex gap-1 flex-wrap mb-1">
        <VerifiedDetail label="TOTAL" total={keteranganSehat} />
        <VerifiedDetail label="SD" total={sd.keteranganSehat} />
        <VerifiedDetail label="SMP" total={smp.keteranganSehat} />
        <VerifiedDetail label="SMA" total={sma.keteranganSehat} />
        <VerifiedDetail label="DEWASA" total={dewasa.keteranganSehat} />
      </div>

      {detail && (
        <table className="w-full">
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
      )}
    </div>
  );
};
export default Verified;
