import { AdminContext } from "@/context/AdminContext";
import { compare } from "@/utils/sharedFunctions";
import { DataKontingenState } from "@/utils/types";
import { Result } from "postcss";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const TabelPembayaran = () => {
  const { kontingens }: { kontingens: DataKontingenState[] } = AdminContext();
  const [paidKontingens, setPaidKontingens] = useState<
    {
      namaKontingen: string;
      totalBayar: string;
    }[]
  >([]);

  useEffect(() => {
    getPaidKontingens();
  }, []);

  const getTotalBayar = (kontingen: DataKontingenState) => {
    let totalBayar = 0;
    kontingen.infoPembayaran.map((item) => {
      if (
        kontingen.confirmedPembayaran.findIndex(
          (i) => i == item.idPembayaran
        ) >= 0
      ) {
        let arr = [];
        arr = item.nominal.split("");
        arr.splice(-3, 3);
        totalBayar += parseFloat(arr.join("").replace(/[Rp.,\s]/g, ""));
      }
    });
    return `Rp. ${(totalBayar * 1000).toLocaleString("id")}`;
  };

  const getPaidKontingens = () => {
    let result: {
      namaKontingen: string;
      totalBayar: string;
    }[] = [];
    kontingens.map((kontingen) => {
      if (kontingen.confirmedPembayaran.length > 0) {
        result.push({
          namaKontingen: kontingen.namaKontingen,
          totalBayar: getTotalBayar(kontingen),
        });
      }
    });
    setPaidKontingens(result);
  };

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Pembayaran",
  });

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Pembayaran
      </h1>
      <button className="btn_green btn_full mb-1" onClick={onDownload}>
        Download
      </button>
      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Total Bayar</th>
            <th>Bukti Transfer</th>
            <th>Cek</th>
          </tr>
        </thead>
        <tbody>
          {paidKontingens
            .sort(compare("namaKontingen", "asc"))
            .map((item, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{item.namaKontingen.toUpperCase()}</td>
                <td>{item.totalBayar}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelPembayaran;
