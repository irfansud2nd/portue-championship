import { DataKontingenState, DataOfficialState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";
import { findNamaKontingen } from "@/utils/sharedFunctions";

const TabelOfficial = ({
  data,
  kontingens,
  handleDelete,
  handleEdit,
}: {
  data: DataOfficialState[];
  kontingens: DataKontingenState[];
  handleDelete: (data: DataOfficialState) => void;
  handleEdit: (data: DataOfficialState) => void;
}) => {
  const tableHead = [
    "No",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Jabatan",
    "Nama Kontingen",
    "Aksi",
  ];

  return (
    <table>
      <thead>
        <tr>
          {tableHead.map((item) => (
            <th key={item} scope="col">
              {item}
            </th>
          ))}
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
            <td>
              <TabelActionButtons
                handleDelete={() => handleDelete(item)}
                handleEdit={() => handleEdit(item)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TabelOfficial;
