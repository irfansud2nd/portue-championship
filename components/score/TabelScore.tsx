import { compare } from "@/utils/functions";

type Props = {
  label: "SD" | "SMP" | "SMA" | "Dewasa";
  medalis: string[];
  rawData: any[];
};
const TabelScore = ({ medalis, label, rawData }: Props) => {
  const filterData = (array: any[]) => {
    return array.filter((item) => {
      if (medalis.length > 2) {
        return (
          item[medalis[0]] != 0 ||
          item[medalis[1]] != 0 ||
          item[medalis[2]] != 0
        );
      } else {
        return item[medalis[0]] != 0 || item[medalis[1]] != 0;
      }
    });
  };
  const dataSort = () => {
    const filteredData = filterData(rawData);
    if (medalis.length > 2) {
      return filteredData
        .sort(compare("namaKontingen", "asc"))
        .sort(compare(medalis[2], "desc"))
        .sort(compare(medalis[1], "desc"))
        .sort(compare(medalis[0], "desc"));
    } else {
      return filteredData
        .sort(compare("namaKontingen", "asc"))
        .sort(compare(medalis[1], "desc"))
        .sort(compare(medalis[0], "desc"));
    }
  };

  const data = dataSort();
  return (
    <div>
      <h1 className="text-2xl font-bold">
        REKAPITULASI PEROLEHAN MEDALI {label}
      </h1>
      <div className="max-h-[351px] overflow-y-scroll">
        <table className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kontingen</th>
              <th>Emas</th>
              <th>Perak</th>
              {medalis.length > 2 && <th>Perunggu</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.idKontingen}>
                <td>{i + 1}</td>
                <td>{item.namaKontingen.toUpperCase()}</td>
                <td>{item[medalis[0]]}</td>
                <td>{item[medalis[1]]}</td>
                {medalis.length > 2 && <td>{item[medalis[2]]}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TabelScore;
