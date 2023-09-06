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
    "Belum Lunas",
    "Konfirmasi",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const getUnpaidPeserta = (kontingen: DataKontingenState) => {
    if (!kontingen.infoPembayaran || !kontingen.pesertas) return 0;
    let paidNominal = 0;
    kontingen.infoPembayaran.map(
      (info) => (paidNominal += Number(info.nominal.replace(/[^0-9]/g, "")))
    );
    // kontingen.pesertas.length -
    return kontingen.pesertas.length - Math.floor(paidNominal / 300000);
  };

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
                  {kontingen.idPembayaran
                    ? kontingen.idPembayaran.map((idPembayaran) => (
                        <li
                          key={idPembayaran}
                          className="border-b border-black last:border-none"
                        >
                          <p className="whitespace-nowrap">
                            {formatTanggal(
                              kontingen.infoPembayaran[
                                kontingen.infoPembayaran.findIndex(
                                  (info) => info.idPembayaran == idPembayaran
                                )
                              ].waktu,
                              true
                            )}{" "}
                            |{" "}
                            {
                              kontingen.infoPembayaran[
                                kontingen.infoPembayaran.findIndex(
                                  (info) => info.idPembayaran == idPembayaran
                                )
                              ].nominal
                            }
                          </p>
                          <p className="whitespace-nowrap">
                            {kontingen.confirmedPembayaran.indexOf(
                              idPembayaran
                            ) >= 0 ? (
                              `Confirmed by ${
                                kontingen.infoKonfirmasi[
                                  kontingen.infoKonfirmasi.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ].email
                              }`
                            ) : (
                              <TabelAdminActions
                                idPembayaran={idPembayaran}
                                infoPembayaran={
                                  kontingen.infoPembayaran[
                                    kontingen.infoPembayaran.findIndex(
                                      (info) =>
                                        info.idPembayaran == idPembayaran
                                    )
                                  ]
                                }
                                data={kontingen}
                              />
                            )}
                          </p>
                        </li>
                      ))
                    : "-"}
                </ul>
              </td>
              <td>{getUnpaidPeserta(kontingen)}</td>
              <td>
                {kontingen.unconfirmedPembayaran &&
                kontingen.unconfirmedPembayaran.length
                  ? "Butuh Konfimasi"
                  : "Selesai Konfirmasi"}
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
