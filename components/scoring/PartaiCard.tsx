import Link from "next/link";

const PartaiCard = ({
  label,
  partai,
  link,
  disabled,
}: {
  label: string;
  partai: string;
  link: string;
  disabled?: boolean;
}) => {
  return (
    <div className="bg-custom-navy text-custom-yellow p-2 px-4 flex flex-col gap-y-2 justify-center items-center rounded-md">
      <p className="font-semibold text-xl text-white">{label}</p>
      <p className="font-bold text-2xl">{partai}</p>
      {disabled ? (
        <button
          className="bg-custom-yellow hover:bg-custom-navy text-custom-navy hover:text-custom-yellow border-2 border-custom-yellow transition-all px-2 rounded-md font-semibold"
          disabled
        >
          Tabel Partai
        </button>
      ) : (
        <Link
          href={link}
          target="_blank"
          className="bg-custom-yellow hover:bg-custom-navy text-custom-navy hover:text-custom-yellow border-2 border-custom-yellow transition-all px-2 rounded-md font-semibold"
        >
          Tabel Partai
        </Link>
      )}
    </div>
  );
};
export default PartaiCard;
