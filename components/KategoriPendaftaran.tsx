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
    <div
      className={`py-2 bg-custom-navy rounded-md grid grid-cols-4 items-center text-white`}
    >
      {kategoriPendaftaranArray.map((kategori, i: number) => (
        <div key={kategori} className="w-full flex justify-around items-center">
          <button
            disabled={disable}
            onClick={() => setKategoriPendaftaran(kategori)}
            className={`btn_kategori ${
              kategori == kategoriPendaftaran && "btn_kategori_active"
            }`}
          >
            {kategori}
          </button>
          {i !== kategoriPendaftaranArray.length - 1 && (
            <BsArrowRightCircleFill className="inline text-4xl text-custom-yellow" />
          )}
        </div>
      ))}
    </div>
  );
};
export default KategoriPendaftaran;
