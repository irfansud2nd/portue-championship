"use client";
import { KontingenState, OfficialState, PesertaState } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import FormKontingen from "./forms/FormKontingen";
import FormOfficial from "./forms/FormOfficial";
import FormPeserta from "./forms/FormPeserta";
import FormPembayaran from "./forms/FormPembayaran";
import { compare, fetchData, reduceData, toastError } from "@/utils/functions";
import { MyContext } from "@/context/Context";
import { FiMenu } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import KategoriPendaftaran from "./KategoriPendaftaran";
import Link from "next/link";
import { AiOutlineRollback } from "react-icons/ai";
import { getKontingenByEmail } from "@/utils/kontingen/kontingenActions";
import { getPesertasByEmail } from "@/utils/peserta/pesertaActions";
import { getOfficialsByEmail } from "@/utils/official/officialActions";

type Props = {
  kategoriPendaftaran: string;
  setKategoriPendaftaran: React.Dispatch<React.SetStateAction<string>>;
};

const FormPendaftaran = ({
  kategoriPendaftaran,
  setKategoriPendaftaran,
}: Props) => {
  const [kontingen, setKontingen] = useState<KontingenState | undefined>();
  const [officials, setOfficials] = useState<OfficialState[] | []>([]);
  const [pesertas, setPesertas] = useState<PesertaState[] | []>([]);
  const [showNav, setShowNav] = useState(false);

  const { user } = MyContext();

  const toastId = useRef(null);

  useEffect(() => {
    const getData = async () => {
      console.log("GET ALL DATA");
      try {
        const kontingen = await fetchData(() =>
          getKontingenByEmail(user.email)
        );
        setKontingen(kontingen);

        const pesertas = await fetchData(() => getPesertasByEmail(user.email));
        setPesertas(pesertas);

        const officials = await fetchData(() =>
          getOfficialsByEmail(user.email)
        );
        setOfficials(officials);
      } catch (error) {
        toastError(toastId, error);
        throw error;
      }
    };

    if (user.email) getData();
  }, [user]);

  const addOfficials = (newOfficials: OfficialState[]) => {
    const newData = reduceData([...officials, ...newOfficials]).sort(
      compare("waktuPendaftaran", "asc")
    );
    setOfficials(newData);
  };

  const deleteOfficial = (id: string) => {
    const newData = officials.filter((item) => item.id != id);
    setOfficials(newData);
  };

  const addPesertas = (newPesertas: PesertaState[]) => {
    const newData = reduceData([...pesertas, ...newPesertas]).sort(
      compare("waktuPendaftaran", "asc")
    );
    setPesertas(newData);
  };

  const deletePeserta = (id: string) => {
    const newData = pesertas.filter((item) => item.id != id);
    setPesertas(newData);
  };

  const forms = [
    {
      name: "kontingen",
      component: (
        <FormKontingen
          kontingen={kontingen}
          setKontingen={setKontingen}
          pesertas={pesertas}
          setPesertas={setPesertas}
          officials={officials}
          setOfficials={setOfficials}
        />
      ),
    },
    {
      name: "official",
      component: (
        <FormOfficial
          kontingen={kontingen}
          setKontingen={setKontingen}
          officials={officials}
          addOfficials={addOfficials}
          deleteOfficial={deleteOfficial}
        />
      ),
    },
    {
      name: "peserta",
      component: (
        <FormPeserta
          kontingen={kontingen}
          setKontingen={setKontingen}
          pesertas={pesertas}
          addPesertas={addPesertas}
          deletePeserta={deletePeserta}
        />
      ),
    },
    {
      name: "pembayaran",
      component: (
        <FormPembayaran
          kontingen={kontingen}
          setKontingen={setKontingen}
          officials={officials}
          pesertas={pesertas}
          addPesertas={addPesertas}
        />
      ),
    },
  ];

  return (
    <div className="bg-gray-100 rounded-md min-h-full w-full p-2">
      <div className="flex justify-between items-start relative">
        <h1 className="capitalize text-2xl sm:text-3xl font-bold">
          Form Pendaftaran {kategoriPendaftaran}
        </h1>
        <button
          className="lg:hidden"
          onClick={() => setShowNav((prev) => !prev)}
        >
          {showNav ? (
            <GrClose className="text-3xl hover:text-custom-gold transition" />
          ) : (
            <FiMenu className="text-3xl hover:text-custom-gold transition" />
          )}
        </button>
        {showNav && (
          <div
            className="absolute z-[10] top-9 right-0 bg-gray-300 rounded-md pt-1"
            onClick={() => setShowNav(false)}
          >
            <Link
              href="/"
              className="font-semibold tracking-wide hover:text-custom-navy transition hover:underline"
            >
              <AiOutlineRollback className="inline text-xl mb-1 mr-1" />
              Halaman Awal
            </Link>
            <KategoriPendaftaran
              kategoriPendaftaran={kategoriPendaftaran}
              setKategoriPendaftaran={setKategoriPendaftaran}
            />
          </div>
        )}
      </div>
      {
        forms[forms.findIndex((form) => form.name == kategoriPendaftaran)]
          .component
      }
    </div>
  );
};
export default FormPendaftaran;
