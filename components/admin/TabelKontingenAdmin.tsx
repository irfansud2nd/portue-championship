import { formatTanggal } from "@/utils/sharedFunctions";
import { DataKontingenState } from "@/utils/types";
import TabelAdminActions from "./TabelAdminActions";

const TabelKontingenAdmin = ({
  kontingens,
  setSelectedKontingen,
}: {
  kontingens: DataKontingenState[];
  setSelectedKontingen: React.Dispatch<
    React.SetStateAction<DataKontingenState | null>
  >;
}) => {
  const tabelHead = [
    "No",
    "ID Kontingen",
    "Nama Kontingen",
    "Peserta",
    "Official",
    "Pembayaran",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kontingens.map((kontingen, i) => (
            <tr key={kontingen.idKontingen}>
              <td>{i + 1}</td>
              <td>{kontingen.idKontingen}</td>
              <td
                className="hover:text-custom-gold cursor-pointer"
                onClick={() => setSelectedKontingen(kontingen)}
              >
                {kontingen.namaKontingen}
              </td>
              <td>{kontingen.pesertas.length}</td>
              <td>{kontingen.officials.length}</td>
              <td>
                <ul>
                  {kontingen.pembayaran
                    ? kontingen.pembayaran.map((pembayaran) => (
                        <li
                          key={pembayaran.waktu}
                          className="border-b border-black last:border-none"
                        >
                          <p className="whitespace-nowrap">
                            {formatTanggal(pembayaran.waktu, true)} |{" "}
                            {pembayaran.nominal}
                          </p>
                          <p className="whitespace-nowrap">
                            {pembayaran.konfirmasi.status ? (
                              `Confirmed by ${pembayaran.konfirmasi.email}`
                            ) : (
                              <TabelAdminActions
                                pembayaran={pembayaran}
                                data={kontingen}
                              />
                            )}
                          </p>
                        </li>
                      ))
                    : "-"}
                </ul>
              </td>
              <td>{kontingen.creatorEmail}</td>
              <td>{formatTanggal(kontingen.waktuPendaftaran)}</td>
              <td>{formatTanggal(kontingen.waktuPerubahan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelKontingenAdmin;
