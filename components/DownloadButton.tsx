"use client";
import { storage } from "@/utils/firebase";
import { newToast } from "@/utils/sharedFunctions";
import FileSaver from "file-saver";
import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DownloadButton = () => {
  const [downloadLink, setDownloadLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toastId = useRef(null);
  useEffect(() => {
    getLink();
  }, []);
  const getLink = () => {
    getDownloadURL(
      ref(storage, "admin/PROPOSAL PORTUE SILAT BANDUNG CHAMPIONSHIP 2023.pdf")
    )
      .then((url) => {
        setDownloadLink(url);
      })
      .catch((error) => {
        setErrorMessage("Download Proposal tidak tersedia");
      });
  };
  return (
    <button
      className="w-full rounded-full text-lg font-semibold btn_navy_gold"
      onClick={() => FileSaver.saveAs(downloadLink)}
      disabled={!downloadLink}
    >
      {errorMessage ? (
        errorMessage
      ) : downloadLink ? (
        <>
          <BsFillCloudDownloadFill className="inline mr-2 mb-0.5" /> Download
          Proposal
        </>
      ) : (
        "Memuat proposal..."
      )}
    </button>
  );
};
export default DownloadButton;
