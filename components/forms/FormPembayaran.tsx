import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
} from "@/utils/types";
import InfoKontingenTerdaftar from "../tabel/InfoKontingenTerdaftar";

const FormPembayaran = ({
  kontingens,
  officials,
  pesertas,
}: {
  kontingens: DataKontingenState[];
  officials: DataOfficialState[];
  pesertas: DataPesertaState[];
}) => {
  return (
    <div>
      <InfoKontingenTerdaftar
        kontingens={kontingens}
        officials={officials}
        pesertas={pesertas}
      />
    </div>
  );
};
export default FormPembayaran;
