import { KontingenState, OfficialState } from "@/utils/types";
import TabelActionButtons from "./TabelActionButtons";
import { findNamaKontingen } from "@/utils/functions";
import { BiLoader } from "react-icons/bi";

type Props = {
  loading: boolean;
  data: OfficialState[];
  kontingen: KontingenState | undefined;
  handleDelete?: (data: OfficialState) => void;
  handleEdit?: (data: OfficialState) => void;
};

const TabelOfficial = ({
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
    "Jabatan",
    "Nama Kontingen",
  ];

  return (
    <div className="overflow-x-auto">
      {!data.length ? (
        loading ? (
          <p>
            Memuat Data Official... <BiLoader className="animate-spin inline" />
          </p>
        ) : (
          <p className="text-red-500">Belum ada Official yang didaftarkan</p>
        )
      ) : (
        <div>
          <table className="w-full">
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
                  <td className="uppercase">
                    {kontingen ? kontingen.namaKontingen : "-"}
                  </td>
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
        </div>
      )}
    </div>
  );
};
export default TabelOfficial;
