import { DataPesertaState } from "@/utils/types";
import { useEffect, useState } from "react";

const CheckAllPersyaratanButton = ({
  checkAll,
  arrays,
  pesertas,
}: {
  checkAll: (arg1: boolean, arg0: string, arg2: string[]) => void;
  arrays: {
    keteranganSehat: string[];
    rekomendasi: string[];
    rapot: string[];
    kartuKeluarga: string[];
  };
  pesertas: DataPesertaState[];
}) => {
  const [sd, setSd] = useState<{
    keteranganSehat: string[];
    rekomendasi: string[];
  }>({
    keteranganSehat: [],
    rekomendasi: [],
  });
  const [smp, setSmp] = useState<{
    keteranganSehat: string[];
    rekomendasi: string[];
  }>({
    keteranganSehat: [],
    rekomendasi: [],
  });
  const [sma, setSma] = useState<{
    keteranganSehat: string[];
    rekomendasi: string[];
    kartuKeluarga: string[];
    rapot: string[];
  }>({
    keteranganSehat: [],
    rekomendasi: [],
    kartuKeluarga: [],
    rapot: [],
  });
  const [dewasa, setDewasa] = useState<{
    keteranganSehat: string[];
    rekomendasi: string[];
    kartuKeluarga: string[];
  }>({
    keteranganSehat: [],
    rekomendasi: [],
    kartuKeluarga: [],
  });
  const [total, setTotal] = useState<{
    sd: string[];
    smp: string[];
    sma: string[];
    dewasa: string[];
  }>({ sd: [], smp: [], sma: [], dewasa: [] });

  useEffect(() => {
    let sd: string[] = [];
    let smp: string[] = [];
    let sma: string[] = [];
    let dewasa: string[] = [];
    pesertas.map((peserta) => {
      if (peserta.tingkatanPertandingan.includes("SD")) {
        sd.push(peserta.id);
      }
      if (peserta.tingkatanPertandingan.includes("SMP")) {
        smp.push(peserta.id);
      }
      if (peserta.tingkatanPertandingan.includes("SMA")) {
        sma.push(peserta.id);
      }
      if (peserta.tingkatanPertandingan.includes("Dewasa")) {
        dewasa.push(peserta.id);
      }
    });
    setTotal({
      sd,
      smp,
      sma,
      dewasa,
    });
  }, [pesertas]);

  useEffect(() => {
    let sd: {
      keteranganSehat: string[];
      rekomendasi: string[];
    } = {
      keteranganSehat: [],
      rekomendasi: [],
    };
    let smp: {
      keteranganSehat: string[];
      rekomendasi: string[];
    } = {
      keteranganSehat: [],
      rekomendasi: [],
    };
    let sma: {
      keteranganSehat: string[];
      rekomendasi: string[];
      rapot: string[];
      kartuKeluarga: string[];
    } = {
      keteranganSehat: [],
      rekomendasi: [],
      kartuKeluarga: [],
      rapot: [],
    };
    let dewasa: {
      keteranganSehat: string[];
      rekomendasi: string[];
      kartuKeluarga: string[];
    } = {
      keteranganSehat: [],
      rekomendasi: [],
      kartuKeluarga: [],
    };
    if (Object.values(total).length) {
      arrays.keteranganSehat.map((item) => {
        if (total.sd.indexOf(item) >= 0) {
          sd.keteranganSehat.push(item);
        }
        if (total.smp.indexOf(item) >= 0) {
          smp.keteranganSehat.push(item);
        }
        if (total.sma.indexOf(item) >= 0) {
          sma.keteranganSehat.push(item);
        }
        if (total.dewasa.indexOf(item) >= 0) {
          dewasa.keteranganSehat.push(item);
        }
      });
      arrays.rekomendasi.map((item) => {
        if (total.sd.indexOf(item) >= 0) {
          sd.rekomendasi.push(item);
        }
        if (total.smp.indexOf(item) >= 0) {
          smp.rekomendasi.push(item);
        }
        if (total.sma.indexOf(item) >= 0) {
          sma.rekomendasi.push(item);
        }
        if (total.dewasa.indexOf(item) >= 0) {
          dewasa.rekomendasi.push(item);
        }
      });
      arrays.rapot.map((item) => {
        if (total.sma.indexOf(item) >= 0) {
          sma.rapot.push(item);
        }
      });
      arrays.kartuKeluarga.map((item) => {
        if (total.sma.indexOf(item) >= 0) {
          sma.kartuKeluarga.push(item);
        }
        if (total.dewasa.indexOf(item) >= 0) {
          dewasa.kartuKeluarga.push(item);
        }
      });
    }
    setSd({ keteranganSehat: sd.keteranganSehat, rekomendasi: sd.rekomendasi });
    setSmp({
      keteranganSehat: smp.keteranganSehat,
      rekomendasi: smp.rekomendasi,
    });
    setSma({
      keteranganSehat: sma.keteranganSehat,
      rekomendasi: sma.rekomendasi,
      kartuKeluarga: sma.kartuKeluarga,
      rapot: sma.rapot,
    });
    setDewasa({
      keteranganSehat: dewasa.keteranganSehat,
      rekomendasi: dewasa.rekomendasi,
      kartuKeluarga: dewasa.kartuKeluarga,
    });
  }, [arrays, total]);

  return (
    <div className="mb-1">
      <table>
        <thead>
          <tr>
            <th>Persyaratan</th>
            <th>SD</th>
            <th>SMP</th>
            <th>SMA</th>
            <th>Dewasa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mt-0.5">Surat Keterangan Sehat</td>
            <td>
              Total : {total.sd.length}
              <br />
              Checked : {sd.keteranganSehat.length}
              <br />
              Unchecked : {total.sd.length - sd.keteranganSehat.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    sd.keteranganSehat.length != total.sd.length,
                    "keteranganSehat",
                    total.sd
                  )
                }
                className={`btn_${
                  sd.keteranganSehat.length == total.sd.length ? "red" : "green"
                } btn_full`}
              >
                {sd.keteranganSehat.length == total.sd.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All SD
              </button>
            </td>
            <td>
              Total : {total.smp.length}
              <br />
              Checked : {smp.keteranganSehat.length}
              <br />
              Unchecked : {total.smp.length - smp.keteranganSehat.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    smp.keteranganSehat.length != total.smp.length,
                    "keteranganSehat",
                    total.smp
                  )
                }
                className={`btn_${
                  smp.keteranganSehat.length == total.smp.length
                    ? "red"
                    : "green"
                } btn_full`}
              >
                {smp.keteranganSehat.length == total.smp.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All SMP
              </button>
            </td>
            <td>
              Total : {total.sma.length}
              <br />
              Checked : {sma.keteranganSehat.length}
              <br />
              Unchecked : {total.sma.length - sma.keteranganSehat.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    sma.keteranganSehat.length != total.sma.length,
                    "keteranganSehat",
                    total.sma
                  )
                }
                className={`btn_${
                  sma.keteranganSehat.length == total.sma.length
                    ? "red"
                    : "green"
                } btn_full`}
              >
                {sma.keteranganSehat.length == total.sma.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All SMA
              </button>
            </td>
            <td>
              Total : {total.dewasa.length}
              <br />
              Checked : {dewasa.keteranganSehat.length}
              <br />
              Unchecked : {total.dewasa.length - dewasa.keteranganSehat.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    dewasa.keteranganSehat.length != total.dewasa.length,
                    "keteranganSehat",
                    total.dewasa
                  )
                }
                className={`btn_${
                  dewasa.keteranganSehat.length == total.dewasa.length
                    ? "red"
                    : "green"
                } btn_full`}
              >
                {dewasa.keteranganSehat.length == total.dewasa.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All Dewasa
              </button>
            </td>
          </tr>
          <tr>
            <td className="mt-0.5">Surat Rekomendasi</td>
            <td>
              Total : {total.sd.length}
              <br />
              Checked : {sd.rekomendasi.length}
              <br />
              Unchecked : {total.sd.length - sd.rekomendasi.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    sd.rekomendasi.length != total.sd.length,
                    "rekomendasi",
                    total.sd
                  )
                }
                className={`btn_${
                  sd.rekomendasi.length == total.sd.length ? "red" : "green"
                } btn_full`}
              >
                {sd.rekomendasi.length == total.sd.length ? "Uncheck" : "Check"}{" "}
                All SD
              </button>
            </td>
            <td>
              Total : {total.smp.length}
              <br />
              Checked : {smp.rekomendasi.length}
              <br />
              Unchecked : {total.smp.length - smp.rekomendasi.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    smp.rekomendasi.length != total.smp.length,
                    "rekomendasi",
                    total.smp
                  )
                }
                className={`btn_${
                  smp.rekomendasi.length == total.smp.length ? "red" : "green"
                } btn_full`}
              >
                {smp.rekomendasi.length == total.smp.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All SMP
              </button>
            </td>
            <td>
              Total : {total.sma.length}
              <br />
              Checked : {sma.rekomendasi.length}
              <br />
              Unchecked : {total.sma.length - sma.rekomendasi.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    sma.rekomendasi.length != total.sma.length,
                    "rekomendasi",
                    total.sma
                  )
                }
                className={`btn_${
                  sma.rekomendasi.length == total.sma.length ? "red" : "green"
                } btn_full`}
              >
                {sma.rekomendasi.length == total.sma.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All SMA
              </button>
            </td>
            <td>
              Total : {total.dewasa.length}
              <br />
              Checked : {dewasa.rekomendasi.length}
              <br />
              Unchecked : {total.dewasa.length - dewasa.rekomendasi.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    dewasa.rekomendasi.length != total.dewasa.length,
                    "rekomendasi",
                    total.dewasa
                  )
                }
                className={`btn_${
                  dewasa.rekomendasi.length == total.dewasa.length
                    ? "red"
                    : "green"
                } btn_full`}
              >
                {dewasa.rekomendasi.length == total.dewasa.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All Dewasa
              </button>
            </td>
          </tr>
          <tr>
            <td className="mt-0.5">Rapot</td>
            <td>-</td>
            <td>-</td>
            <td>
              Total : {total.sma.length}
              <br />
              Checked : {sma.rapot.length}
              <br />
              Unchecked : {total.sma.length - sma.rapot.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    sma.rapot.length != total.sma.length,
                    "rapot",
                    total.sma
                  )
                }
                className={`btn_${
                  sma.rapot.length == total.sma.length ? "red" : "green"
                } btn_full`}
              >
                {sma.rapot.length == total.sma.length ? "Uncheck" : "Check"} All
                SMA
              </button>
            </td>
            <td>-</td>
          </tr>
          <tr>
            <td className="mt-0.5">Kartu Keluarga</td>
            <td>-</td>
            <td>-</td>
            <td>
              {" "}
              Total : {total.sma.length}
              <br />
              Checked : {sma.kartuKeluarga.length}
              <br />
              Unchecked : {total.sma.length - sma.kartuKeluarga.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    sma.kartuKeluarga.length != total.sma.length,
                    "kartuKeluarga",
                    total.sma
                  )
                }
                className={`btn_${
                  sma.kartuKeluarga.length == total.sma.length ? "red" : "green"
                } btn_full`}
              >
                {sma.kartuKeluarga.length == total.sma.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All SMA
              </button>
            </td>
            <td>
              Total : {total.dewasa.length}
              <br />
              Checked : {dewasa.kartuKeluarga.length}
              <br />
              Unchecked : {total.dewasa.length - dewasa.kartuKeluarga.length}
              <br />
              <button
                onClick={() =>
                  checkAll(
                    dewasa.kartuKeluarga.length != total.dewasa.length,
                    "kartuKeluarga",
                    total.dewasa
                  )
                }
                className={`btn_${
                  dewasa.kartuKeluarga.length == total.dewasa.length
                    ? "red"
                    : "green"
                } btn_full`}
              >
                {dewasa.kartuKeluarga.length == total.dewasa.length
                  ? "Uncheck"
                  : "Check"}{" "}
                All Dewasa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default CheckAllPersyaratanButton;
