import { Id, toast } from "react-toastify";

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
