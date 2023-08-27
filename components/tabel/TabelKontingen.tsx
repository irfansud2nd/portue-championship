import { DataKontingenState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";

const TabelKontingen = ({
  data,
  handleDelete,
  handleEdit,
}: {
  data: DataKontingenState[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
}) => {
  const tableHead = ["No", "Nama Kontingen", "Official", "Peserta", "Aksi"];
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
          <tr key={item.idKontingen}>
            <td>{i + 1}</td>
            <td>{item.namaKontingen}</td>
            <td>{item.officials.length}</td>
            <td>{item.pesertas.length}</td>
            <td>
              <TabelActionButtons
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                id={item.idKontingen}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TabelKontingen;
