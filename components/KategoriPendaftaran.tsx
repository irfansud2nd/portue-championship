import { MyContext } from "@/context/Context";
import { kategoriPendaftaranArray } from "@/utils/constants";
import { KategoriPendaftaranProps } from "@/utils/types";
import { BsArrowRightCircleFill } from "react-icons/bs";

const KategoriPendaftaran = ({
  setKategoriPendaftaran,
  kategoriPendaftaran,
}: KategoriPendaftaranProps) => {
  const { disable } = MyContext();
  return (
    <div className={`grid grid-rows-4 items-center text-white`}>
      {kategoriPendaftaranArray.map((kategori, i: number) => (
        <div key={kategori} className="w-full flex flex-col gap-2 items-center">
          <button
            disabled={disable}
            onClick={() => setKategoriPendaftaran(kategori)}
            className={`w-full px-2 capitalize font-bold text-xl tracking-wide hover:bg-custom-yellow hover:text-black transition
            ${
              kategori == kategoriPendaftaran
                ? "bg-custom-yellow text-black"
                : "bg-custom-navy text-custom-yellow"
            }
            ${i == 0 && "rounded-t-md"}
            ${i == kategoriPendaftaranArray.length - 1 && "rounded-b-md"}
            `}
          >
            {kategori}
          </button>
        </div>
      ))}
    </div>
  );
};
export default KategoriPendaftaran;
