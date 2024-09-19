import { findNamaKontingen } from "@/utils/functions";
import { KontingenState, PesertaState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";
import { BiLoader } from "react-icons/bi";

type Props = {
  loading: boolean;
  data: PesertaState[];
  kontingen: KontingenState | undefined;
  handleDelete?: (data: PesertaState) => void;
  handleEdit?: (data: PesertaState) => void;
};

const TabelPeserta = ({
  loading,
  data,
  kontingen,
  handleDelete,
  handleEdit,
}: Props) => {
  const tableHead = [
    "No",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Nama Kontingen",
    "Tingkatan",
    "Jenis Pertandingan",
    "Kategori Tanding",
  ];

  return (
    <div className="overflow-x-auto">
      {!data.length ? (
        loading ? (
          <p>
            Memuat Data Peserta... <BiLoader className="animate-spin inline" />
          </p>
        ) : (
          <p className="text-red-500">Belum ada Peserta yang didaftarkan</p>
        )
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              {tableHead.map((item) => (
                <th key={item} scope="col">
                  {item}
                </th>
              ))}
              <th key="aksi" scope="col">
                {handleDelete && handleEdit ? "Aksi" : "Status Pembayaran"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td className="capitalize">{item.namaLengkap}</td>
                <td>{item.jenisKelamin}</td>
                <td className="uppercase">{kontingen?.namaKontingen || "-"}</td>
                <td>{item.tingkatanPertandingan}</td>
                <td>{item.jenisPertandingan}</td>
                <td className="whitespace-nowrap">
                  {item.kategoriPertandingan}
                </td>
                <td>
                  {handleDelete && handleEdit ? (
                    <TabelActionButtons
                      handleDelete={() => handleDelete(item)}
                      handleEdit={() => handleEdit(item)}
                    />
                  ) : item.pembayaran ? (
                    item.confirmedPembayaran ? (
                      "Pembayaran sudah dikonfirmasi"
                    ) : (
                      "Menunggu konfirmasi dari admin"
                    )
                  ) : (
                    "Belum dibayar"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default TabelPeserta;
