import { Id, toast } from "react-toastify";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
  ErrorOfficial,
  ErrorPeserta,
} from "./types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firestore, storage } from "./firebase";
import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";

//COMPARE FOR DATA SORTER
export const compare = (query: string, type: "asc" | "desc") => {
  return (a: any, b: any) => {
    if (a[query] < b[query]) {
      return type == "asc" ? -1 : 1;
    }
    if (a[query] > b[query]) {
      return type == "asc" ? 1 : -1;
    }
    return 0;
  };
};

// GET JUMLAH PESERTA
export const getJumlahPeserta = async () => {
  const snapshot = await getCountFromServer(collection(firestore, "pesertas"));
  return snapshot.data().count;
};

// TOAST LOADING
export const newToast = (
  ref: React.MutableRefObject<Id | null>,
  type: "loading" | "error",
  message: string
) => {
  if (type == "loading") {
    ref.current = toast.loading(message, {
      position: "top-center",
      theme: "colored",
    });
  } else {
    ref.current = toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      closeButton: true,
      theme: "colored",
    });
  }
};

// TOAST UPDATE
export const updateToast = (
  ref: React.MutableRefObject<Id | null>,
  type: "success" | "error" | "loading",
  message: string
) => {
  if (ref.current) {
    if (type === "loading") {
      toast.update(ref.current, {
        render: message,
      });
    } else {
      toast.update(ref.current, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  }
};

// FIND NAMA KONTINGEN
export const findNamaKontingen = (
  dataKontingen: DataKontingenState[],
  idKontingen: string
) => {
  const index = dataKontingen.findIndex(
    (kontingen) => kontingen.idKontingen == idKontingen
  );
  return dataKontingen[index]
    ? dataKontingen[index].namaKontingen
    : "kontingen not found";
};

// IMAGE LIMITER
export const limitImage = (
  file: File,
  toastId: React.MutableRefObject<Id | null>
) => {
  const maxSize = 1 * 1024 * 1024; //1MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    newToast(
      toastId,
      "error",
      "File yang dipilih tidak valid (harus png, jpg, jpeg)"
    );
    return false;
  }
  if (file.size > maxSize) {
    newToast(toastId, "error", "File yang dipilih terlalu besar (Maks. 1MB)");
    return false;
  }
  return true;
};

// GET INPUT ERROR PESERTA
export const getInputErrorPeserta = (
  data: DataPesertaState | DocumentData,
  imageUrl: string | null,
  error: ErrorPeserta,
  setError: React.Dispatch<React.SetStateAction<ErrorPeserta>>
) => {
  setError({
    ...error,
    pasFoto: imageUrl ? null : "Tolong lengkapi Pas Foto",
    namaLengkap: data.namaLengkap == "" ? "Tolong lengkapi Nama Lengkap" : null,
    NIK:
      data.NIK.length != 0 && data.NIK.length != 16 ? "NIK tidak valid" : null,
    jenisKelamin:
      data.jenisKelamin == "" ? "Tolong lengkapi Jenis Kelamin" : null,
    alamatLengkap:
      data.alamatLengkap == "" ? "Tolong lengkapi Alamat Lengkap" : null,
    tempatLahir: data.tempatLahir == "" ? "Tolong lengkapi Tempat Lahir" : null,
    tanggalLahir:
      data.tanggalLahir == "" ? "Tolong lengkapi Tanggal Lahir" : null,
    tinggiBadan: data.tinggiBadan == "" ? "Tolong lengkapi Tinggi Badan" : null,
    beratBadan: data.beratBadan == "" ? "Tolong lengkapi Berat Badan" : null,
    idKontingen:
      data.idKontingen == "" ? "Tolong lengkapi Nama Kontingen" : null,
    tingkatanPertandingan:
      data.tingkatanPertandingan == ""
        ? "Tolong lengkapi Tingkatan Pertandingan"
        : null,
    jenisPertandingan:
      data.jenisPertandingan == ""
        ? "Tolong lengkapi Jenis Pertandingan"
        : null,
    kategoriPertandingan:
      data.kategoriPertandingan == ""
        ? "Tolong lengkapi kategori Pertandingan"
        : null,
  });
  if (
    imageUrl &&
    data.namaLengkap &&
    (data.NIK.length == 0 || data.NIK.length == 16) &&
    data.jenisKelamin &&
    data.alamatLengkap &&
    data.tempatLahir &&
    data.tanggalLahir &&
    data.tinggiBadan &&
    data.beratBadan &&
    data.idKontingen &&
    data.tingkatanPertandingan &&
    data.jenisPertandingan &&
    data.kategoriPertandingan
  ) {
    return true;
  } else {
    return false;
  }
};

// GET INPUT ERROR OFFICIAL
export const getInputErrorOfficial = (
  data: DataOfficialState | DocumentData,
  imageUrl: string | null,
  error: ErrorOfficial,
  setError: React.Dispatch<React.SetStateAction<ErrorOfficial>>
) => {
  setError({
    ...error,
    pasFoto: imageUrl ? null : "Tolong lengkapi Pas Foto",
    namaLengkap: data.namaLengkap == "" ? "Tolong lengkapi Nama Lengkap" : null,
    jenisKelamin:
      data.jenisKelamin == "" ? "Tolong lengkapi Jenis Kelamin" : null,
    idKontingen:
      data.idKontingen == "" ? "Tolong lengkapi Nama Kontingen" : null,
    jabatan: data.jabatan == "" ? "Tolong lengkapi Jabatan" : null,
  });
  if (
    imageUrl &&
    data.namaLengkap &&
    data.jenisKelamin &&
    data.idKontingen &&
    data.jabatan
  ) {
    return true;
  } else {
    return false;
  }
};

// UPDATE PERSON
export const updatePerson = async (
  tipe: "peserta" | "official",
  data: DataOfficialState | DataPesertaState | DocumentData,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  newToast(toastId, "loading", `Meniympan perubahan data ${data.namaLengkap}`);
  let dir;
  tipe == "peserta" ? (dir = "pesertas") : (dir = "officials");
  return updateDoc(doc(firestore, `${tipe}s`, data.id), {
    ...data,
    waktuPerubahan: Date.now(),
  })
    .then(() => {
      updateToast(
        toastId,
        "success",
        `Perubahan data ${data.namaLengkap} berhasil disimpan`
      );
      callback && callback();
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Perubahan data ${data.namaLengkap} gagal disimpan. ${error.messages}`
      );
    });
};

// PERSON UPDATER - IMAGE CHANGED
export const updatePersonImage = async (
  tipe: "peserta" | "official",
  data: DataOfficialState | DataPesertaState | DocumentData,
  toastId: React.MutableRefObject<Id | null>,
  imageSelected: File,
  callback?: () => void
) => {
  // DELETE OLD IMAGE
  newToast(toastId, "loading", "Menghapus Foto Lama");
  return deleteObject(ref(storage, data.fotoUrl))
    .then(() => {
      // UPLOAD NEW IMAGE
      updateToast(toastId, "loading", "Mengunggah Foto Baru");
      uploadBytes(ref(storage, data.fotoUrl), imageSelected)
        .then((snapshot) => {
          // UPLOAD PERSON
          getDownloadURL(snapshot.ref).then((downloadUrl) => {
            updateToast(
              toastId,
              "loading",
              `Meniympan perubahan data ${data.namaLengkap}`
            );
            updateDoc(doc(firestore, `${tipe}s`, data.id), {
              ...data,
              downloadFotoUrl: downloadUrl,
              waktuPerubahan: Date.now(),
            })
              .then(() => {
                // FINISH
                updateToast(
                  toastId,
                  "success",
                  `Perubahan data ${data.namaLengkap} berhasil disimpan`
                );
                callback && callback();
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `Perubahan data ${data.namaLengkap} gagal disimpan. ${error.messages}`
                );
              });
          });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `Gagal mengunngag foto baru. ${error.messages}`
          );
        });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Gagal Menghapus Foto Lama. ${error.messages}`
      );
    });
};

// PERSON UPDATER - KONTINGEN CHANGED
export const updatePersonKontingen = async (
  tipe: "peserta" | "official",
  data: DataOfficialState | DataPesertaState | DocumentData,
  prevData: DataOfficialState | DataPesertaState,
  kontingens: DataKontingenState[],
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  const namaPrevKontingen = findNamaKontingen(kontingens, prevData.idKontingen);
  const namaNewKontingen = findNamaKontingen(kontingens, data.idKontingen);
  // UPLOAD PERSON
  newToast(toastId, "loading", `Menyimpan perubahan data ${data.namaLengkap}`);
  return updateDoc(doc(firestore, `${tipe}s`, data.id), {
    ...data,
    waktuPerubaha: Date.now(),
  })
    .then(() => {
      // DELETE PERSON FROM OLD KONTINGEN
      updateToast(
        toastId,
        "loading",
        `Menghapus ${data.namaLengkap} dari Kontingen ${namaPrevKontingen}`
      );
      updateDoc(doc(firestore, "kontingens", prevData.idKontingen), {
        [`${tipe}s`]: arrayRemove(data.id),
      })
        .then(() => {
          // ADD PERSON TO NEW KONTINGEN
          updateToast(
            toastId,
            "loading",
            `Menambahkan ${data.namaLengkap} ke Kontingen ${namaNewKontingen}`
          );
          updateDoc(doc(firestore, "kontingens", data.idKontingen), {
            [`${tipe}s`]: arrayUnion(data.id),
          })
            .then(() => {
              // FINSIH
              updateToast(
                toastId,
                "success",
                `${data.namaLengkap} berhasil ditambahkan ke Kontingen ${namaNewKontingen}`
              );
              callback && callback();
            })
            .catch((error) => {
              updateToast(
                toastId,
                "error",
                `${data.namaLengkap} gagal ditambahkan ke Kontingen ${namaNewKontingen}. ${error.messages}`
              );
            });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `${data.namaLengkap} gagal dihapus dari Kontingen ${namaPrevKontingen}. ${error.messages}`
          );
        });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Perubahan data ${data.namaLengkap} gagal disimpan. ${error.messages}`
      );
    });
};

// PERSON UPDATER - IMAGE AND KONTINGEN CHANGED
export const updatePersonImageKontingen = async (
  tipe: "peserta" | "official",
  data: DataOfficialState | DataPesertaState | DocumentData,
  prevData: DataOfficialState | DataPesertaState,
  kontingens: DataKontingenState[],
  toastId: React.MutableRefObject<Id | null>,
  imageSelected: File,
  callback?: () => void
) => {
  const namaPrevKontingen = findNamaKontingen(kontingens, prevData.idKontingen);
  const namaNewKontingen = findNamaKontingen(kontingens, data.idKontingen);
  // DELETE OLD IMAGE
  newToast(toastId, "loading", "Menghapus Foto Lama");
  return deleteObject(ref(storage, data.fotoUrl))
    .then(() => {
      // UPLOAD NEW IMAGE
      updateToast(toastId, "loading", "Mengunggah Foto Baru");
      uploadBytes(ref(storage, data.fotoUrl), imageSelected)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadUrl) => {
            // UPLOAD PERSON
            updateToast(
              toastId,
              "loading",
              `Meniympan perubahan data ${data.namaLengkap}`
            );
            updateDoc(doc(firestore, `${tipe}s`, data.id), {
              ...data,
              downloadFotoUrl: downloadUrl,
              waktuPerubahan: Date.now(),
            })
              .then(() => {
                // DELETE PERSON FROM OLD KONTINGEN
                updateToast(
                  toastId,
                  "loading",
                  `Menghapus ${data.namaLengkap} dari Kontingen ${namaPrevKontingen}`
                );
                updateDoc(doc(firestore, "kontingens", prevData.idKontingen), {
                  [`${tipe}s`]: arrayRemove(data.id),
                })
                  .then(() => {
                    // ADD PERSON TO NEW KONTINGEN
                    updateToast(
                      toastId,
                      "loading",
                      `Menambahkan ${data.namaLengkap} ke Kontingen ${namaNewKontingen}`
                    );
                    updateDoc(doc(firestore, "kontingens", data.idKontingen), {
                      [`${tipe}s`]: arrayUnion(data.id),
                    })
                      .then(() => {
                        // FINISH
                        updateToast(
                          toastId,
                          "success",
                          `${data.namaLengkap} berhasil dipindahkan ke Kontingen ${namaNewKontingen}`
                        );
                        callback && callback();
                      })
                      .catch((error) => {
                        updateToast(
                          toastId,
                          "error",
                          `Gagal memindahkan ${data.namaLengkap} ke kontingen baru. ${error.messages}`
                        );
                      });
                  })
                  .catch((error) => {
                    updateToast(
                      toastId,
                      "error",
                      `Gagal memindahkan ${data.namaLengkap} ke kontingen baru. ${error.messages}`
                    );
                  });
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `Perubahan data ${data.namaLengkap} gagal disimpann. ${error.messages}`
                );
              });
          });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `Gagal mengunnga foto baru. ${error.messages}`
          );
        });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Gagal Menghapus Foto Lama. ${error.messages}`
      );
    });
};

// PERSON DELETER
export const deletePerson = async (
  query: "officials" | "pesertas",
  data: DataPesertaState | DataOfficialState | DocumentData,
  kontingens: DataKontingenState[],
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  const namaKontingen = findNamaKontingen(kontingens, data.idKontingen);
  // DELETE IMAGE
  newToast(toastId, "loading", `Menghapus foto ${data.namaLengkap}`);
  return deleteObject(ref(storage, data.fotoUrl))
    .then(() => {
      // DELETE PERSON FROM KONTINGEN
      updateToast(
        toastId,
        "loading",
        `Menghapus ${data.namaLengkap} dari Kontingen ${namaKontingen}`
      );
      updateDoc(doc(firestore, "kontingens", data.idKontingen), {
        [`${query}`]: arrayRemove(data.id),
      })
        .then(() => {
          // DELETE DATA
          updateToast(
            toastId,
            "loading",
            `Menghapus Data ${data.namaLengkap} `
          );
          deleteDoc(doc(firestore, query, data.id))
            .then(() => {
              updateToast(
                toastId,
                "success",
                `Data ${data.namaLengkap} berhasil dihapus`
              );
              callback && callback();
            })
            .catch((error) => {
              updateToast(
                toastId,
                "error",
                `Data ${data.namaLengkap} gagal dihapus. ${error.messages}`
              );
            });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `${data.namaLengkap} gagal dihapus dari kontingen ${namaKontingen}. ${error.messages}`
          );
        });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `gagal Menghapus foto ${data.namaLengkap}. ${error.messages}`
      );
    });
};

// SEND PERSON
export const sendPerson = async (
  tipe: "peserta" | "official",
  data: DataPesertaState | DataOfficialState | DocumentData,
  imageSelected: File,
  kontingens: DataKontingenState[],
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  const namaKontingen = findNamaKontingen(kontingens, data.idKontingen);
  newToast(toastId, "loading", `Mengunggah foto ${data.namaLengkap}`);
  // UPLOAD IMAGE
  const newDocRef = doc(collection(firestore, `${tipe}s`));
  const url = `${tipe}s/${newDocRef.id}-image`;
  return uploadBytes(ref(storage, url), imageSelected)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        // UPLOAD PERSON
        updateToast(
          toastId,
          "loading",
          `Mendaftarkan ${data.namaLengkap} sebagai ${tipe}`
        );
        setDoc(newDocRef, {
          ...data,
          id: newDocRef.id,
          waktuPendaftaran: Date.now(),
          downloadFotoUrl: downloadUrl,
          fotoUrl: url,
        })
          .then(() => {
            // ADD PERSON TO KONTINGEN
            updateToast(
              toastId,
              "loading",
              `Mendaftarkan ${data.namaLengkap} sebagai ${tipe} kontingen ${namaKontingen}`
            );
            updateDoc(doc(firestore, "kontingens", data.idKontingen), {
              [`${tipe}s`]: arrayUnion(newDocRef.id),
            })
              .then(() => {
                // FINISH
                updateToast(
                  toastId,
                  "success",
                  `${data.namaLengkap} berhasil didaftarkan sebagai ${tipe} kontingen ${namaKontingen}`
                );
                callback && callback();
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `${data.namaLengkap} gagal didaftarkan sebagai ${tipe} kontingen ${namaKontingen}. ${error.messages}`
                );
              });
          })
          .catch((error) => {
            updateToast(
              toastId,
              "error",
              `${data.namaLengkap} gagal didaftarkan sebagai ${tipe}. ${error.messages}`
            );
            return error;
          });
      });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Foto ${data.namaLengkap} gagal diunggah. ${error.messages}`
      );
    });
};
