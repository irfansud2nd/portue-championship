import { useEffect, useState } from "react";
import InlineLoading from "../InlineLoading";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase";

const TabelPayment = () => {
  const [pesertaUnconfimed, setPesertaUnconfimed] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [pesertaConfirmed, setPesertaConfirmed] = useState<
    JSX.Element | number
  >(<InlineLoading />);
  const [pesertaPaid, setPesertaPaid] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const [pesertaUnpaid, setPesertaUnpaid] = useState<JSX.Element | number>(
    <InlineLoading />
  );
  const getPesertaConfirmed = () => {
    setPesertaConfirmed(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("confirmedPembayaran", "==", true)
      )
    ).then((snapshot) => setPesertaConfirmed(snapshot.data().count));
  };

  const getPesertaUnconfirmed = () => {
    setPesertaUnconfimed(<InlineLoading />);
    getCountFromServer(
      query(
        collection(firestore, "pesertas"),
        where("confirmedPembayaran", "==", false),
        where("pembayaran", "==", true)
      )
    ).then((snapshot) => setPesertaUnconfimed(snapshot.data().count));
  };

  const getPesertaPaid = () => {
    setPesertaPaid(<InlineLoading />);
    getCountFromServer(
      query(collection(firestore, "pesertas"), where("pembayaran", "==", true))
    ).then((snapshot) => setPesertaPaid(snapshot.data().count));
  };

  const getPesertaUnpaid = () => {
    setPesertaUnpaid(<InlineLoading />);
    getCountFromServer(
      query(collection(firestore, "pesertas"), where("pembayaran", "==", false))
    ).then((snapshot) => setPesertaUnpaid(snapshot.data().count));
  };

  useEffect(() => {
    getAllPayment();
  }, []);

  const getAllPayment = () => {
    getPesertaUnconfirmed();
    getPesertaConfirmed();
    getPesertaPaid();
    getPesertaUnpaid();
  };
  return (
    <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit mt-2">
      <p className="font-semibold text-lg">Pembayaran</p>
      <div className="grid grid-cols-[repeat(3,_auto)] grid-rows-[repeat(5,_auto)] w-fit">
        <p className="font-semibold text-lg border-r-2 border-r-white">
          Keterangan
        </p>
        <p className="font-semibold text-lg border-r-2 border-r-white px-2">
          Peserta
        </p>
        <p className="font-semibold text-lg px-2">Kontingen</p>
        <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
          Confirmed
        </p>
        <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
          {pesertaConfirmed}
        </p>
        <p className="text-2xl font-extrabold text-green-500">
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().confirmed
          )}
        </p>
        <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white px-2">
          Unconfirmed
        </p>
        <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
          {pesertaUnconfimed}
        </p>
        <button
          className="text-2xl font-extrabold text-yellow-500 hover:underline"
          onClick={getUnconfirmedKontingens}
        >
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().unconfirmed
          )}
        </button>
        <p className="text-2xl font-extrabold text-blue-500  border-r-2 border-r-white">
          Paid
        </p>
        <p className="text-2xl font-extrabold text-blue-500  border-r-2 border-r-white">
          {pesertaPaid}
        </p>
        <p className="text-2xl font-extrabold text-blue-500">
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().unconfirmed +
            getKontingensPayment().confirmed
          )}
        </p>
        <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
          Unpaid
        </p>
        <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
          {pesertaUnpaid}
        </p>
        <p className="text-2xl font-extrabold text-red-500">
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().unpaid
          )}
        </p>
      </div>
    </div>
  );
};
export default TabelPayment;
