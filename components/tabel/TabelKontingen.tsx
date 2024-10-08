import { KontingenState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";

const TabelKontingen = ({
  data,
  handleDelete,
  handleEdit,
}: {
  data: KontingenState[];
  handleDelete: (data: KontingenState) => void;
  handleEdit: (data: KontingenState) => void;
}) => {
  const tableHead = ["No", "Nama Kontingen", "Official", "Peserta", "Aksi"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
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
              <td className="uppercase">{item.namaKontingen}</td>
              <td>{item.officials.length}</td>
              <td>{item.pesertas.length}</td>
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
    </div>
  );
};
export default TabelKontingen;
