import { toast } from "react-toastify";
import { KontingenState } from "./types";
import { ServerAction, ToastId } from "./constants";
import { FirebaseError } from "firebase/app";
import { getNewDocId, uploadFile } from "./actions";

export const fetchData = async <T>(
  asyncFunction: () => Promise<ServerAction<T>>
): Promise<T> => {
  try {
    const { result, error } = await asyncFunction();

    if (error) throw error;

    return result;
  } catch (error) {
    throw error;
  }
};

export const action = {
  success: <T>(result: T): ServerAction<T> => {
    return { result, error: null };
  },
  error: <T>(error: any): ServerAction<T> => {
    return { result: null, error: error as FirebaseError };
  },
};

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

// FORMAT TANGGAL
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

export const controlToast = (
  ref: ToastId | undefined,
  type: "success" | "error" | "loading",
  message: string,
  isNew: boolean = false
) => {
  if (!ref) return;
  if (isNew) {
    if (type == "loading") {
      ref.current = toast.loading(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      ref.current = toast[type](message, {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
        theme: "colored",
      });
    }
  } else {
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
  }
};

export const toastError = (
  toastId: ToastId | undefined,
  error: any,
  isNew: boolean = false
) => {
  if (!toastId) return;
  let message = (error as FirebaseError)?.message;
  if (typeof error == "string") message = error;
  controlToast(toastId, "error", message, isNew);
};

export const isFileValid = (file: File): string | undefined => {
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
    return "Format file tidak valid (harus png, jpg, jpeg)";

  if (file.size > 1024 * 1024)
    return "File yang dipilih terlalu besar (Maks. 1MB)";
};

// VALIDATE IMAGE
export const validateImage = (file: File, toastId: ToastId) => {
  if (file) {
    const warning = isFileValid(file);
    if (warning) {
      controlToast(toastId, "error", warning, true);
      return false;
    }
    return true;
  }
};

export const sendFile = async (file: File, directory: string) => {
  const warning = isFileValid(file);
  if (warning) throw new Error(warning);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);

  try {
    const { result: downloadUrl, error } = await uploadFile(formData);

    if (error) throw error;

    return downloadUrl;
  } catch (error) {
    throw error;
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

export const getFileUrl = (
  type: "peserta" | "official" | "pembayaran",
  docId: string
) => {
  let folder = type + "s";
  let url = `${folder}/${docId}-`;

  let result = {
    fotoUrl: url + "image",
    kkUrl: url + "kk",
    ktpUrl: url + "ktp",
  };

  if (type == "pembayaran") result.fotoUrl = `buktiPembayarans/${docId}`;

  return result;
};

export const reduceData = <T extends Record<string, any>>(
  data: T[],
  key: string = "id"
): T[] => {
  const reducedData = Object.values(
    data.reduce((acc, obj) => {
      const keyValue = obj[key];
      if (keyValue !== undefined) {
        acc[keyValue] = obj;
      }
      return acc;
    }, {} as Record<string, T>)
  );
  return reducedData;
};
