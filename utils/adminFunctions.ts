import { KontingenState, OfficialState, PesertaState } from "./types";

// DATA FETCHER BY ID KONTINGEN - START
export const getPesertasByKontingen = (
  idKontingen: string,
  pesertas: PesertaState[]
) => {
  let result: PesertaState[] = [];

  pesertas.map((peserta) => {
    if (peserta.idKontingen == idKontingen) result.push(peserta);
  });

  return result;
};
export const getOfficialsByKontingen = (
  idKontingen: string,
  officials: OfficialState[]
) => {
  let result: OfficialState[] = [];

  officials.map((official) => {
    if (official.idKontingen == idKontingen) result.push(official);
  });

  return result;
};

// DATA FETCHER BY ID KONTINGEN - END

export const getKontingenUnpaid = (
  kontingen: KontingenState,
  pesertas: PesertaState[]
) => {
  let paidNominal = 0;

  kontingen.infoPembayaran.map((info) => {
    paidNominal += Math.floor(
      Number(info.nominal.replace(/[^0-9]/g, "")) / 1000
    );
  });

  const filteredPesertas = getPesertasByKontingen(kontingen.id, pesertas);
  let nominalToPay = filteredPesertas.length * 300000;

  return nominalToPay - paidNominal * 1000;
};

export const formatTanggal = (
  tgl: string | number | undefined,
  withHour?: boolean
) => {
  if (tgl) {
    const date = new Date(tgl);
    if (withHour) {
      return `${date.getDate()} ${date.toLocaleString("id", {
        month: "short",
      })}, ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
    } else {
      return `${date.getDate()} ${date.toLocaleString("id", {
        month: "short",
      })}, ${date.getFullYear()}`;
    }
  } else {
    return "-";
  }
};

// FIND NAMA KONTINGEN
export const findNamaKontingen = (
  dataKontingen: KontingenState[],
  idKontingen: string
) => {
  const index = dataKontingen.findIndex(
    (kontingen) => kontingen.id == idKontingen
  );
  return dataKontingen[index]
    ? dataKontingen[index].namaKontingen
    : "kontingen not found";
};
