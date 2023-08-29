import { Id, toast } from "react-toastify";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
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
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 } from "uuid";

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
  return dataKontingen[index].namaKontingen;
};

// IMAGE LIMITER
export const limitImage = (file: File) => {
  const maxSize = 1 * 1024 * 1024; //1MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    alert(
      "Format file yang ada masukan tidak valid, yang diperbolehkan hanya .jpg, .jpeg, dan .png"
    );
    return false;
  }
  if (file.size > maxSize) {
    alert("File yang ada masukan terlalu besar, Makismal 1MB");
    return false;
  }
  return true;
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
        `Perubahan data ${data.namaLengkap} gagal disimpan`
      );
      alert(error);
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
      const url = `${tipe}s/${v4()}.${imageSelected.type.split("/")[1]}`;
      uploadBytes(ref(storage, url), imageSelected)
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
              fotoUrl: url,
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
                  `Perubahan data ${data.namaLengkap} gagal disimpann`
                );
                alert(error);
              });
          });
        })
        .catch((error) => {
          updateToast(toastId, "error", `Gagal mengunnga foto baru`);
          alert(error);
        });
    })
    .catch((error) => {
      updateToast(toastId, "error", `Gagal Menghapus Foto Lama`);
      alert(error);
    });
};

// PERSON UPDATER - KONTINGEN CHANGED
export const updatePersonKontingen = async (
  tipe: "peserta" | "official",
  data: DataOfficialState | DataPesertaState | DocumentData,
  prevData: DataOfficialState | DataPesertaState,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
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
        `Menghapus ${data.namaLengkap} dari Kontingen ${prevData.namaKontingen}`
      );
      updateDoc(doc(firestore, "kontingens", prevData.idKontingen), {
        [`${tipe}s`]: arrayRemove(data.id),
      })
        .then(() => {
          // ADD PERSON TO NEW KONTINGEN
          updateToast(
            toastId,
            "loading",
            `Menambahkan ${data.namaLengkap} ke Kontingen ${data.namaKontingen}`
          );
          updateDoc(doc(firestore, "kontingens", data.idKontingen), {
            [`${tipe}s`]: arrayUnion(data.id),
          })
            .then(() => {
              // FINSIH
              updateToast(
                toastId,
                "success",
                `${data.namaLengkap} berhasil ditambahkan ke Kontingen ${data.namaKontingen}`
              );
              callback && callback();
            })
            .catch((error) => {
              updateToast(
                toastId,
                "error",
                `${data.namaLengkap} gagal ditambahkan ke Kontingen ${data.namaKontingen}`
              );
              alert(error);
            });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `${data.namaLengkap} gagal dihapus dari Kontingen ${prevData.namaKontingen}`
          );
          alert(error);
        });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Perubahan data ${data.namaLengkap} gagal disimpann`
      );
      alert(error);
    });
};

// PERSON UPDATER - IMAGE AND KONTINGEN CHANGED
export const updatePersonImageKontingen = async (
  tipe: "peserta" | "official",
  data: DataOfficialState | DataPesertaState | DocumentData,
  prevData: DataOfficialState | DataPesertaState,
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
      const url = `${tipe}s/${v4()}.${imageSelected.type.split("/")[1]}`;
      uploadBytes(ref(storage, url), imageSelected)
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
              fotoUrl: url,
              waktuPerubahan: Date.now(),
            })
              .then(() => {
                // DELETE PERSON FROM OLD KONTINGEN
                updateToast(
                  toastId,
                  "loading",
                  `Menghapus ${data.namaLengkap} dari Kontingen ${prevData.namaKontingen}`
                );
                updateDoc(doc(firestore, "kontingens", prevData.idKontingen), {
                  [`${tipe}s`]: arrayRemove(data.id),
                })
                  .then(() => {
                    // ADD PERSON TO NEW KONTINGEN
                    updateToast(
                      toastId,
                      "loading",
                      `Menambahkan ${data.namaLengkap} ke Kontingen ${data.namaKontingen}`
                    );
                    updateDoc(doc(firestore, "kontingens", data.idKontingen), {
                      [`${tipe}s`]: arrayUnion(data.id),
                    })
                      .then(() => {
                        // FINISH
                        updateToast(
                          toastId,
                          "success",
                          `${data.namaLengkap} berhasil dipindahkan ke Kontingen ${data.namaKontingen}`
                        );
                        callback && callback();
                      })
                      .catch((error) => {
                        updateToast(
                          toastId,
                          "error",
                          `Gagal memindahkan ${data.namaLengkap} ke kontingen baru`
                        );
                        alert(error);
                      });
                  })
                  .catch((error) => {
                    updateToast(
                      toastId,
                      "error",
                      `Gagal memindahkan ${data.namaLengkap} ke kontingen baru`
                    );
                    alert(error);
                  });
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `Perubahan data ${data.namaLengkap} gagal disimpann`
                );
                alert(error);
              });
          });
        })
        .catch((error) => {
          updateToast(toastId, "error", `Gagal mengunnga foto baru`);
          alert(error);
        });
    })
    .catch((error) => {
      updateToast(toastId, "error", `Gagal Menghapus Foto Lama`);
      alert(error);
    });
};

// PERSON DELETER
export const deletePerson = async (
  query: "officials" | "pesertas",
  data: DataPesertaState | DataOfficialState | DocumentData,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  // DELETE IMAGE
  newToast(toastId, "loading", `Menghapus foto ${data.namaLengkap}`);
  return deleteObject(ref(storage, data.fotoUrl))
    .then(() => {
      // DELETE PERSON FROM KONTINGEN
      updateToast(
        toastId,
        "loading",
        `Menghapus ${data.namaLengkap} dari Kontingen ${data.namaKontingen}`
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
                `Data ${data.namaLengkap} gagal dihapus`
              );
              alert(error);
            });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `${data.namaLengkap} gagal dihapus dari kontingen ${data.namaKontingen}`
          );
          alert(error);
        });
    })
    .catch((error) => {
      updateToast(toastId, "error", `gagal Menghapus foto ${data.namaLengkap}`);
      console.log(error);
    });
};

// SEND PERSON
export const sendPerson = async (
  tipe: "peserta" | "official",
  data: DataPesertaState | DataOfficialState | DocumentData,
  imageSelected: File,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  newToast(toastId, "loading", `Mengunggah foto ${data.namaLengkap}`);
  const url = `${tipe}s/${v4()}.${imageSelected.type.split("/")[1]}`;
  // UPLOAD IMAGE
  return uploadBytes(ref(storage, url), imageSelected)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        // UPLOAD PERSON
        updateToast(
          toastId,
          "loading",
          `Mendaftarkan ${data.namaLengkap} sebagai ${tipe}`
        );
        const newDocRef = doc(collection(firestore, `${tipe}s`));
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
              `Mendaftarkan ${data.namaLengkap} sebagai ${tipe} kontingen ${data.namaKontingen}`
            );
            updateDoc(doc(firestore, "kontingens", data.idKontingen), {
              [`${tipe}s`]: arrayUnion(newDocRef.id),
            })
              .then(() => {
                // FINISH
                updateToast(
                  toastId,
                  "success",
                  `${data.namaLengkap} berhasil didaftarkan sebagai ${tipe} kontingen ${data.namaKontingen}`
                );
                callback && callback();
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `${data.namaLengkap} gagal didaftarkan sebagai ${tipe} kontingen ${data.namaKontingen}`
                );
                alert(error);
              });
          })
          .catch((error) => {
            updateToast(
              toastId,
              "error",
              `${data.namaLengkap} gagal didaftarkan sebagai ${tipe}`
            );
            return error;
          });
      });
    })
    .catch((error) => {
      updateToast(toastId, "error", `Foto ${data.namaLengkap} gagal diunggah`);
      return error;
    });
};
