import { DataOfficialState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";

const TabelOfficial = ({
  data,
  handleDelete,
  handleEdit,
}: {
  data: DataOfficialState[];
  handleDelete: (
    idOfficial: string,
    namaLengkap: string,
    idKontingen: string
  ) => void;
  handleEdit: (idOfficial: string) => void;
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
          <tr key={item.idOfficial}>
            <td>{i + 1}</td>
            <td>{item.namaLengkap}</td>
            <td>{item.jenisKelamin}</td>
            <td className="capitalize">{item.jabatan}</td>
            <td>{item.namaKontingen}</td>
            <td>
              <TabelActionButtons
                handleDelete={() =>
                  handleDelete(
                    item.idOfficial,
                    item.namaLengkap,
                    item.idKontingen
                  )
                }
                handleEdit={() => handleEdit(item.idOfficial)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TabelOfficial;
