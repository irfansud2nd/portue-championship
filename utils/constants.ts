import { FirebaseError } from "firebase/app";
import {
  KontingenState,
  OfficialState,
  PesertaState,
  ErrorOfficial,
  ErrorPeserta,
} from "./types";
import { Id } from "react-toastify";

export type ServerAction<T> =
  | { result: T; error: null }
  | { result: null; error: FirebaseError };

export type ToastId = React.MutableRefObject<Id | null>;

// KATEGORI GENERATOR - START

// GENERATOR
const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebasBawah?: { namaKelas: string; batasKelas?: number },
  bebasAtas?: { namaKelas: string; batasKelas?: number }
) => {
  const numberToAlphabet = (index: number) => {
    return String.fromCharCode(index + "A".charCodeAt(0));
  };

  const alphabetToNumber = (letter: string) => {
    return letter.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  };

  const repeatValue = alphabetToNumber(endAlphabet);
  let kategoriArr: string[] = [];
  let startKategori: number = 0;

  if (bebasBawah)
    kategoriArr.push(
      `Kelas ${bebasBawah.namaKelas} (Dibawah ${
        bebasBawah.batasKelas ? bebasBawah.batasKelas : start
      } KG)`
    );

  startKategori = start;
  for (let i = 0; i <= repeatValue; i++) {
    kategoriArr.push(
      `Kelas ${numberToAlphabet(i)} (${startKategori}-${
        startKategori + step
      } KG)`
    );
    startKategori += step;
  }
  const endNumber = startKategori;
  if (bebasAtas)
    kategoriArr.push(
      `Kelas ${bebasAtas.namaKelas} (Diatas ${
        bebasAtas.batasKelas ? bebasAtas.batasKelas : endNumber
      } KG)`
    );
  return kategoriArr;
};

// SENI TUNGGAL
const seniTunggal = {
  putra: ["Tunggal Putra"],
  putri: ["Tunggal Putri"],
};

// SENI LENGKAP
const seniLengkap = {
  putra: ["Tunggal Putra", "Ganda Putra", "Regu Putra"],
  putri: ["Tunggal Putri", "Ganda Putri", "Regu Putri"],
};
const seniSma = {
  putra: ["Tunggal Putra", "Ganda Putra", "Regu Putra"],
  putri: ["Ganda Putri", "Regu Putri"],
};
// KATEGORI GENERATOR - END

// JENIS PERTANDINGAN OPTION
export const jenisPertandingan = ["Tanding", "Seni"];

// JENIS KELAMIN OPTION
export const jenisKelamin = ["Putra", "Putri"];

// TINGKATAN DAN KATEGORI OPTION
export const tingkatanKategori = [
  {
    tingkatan: "SD I",
    kategoriTanding: generateKategoriPertandingan("P", 16, 2),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SD II",
    kategoriTanding: generateKategoriPertandingan(
      "O",
      26,
      2,
      {
        namaKelas: "<A",
      },
      { namaKelas: "Bebas" }
    ),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SMP",
    kategoriTanding: generateKategoriPertandingan("P", 30, 3, {
      namaKelas: "<A",
    }),
    kategoriSeni: seniLengkap,
  },
  {
    tingkatan: "SMA",
    kategoriTanding: generateKategoriPertandingan(
      "I",
      39,
      4,
      { namaKelas: "<39" },
      { namaKelas: "Bebas" }
    ),
    kategoriSeni: seniLengkap,
  },
  {
    tingkatan: "Dewasa",
    kategoriTanding: generateKategoriPertandingan(
      "J",
      45,
      5,
      { namaKelas: "<45" },
      { namaKelas: "Bebas" }
    ),
    kategoriSeni: seniLengkap,
  },
];

// OPTION KATEGORI PENDAFTARAN
export const kategoriPendaftaranArray = [
  "kontingen",
  "official",
  "peserta",
  "pembayaran",
];

// JABATAN OPTION
export const jabatanOfficials = ["Official", "Manajer Tim", "Pelatih"];

// DATA KONTINGEN INITIAL VALUE
export const dataKontingenInitialValue: KontingenState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaKontingen: "",
  pesertas: [],
  officials: [],
  idPembayaran: [],
  unconfirmedPembayaran: [],
  confirmedPembayaran: [],
  infoPembayaran: [],
  infoKonfirmasi: [],
};

// DATA OFFICIAL INITIAL VALUE
export const dataOfficialInitialValue: OfficialState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  jenisKelamin: jenisKelamin[0],
  jabatan: jabatanOfficials[0],
  idKontingen: "",
  fotoUrl: "",
  downloadFotoUrl: "",
};

// DATA PESERTA INITIAL VALUE
export const dataPesertaInitialValue: PesertaState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  umur: 0,
  beratBadan: 0,
  tinggiBadan: 0,
  alamatLengkap: "",
  jenisKelamin: jenisKelamin[0],
  tingkatanPertandingan: tingkatanKategori[0].tingkatan,
  jenisPertandingan: jenisPertandingan[0],
  kategoriPertandingan: tingkatanKategori[0].kategoriTanding[0],
  idKontingen: "",
  fotoUrl: "",
  downloadFotoUrl: "",
  kkUrl: "",
  downloadKkUrl: "",
  ktpUrl: "",
  downloadKtpUrl: "",
  email: "",
  noHp: "",
  pembayaran: false,
  idPembayaran: "",
  confirmedPembayaran: false,
  infoPembayaran: {
    noHp: "",
    waktu: 0,
    buktiUrl: "",
  },
  infoKonfirmasi: {
    nama: "",
    email: "",
    waktu: 0,
  },
};

// ERRROR OFFICIAL
export const errorOfficialInitialValue: ErrorOfficial = {
  namaLengkap: null,
  jenisKelamin: null,
  jabatan: null,
  idKontingen: null,
  pasFoto: null,
};

// ERROR PESERTA
export const errorPesertaInitialValue: ErrorPeserta = {
  namaLengkap: null,
  NIK: null,
  tempatLahir: null,
  tanggalLahir: null,
  beratBadan: null,
  tinggiBadan: null,
  jenisKelamin: null,
  alamatLengkap: null,
  idKontingen: null,
  tingkatanPertandingan: null,
  jenisPertandingan: null,
  kategoriPertandingan: null,
  pasFoto: null,
  noHp: null,
  kk: null,
  ktp: null,
  email: null,
};
