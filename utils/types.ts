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
export type FormKontingenProps = {
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
  pembayaran: {
    noHp: string;
    pesertas: string[];
    nominal: string;
    waktu: string;
    downloadBuktiUrl: string;
    konfirmasi: {
      status: boolean;
      nama: string;
      email: string;
      waktu: string;
    };
  }[];
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
  idKontingen: string;
  downloadFotoUrl: string;
  fotoUrl: string;
  pembayaran: {
    noHp: string;
    waktu: string;
    downdloadBuktiUrl: string;
  };
  konfirmasiPembayaran: {
    status: boolean;
    nama: string;
    email: string;
    waktu: string;
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
};
