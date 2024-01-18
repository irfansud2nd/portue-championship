import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

const PersyaratanButton = ({
  data,
  id,
  label,
  check,
}: {
  data: string[];
  id: string;
  label: string;
  check: (arg0: boolean, arg1: string) => void;
}) => {
  return (
    <>
      {data.indexOf(id) < 0 ? (
        <button
          onClick={() => check(true, id)}
          className="text-red-500 flex gap-1"
        >
          <span className="mt-1">
            <ImCheckboxUnchecked />
          </span>{" "}
          {label}
        </button>
      ) : (
        <button
          onClick={() => check(false, id)}
          className="text-green-500 flex gap-1"
        >
          <span className="mt-1">
            <ImCheckboxChecked />
          </span>{" "}
          {label}
        </button>
      )}
    </>
  );
};
export default PersyaratanButton;
