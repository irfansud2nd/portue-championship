import { DataKontingenState, DataOfficialState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";
import { findNamaKontingen } from "@/utils/sharedFunctions";
import { BiLoader } from "react-icons/bi";

const TabelOfficial = ({
  loading,
  data,
  kontingens,
  handleDelete,
  handleEdit,
}: {
  loading: boolean;
  data: DataOfficialState[];
  kontingens: DataKontingenState[];
  handleDelete?: (data: DataOfficialState) => void;
  handleEdit?: (data: DataOfficialState) => void;
}) => {
  const tableHead = [
    "No",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Jabatan",
    "Nama Kontingen",
  ];

  return (
    <>
      {!data.length ? (
        loading ? (
          <p>
            Memuat Data Official... <BiLoader className="animate-spin inline" />
          </p>
        ) : (
          <p className="text-red-500">Belum ada Official yang didaftarkan</p>
        )
      ) : (
        <table>
          <thead>
            <tr>
              {tableHead.map((item) => (
                <th key={item} scope="col">
                  {item}
                </th>
              ))}
              {handleDelete && handleEdit && (
                <th key="aksi" scope="col">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.namaLengkap}</td>
                <td>{item.jenisKelamin}</td>
                <td className="capitalize">{item.jabatan}</td>
                <td>{findNamaKontingen(kontingens, item.idKontingen)}</td>
                {handleDelete && handleEdit && (
                  <td>
                    <TabelActionButtons
                      handleDelete={() => handleDelete(item)}
                      handleEdit={() => handleEdit(item)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
export default TabelOfficial;
