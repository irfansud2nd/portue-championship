"use client";
import {
  DataKontingenState,
  DataOfficialState,
  DataPesertaState,
  FormPendaftaranProps,
} from "@/utils/types";
import { useState } from "react";
import FormKontingen from "./forms/FormKontingen";
import FormOfficial from "./forms/FormOfficial";
import FormPeserta from "./forms/FormPeserta";
import FormPembayaran from "./forms/FormPembayaran";
import { compare } from "@/utils/sharedFunctions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { MyContext } from "@/context/Context";

const FormPendaftaran = ({ kategoriPendaftaran }: FormPendaftaranProps) => {
  const [kontingens, setKontingens] = useState<DataKontingenState[]>([]);
  const [officials, setOfficials] = useState<DataOfficialState[] | []>([]);
  const [pesertas, setPesertas] = useState<DataPesertaState[] | []>([]);

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
      {
        forms[forms.findIndex((form) => form.name == kategoriPendaftaran)]
          .component
      }
    </div>
  );
};
export default FormPendaftaran;
