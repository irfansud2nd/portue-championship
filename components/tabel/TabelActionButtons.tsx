const TabelActionButtons = ({
  handleDelete,
  handleEdit,
  id,
}: {
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  id: string;
}) => {
  return (
    <div className="flex gap-2">
      <button
        className="hover:text-custom-gold transition"
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
      <button
        className="hover:text-custom-gold transition"
        onClick={() => handleEdit(id)}
      >
        Edit
      </button>
    </div>
  );
};
export default TabelActionButtons;
