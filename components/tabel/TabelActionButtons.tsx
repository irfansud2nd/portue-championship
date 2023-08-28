const TabelActionButtons = ({
  handleDelete,
  handleEdit,
}: {
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  return (
    <div className="flex gap-2">
      <button
        className="hover:text-custom-gold transition"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        className="hover:text-custom-gold transition"
        onClick={handleEdit}
      >
        Edit
      </button>
    </div>
  );
};
export default TabelActionButtons;
