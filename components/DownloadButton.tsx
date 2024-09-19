"use client";
import { getProposalLink } from "@/utils/actions";
import FileSaver from "file-saver";
import { useRef, useState, useEffect } from "react";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
const DownloadButton = () => {
  const [downloadLink, setDownloadLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getLink();
  }, []);

  const getLink = async () => {
    try {
      const { result, error } = await getProposalLink();
      if (error) throw error;

      setDownloadLink(result);
    } catch (error) {
      setErrorMessage("Download proposal tidak tersedia");
    }
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
