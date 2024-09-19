// DATA KONTINGEN
export type KontingenState = {
  id: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaKontingen: string;
  pesertas: string[] | [];
  officials: string[] | [];
  idPembayaran: string[];
  unconfirmedPembayaran: string[];
  confirmedPembayaran: string[];
  infoPembayaran: {
    idPembayaran: string;
    nominal: string;
    noHp: string;
    waktu: number;
    buktiUrl: string;
  }[];
  infoKonfirmasi: {
    idPembayaran: string;
    nama: string;
    email: string;
    waktu: number;
  }[];
};

// DATA OFFICIAL
export type OfficialState = {
  id: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaLengkap: string;
  jenisKelamin: string;
  jabatan: string;
  idKontingen: string;
  fotoUrl: string;
  downloadFotoUrl: string;
};

// DATA PESERTA
export type PesertaState = {
  id: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  creatorEmail: string;
  creatorUid: string;
  namaLengkap: string;
  NIK: string;
  tempatLahir: string;
  tanggalLahir: string;
  umur: number;
  beratBadan: number;
  tinggiBadan: number;
  alamatLengkap: string;
  jenisKelamin: string;
  tingkatanPertandingan: string;
  jenisPertandingan: string;
  kategoriPertandingan: string;
  idKontingen: string;
  downloadFotoUrl: string;
  fotoUrl: string;
  downloadKkUrl: string;
  kkUrl: string;
  ktpUrl: string;
  downloadKtpUrl: string;
  email: string;
  noHp: string;
  pembayaran: boolean;
  idPembayaran: string;
  confirmedPembayaran: boolean;
  infoPembayaran: {
    noHp: string;
    waktu: number;
    buktiUrl: string;
  };
  infoKonfirmasi: {
    nama: string;
    email: string;
    waktu: number;
  };
};

export type ErrorOfficial = {
  namaLengkap: string | null;
  jenisKelamin: string | null;
  jabatan: string | null;
  idKontingen: string | null;
  pasFoto: string | null;
};

export type ErrorPeserta = {
  namaLengkap: string | null;
  NIK: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  beratBadan: string | null;
  tinggiBadan: string | null;
  jenisKelamin: string | null;
  alamatLengkap: string | null;
  idKontingen: string | null;
  tingkatanPertandingan: string | null;
  jenisPertandingan: string | null;
  kategoriPertandingan: string | null;
  pasFoto: string | null;
  kk: string | null;
  ktp: string | null;
  noHp: string | null;
  email: string | null;
};
