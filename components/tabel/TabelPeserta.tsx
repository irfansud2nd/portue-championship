import { findNamaKontingen } from "@/utils/sharedFunctions";
import { DataKontingenState, DataPesertaState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";
import { BiLoader } from "react-icons/bi";

const TabelPeserta = ({
  loading,
  data,
  kontingens,
  handleDelete,
  handleEdit,
}: {
  loading: boolean;
  data: DataPesertaState[];
  kontingens: DataKontingenState[];
  handleDelete?: (data: DataPesertaState) => void;
  handleEdit?: (data: DataPesertaState) => void;
}) => {
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
                <td className="uppercase">
                  {findNamaKontingen(kontingens, item.idKontingen)}
                </td>
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
