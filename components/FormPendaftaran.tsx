"use client";
import { DataKontingenState, FormPendaftaranProps } from "@/utils/types";
import { useState } from "react";
import FormKontingen from "./forms/FormKontingen";
import FormOfficial from "./forms/FormOfficial";
import FormPeserta from "./forms/FormPeserta";
import FormPembayaran from "./forms/FormPembayaran";

const FormPendaftaran = ({ kategoriPendaftaran }: FormPendaftaranProps) => {
  const [kontingens, setKontingens] = useState<DataKontingenState[]>([]);
  const forms = [
    {
      name: "kontingen",
      component: (
        <FormKontingen kontingens={kontingens} setKontingens={setKontingens} />
      ),
    },
    {
      name: "official",
      component: <FormOfficial />,
    },
    {
      name: "peserta",
      component: <FormPeserta />,
    },
    {
      name: "pembayaran",
      component: <FormPembayaran />,
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
