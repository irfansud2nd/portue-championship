import { findNamaKontingen } from "./sharedFunctions";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
  ErrorOfficial,
  ErrorPeserta,
} from "./types";

// KATEGORI GENERATOR - START
// ALPHABET
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];

// GENERATOR
const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebasBawah?: { namaKelas: string; batasKelas?: number },
  bebasAtas?: { namaKelas: string; batasKelas?: number }
) => {
  const repeatValue = alphabet.indexOf(endAlphabet);
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
      `Kelas ${alphabet[i]} (${startKategori}-${startKategori + step} KG)`
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
    kategoriTanding: generateKategoriPertandingan("O", 26, 2, {
      namaKelas: "<A",
    }),
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
export const dataKontingenInitialValue: DataKontingenState = {
  idKontingen: "",
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
export const dataOfficialInitialValue: DataOfficialState = {
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
export const dataPesertaInitialValue: DataPesertaState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  umur: "",
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
    waktu: "",
    buktiUrl: "",
  },
  infoKonfirmasi: {
    nama: "",
    email: "",
    waktu: "",
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
