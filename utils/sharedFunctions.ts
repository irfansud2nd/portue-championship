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
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 } from "uuid";
import { User } from "firebase/auth";
import { data } from "autoprefixer";

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
  type: "loading" | "error",
  ref: React.MutableRefObject<Id | null>,
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

// TYPE CHECKER
export function checkType<T>(variable: unknown): variable is T {
  return (
    typeof variable === "object" &&
    variable !== null &&
    Object.keys(variable).length > 0
  );
}

// DATA UPLOADER
export const uploadData = async (
  query: "pesertas" | "officials" | "kontingens",
  data: DataOfficialState | DataPesertaState | DocumentData,

  toastId: React.MutableRefObject<Id | null>,
  makeNewToast: boolean = true,
  succesToast: boolean = true,
  errorToast: boolean = true
) => {
  const messages = [
    {
      tipe: "pesertas",
      new: `Mendaftarkan ${data.namaLengkap} sebagai peserta`,
      success: `${data.namaLengkap} berhasil didaftarkan sebagai peserta`,
      error: `${data.namaLengkap} gagal didaftarkan sebagai peserta`,
    },
    {
      tipe: "officials",
      new: `Mendaftarkan ${data.namaLengkap} sebagai official`,
      success: `${data.namaLengkap} berhasil didaftarkan sebagai official`,
      error: `${data.namaLengkap} gagal didaftarkan sebagai official`,
    },
    {
      tipe: "kontingens",
      new: `Mendaftarkan Kontingen ${data.namaKontingen}`,
      success: `Kontingen ${data.namaKontingen} berhasil didaftarkan`,
      error: `Kontingen ${data.namaKontingen} gagal didaftarkan`,
    },
  ];

  makeNewToast
    ? newToast(
        "loading",
        toastId,
        messages[messages.findIndex((message) => message.tipe == query)].new
      )
    : updateToast(
        toastId,
        "loading",
        messages[messages.findIndex((message) => message.tipe == query)].new
      );
  const newDocRef = doc(collection(firestore, query));
  return setDoc(newDocRef, {
    ...data,
    idOfficial: newDocRef.id,
    waktuPendaftaran: Date.now(),
  })
    .then(() => {
      succesToast &&
        updateToast(
          toastId,
          "success",
          messages[messages.findIndex((message) => message.tipe == query)]
            .success
        );
    })
    .catch((error) => {
      succesToast &&
        updateToast(
          toastId,
          "error",
          messages[messages.findIndex((message) => message.tipe == query)].error
        );
      return error;
    });
};

// IMAGE UPLOADER
export const uploadImage = async (
  query: "pesertas" | "officials",
  imageSelected: File | null | undefined,
  data: DataOfficialState | DataPesertaState | DocumentData,
  setData: React.Dispatch<
    React.SetStateAction<DataOfficialState | DataOfficialState | DocumentData>
  >,
  toastId: React.MutableRefObject<Id | null>,
  makeNewToast: boolean = true,
  succesToast: boolean = true,
  errorToast: boolean = true
) => {
  if (!imageSelected) {
    alert("No image selected");
    return;
  }
  makeNewToast
    ? newToast("loading", toastId, `Mengunggah foto ${data.namaLengkap}`)
    : updateToast(toastId, "loading", `Mengunggah foto ${data.namaLengkap}`);
  const url = `${query}/${v4()}.${imageSelected.type.split("/")[1]}`;
  return uploadBytes(ref(storage, url), imageSelected)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        setData({ ...data, downloadFotoUrl: downloadUrl, fotoUrl: url });
      });
      succesToast &&
        updateToast(
          toastId,
          "success",
          `Foto ${data.namaLengkap} berhasil diunggah`
        );
    })
    .catch((error) => {
      errorToast &&
        updateToast(
          toastId,
          "success",
          `Foto ${data.namaLengkap} gagal diunggah`
        );
      return error;
    });
};

// IMAGE DELETER
export const deleteImage = async (
  data: DataOfficialState[] | DataPesertaState[],
  id: string,
  toastId: React.MutableRefObject<Id | null>,
  makeNewToast: boolean = true,
  succesToast: boolean = true,
  errorToast: boolean = true
) => {
  if (!data.length) return;
  let selectedData: DataOfficialState | DataPesertaState;
  if (checkType<DataOfficialState[]>(data)) {
    selectedData = data[data.findIndex((item) => item.idOfficial == id)];
  } else {
    selectedData = data[data.findIndex((item) => item.idPeserta == id)];
  }
  if (selectedData) {
    makeNewToast &&
      newToast(
        "loading",
        toastId,
        `Menghapus foto ${selectedData.namaLengkap}`
      );
    return deleteObject(ref(storage, selectedData.fotoUrl))
      .then(() => {
        succesToast &&
          updateToast(
            toastId,
            "success",
            `Foto ${selectedData.namaLengkap} berhasil dihapus`
          );
      })
      .catch((error) => {
        errorToast &&
          updateToast(
            toastId,
            "error",
            `Foto ${selectedData.namaLengkap} gagal dihapus`
          );
        return error;
      });
  }
};

// GET SELECTED KONTINGEN AND SELECTED PERSONS
const getKontingenAndPersons = (
  kontingens: DataKontingenState[],
  idKontingen: string,
  tipe: "peserta" | "official",
  idPerson: string
) => {
  const selectedKontingen = {
    ...kontingens[
      kontingens.findIndex((kontingen) => kontingen.idKontingen == idKontingen)
    ],
  };
  let selectedPersons;
  tipe == "peserta"
    ? (selectedPersons = [...selectedKontingen.pesertas])
    : (selectedPersons = [...selectedKontingen.officials]);
  const selectedPerson = selectedPersons.indexOf(idPerson);
  return { selectedPersons, selectedPerson, selectedKontingen };
};

// PERSON MOVER
export const movePerson = async (
  actions: "delete" | "add",
  kontingens: DataKontingenState[],
  idKontingen: string,
  tipe: "peserta" | "official",
  idPerson: string,
  personName: string,
  toastId: React.MutableRefObject<Id | null>,
  makeNewToast: boolean = true,
  succesToast: boolean = true,
  errorToast: boolean = true
) => {
  const { selectedKontingen, selectedPersons, selectedPerson } =
    getKontingenAndPersons(kontingens, idKontingen, tipe, idPerson);

  const messages = [
    {
      tipe: "delete",
      new: `Menghapus ${personName} dari Kontingen ${selectedKontingen.namaKontingen}`,
      success: `${personName} berhasil dihapus dari Kontingen ${selectedKontingen.namaKontingen}`,
      error: `${personName} gagal dihapus dari Kontingen ${selectedKontingen.namaKontingen}`,
    },
    {
      tipe: "add",
      new: `Menambahkan ${personName} ke Kontingen ${selectedKontingen.namaKontingen}`,
      success: `${personName} berhasil ditambahkan ke Kontingen ${selectedKontingen.namaKontingen}`,
      error: `${personName} gagal ditambahkan ke Kontingen ${selectedKontingen.namaKontingen}`,
    },
  ];

  makeNewToast
    ? newToast(
        "loading",
        toastId,
        messages[messages.findIndex((message) => message.tipe == actions)].new
      )
    : updateToast(
        toastId,
        "loading",
        messages[messages.findIndex((message) => message.tipe == actions)].new
      );

  actions == "delete"
    ? selectedPersons.splice(selectedPerson, 1)
    : selectedPersons.push(idPerson);

  let updatedData;
  tipe == "peserta"
    ? (updatedData = { pesertas: selectedPersons })
    : (updatedData = { officials: selectedPersons });

  return updateDoc(doc(firestore, "kontingens", idKontingen), updatedData)
    .then(() => {
      succesToast &&
        updateToast(
          toastId,
          "success",
          messages[messages.findIndex((message) => message.tipe == actions)]
            .success
        );
    })
    .catch((error) => {
      errorToast &&
        updateToast(
          toastId,
          "error",
          messages[messages.findIndex((message) => message.tipe == actions)]
            .error
        );
      return error;
    });
};

// DATA UPDATER
export const updateData = async (
  query: "kontingens" | "officials" | "pesertas",
  data:
    | DataKontingenState
    | DataOfficialState
    | DataPesertaState
    | DocumentData,
  id: string,
  toastId: React.MutableRefObject<Id | null>,
  makeNewToast: boolean = true,
  succesToast: boolean = true,
  errorToast: boolean = true
) => {
  let nama: string;
  if ("namaLengkap" in data) {
    nama = data.namaLengkap;
  } else {
    nama = data.namaKontingen;
  }

  makeNewToast
    ? newToast("loading", toastId, `Menyimpan perubahan data ${nama}`)
    : updateToast(toastId, "loading", `Menyimpan perubahan data ${nama}`);
  return setDoc(doc(firestore, query, id), {
    ...data,
    waktuPerubahan: Date.now(),
  })
    .then(() => {
      succesToast &&
        updateToast(
          toastId,
          "success",
          `Perubahan data ${nama} berhasil disimpan`
        );
    })
    .catch((error) => {
      errorToast &&
        updateToast(toastId, "error", `Perubahan data ${nama} gagal disimpan`);
      return error;
    });
};

// PERSON DELETER
export const deletePerson = async (
  query: "officials" | "pesertas",
  id: string,
  nama: string,
  toastId: React.MutableRefObject<Id | null>,
  makeNewToast: boolean = true,
  succesToast: boolean = true,
  errorToast: boolean = true
) => {
  makeNewToast
    ? newToast("loading", toastId, `Menghapus data ${nama}`)
    : updateToast(toastId, "loading", `Menghapus data ${nama}`);

  return deleteDoc(doc(firestore, query, id))
    .then(() => {
      succesToast &&
        updateToast(toastId, "success", `Data ${nama} berhasil dihapus`);
    })
    .catch((error) => {
      errorToast && updateToast(toastId, "error", `Data ${nama} gagal dihapus`);
      return error;
    });
};

// SET USER AND KONTINGENS
export const setUserKontingens = (
  user: User,
  kontingens: DataKontingenState[],
  data: DataOfficialState | DataPesertaState | DocumentData,
  setData: React.Dispatch<
    React.SetStateAction<DataOfficialState | DataOfficialState | DocumentData>
  >
) => {
  if (user && kontingens.length == 0) {
    console.log("setting user");
    setData({ ...data, creatorEmail: user.email, creatorUid: user.uid });
  }
  if (user && kontingens.length !== 0) {
    console.log("setting user and kontingen");
    setData({
      ...data,
      creatorEmail: user.email,
      creatorUid: user.uid,
      namaKontingen: kontingens[0].namaKontingen,
      idKontingen: kontingens[0].idKontingen,
    });
  }
};

// DATA GETTER
export const getData = async (
  tipeData: "pesertas" | "officials" | "kontingens",
  id: string,
  setData: React.Dispatch<
    React.SetStateAction<
      | DataOfficialState[]
      | DataOfficialState[]
      | DataKontingenState[]
      | DocumentData
    >
  >
) => {
  return getDoc(doc(firestore, tipeData, id))
    .then((docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
        return docSnap.data();
      }
    })
    .catch((error) => error);
};

// DATAS GETTER
export const getDatas = async (
  tipeData: "pesertas" | "officials" | "kontingens",
  user: User
) => {
  console.log("getting officials");
  const container: any[] = [];
  const q = query(
    collection(firestore, tipeData),
    where("creatorUid", "==", user.uid)
  );
  return getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        container.push(doc.data());
      });
      return container.sort(compare("waktuPendaftaran", "asc"));
    })
    .catch((error) => error);
};

// IMAGE LIMITER
export const limitImage = (
  file: File,
  inputReseter: () => void,
  setImageSelected: React.Dispatch<
    React.SetStateAction<File | null | undefined>
  >,
  setImagePreviewSrc: React.Dispatch<React.SetStateAction<string>>
) => {
  const maxSize = 1 * 1024 * 1024; //1MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    inputReseter();
    alert(
      "Format file yang ada masukan tidak valid, yang diperbolehkan hanya .jpg, .jpeg, dan .png"
    );
    return;
  }
  if (file.size > maxSize) {
    inputReseter();
    alert("File yang ada masukan terlalu besar, Makismal 1MB");
    return;
  }
  setImageSelected(file);
  setImagePreviewSrc(URL.createObjectURL(file));
};
