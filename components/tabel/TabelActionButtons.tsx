import { MyContext } from "@/context/Context";

const TabelActionButtons = ({
  handleDelete,
  handleEdit,
}: {
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  const { disable } = MyContext();
  return (
    <div className="flex gap-2">
      {/* <button
        disabled={disable}
        className="hover:text-custom-gold transition"
        onClick={handleDelete}
      >
        Delete
      </button> */}
      <button
        disabled={disable}
        className="hover:text-custom-gold transition"
        onClick={handleEdit}
      >
        Edit
      </button>
    </div>
  );
};
export default TabelActionButtons;
