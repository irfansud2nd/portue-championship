import { type } from "os";

// KATEGORI PENDAFTARAN
export type KategoriPendaftaranProps = {
  setKategoriPendaftaran: React.Dispatch<React.SetStateAction<string>>;
  kategoriPendaftaran: string;
};

// FORM PENDAFTARAN
export type FormPendaftaranProps = {
  kategoriPendaftaran: string;
};

// TABEL PENDAFTARAN
export type TabelPendaftaranProps = {
  kategoriPendaftaran: string;
  data: any[];
};

// FOR ALL FORM
export type FormProps = {
  kontingens: DataKontingenState[];
  setKontingens: React.Dispatch<
    React.SetStateAction<DataKontingenState[] | any[]>
  >;
};

// DATA KONTINGEN
export type DataKontingenState = {
  idKontingen: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaKontingen: string;
  pesertas: string[] | [];
  officials: string[] | [];
  downloadBuktiPembayaranUrl: string;
  waktuPembayaran: string;
  konfirmasiPembayaran: boolean;
};

// DATA OFFICIAL
export type DataOfficialState = {
  id: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaLengkap: string;
  jenisKelamin: string;
  jabatan: string;
  namaKontingen: string;
  idKontingen: string;
  fotoUrl: string;
  downloadFotoUrl: string;
};

// DATA PESERTA
export type DataPesertaState = {
  id: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  creatorEmail: string;
  creatorUid: string;
  namaLengkap: string;
  NIK: string;
  tempatLahir: string;
  tanggalLahir: string;
  umur: string;
  beratBadan: number;
  tinggiBadan: number;
  alamatLengkap: string;
  jenisKelamin: string;
  tingkatanPertandingan: string;
  jenisPertandingan: string;
  kategoriPertandingan: string;
  namaKontingen: string;
  idKontingen: string;
  downloadFotoUrl: string;
  fotoUrl: string;
  downloadBuktiPembayaranUrl: string;
  waktuPembayaran: string;
  konfirmasiPembayaran: boolean;
};

// DELETE INFO
export type DeleteInfoState = {
  id: string;
  pesertas: string[] | [];
  officials: string[] | [];
  dibayar: boolean;
};

export type ErrorValidationMessagesForOfficials = {
  namaLengkap: string | null;
  jenisKelamin: string | null;
  jabatan: string | null;
  namaKontingen: string | null;
  pasFoto: string | null;
};
