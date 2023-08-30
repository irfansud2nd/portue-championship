"use client";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
  KategoriPendaftaranProps,
} from "@/utils/types";
import { useState } from "react";
import FormKontingen from "./forms/FormKontingen";
import FormOfficial from "./forms/FormOfficial";
import FormPeserta from "./forms/FormPeserta";
import FormPembayaran from "./forms/FormPembayaran";
import { compare } from "@/utils/sharedFunctions";
import { MyContext } from "@/context/Context";
import { FiMenu } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import KategoriPendaftaran from "./KategoriPendaftaran";

const FormPendaftaran = ({
  setKategoriPendaftaran,
  kategoriPendaftaran,
}: KategoriPendaftaranProps) => {
  const [kontingens, setKontingens] = useState<DataKontingenState[]>([]);
  const [officials, setOfficials] = useState<DataOfficialState[] | []>([]);
  const [pesertas, setPesertas] = useState<DataPesertaState[] | []>([]);
  const [showNav, setShowNav] = useState(false);

  const { user } = MyContext();

  const forms = [
    {
      name: "kontingen",
      component: (
        <FormKontingen kontingens={kontingens} setKontingens={setKontingens} />
      ),
    },
    {
      name: "official",
      component: (
        <FormOfficial
          kontingens={kontingens.sort(compare("namaKontingen", "asc"))}
          officials={officials}
          setOfficials={setOfficials}
        />
      ),
    },
    {
      name: "peserta",
      component: (
        <FormPeserta
          kontingens={kontingens.sort(compare("namaKontingen", "asc"))}
          pesertas={pesertas}
          setPesertas={setPesertas}
        />
      ),
    },
    {
      name: "pembayaran",
      component: (
        <FormPembayaran
          kontingens={kontingens}
          officials={officials}
          pesertas={pesertas}
        />
      ),
    },
  ];
  return (
    <div className="bg-white rounded-md min-h-full w-full p-2">
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
            className="absolute z-[10] top-9 right-0"
            onClick={() => setShowNav(false)}
          >
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
