import { MyContext } from "@/context/Context";

const AdminButtons = ({
  setMode,
  refresh,
}: {
  setMode: React.Dispatch<React.SetStateAction<any[]>>;
  refresh: () => void;
}) => {
  const { adminAuthorized } = MyContext();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn_navy_gold btn_full font-bold tracking-wide"
        onClick={() => setMode([])}
      >
        Reset
      </button>
      <button
        className="btn_navy_gold btn_full font-bold tracking-wide"
        onClick={() => setMode(["peserta"])}
      >
        Show All Peserta
      </button>
      <button
        className="btn_navy_gold btn_full font-bold tracking-wide"
        onClick={() => setMode(["kontingen"])}
      >
        Show All Kontingen
      </button>
      <button
        className="btn_navy_gold btn_full font-bold tracking-wide"
        onClick={() => setMode(["official"])}
      >
        Show All Official
      </button>
      <button
        className="btn_navy_gold btn_full font-bold tracking-wide"
        onClick={refresh}
      >
        Refresh Data
      </button>
      {adminAuthorized.indexOf("master") >= 0 && (
        <>
          <button className="btn_navy_gold btn_full font-bold tracking-wide">
            Add New Admin
          </button>
          <button className="btn_navy_gold btn_full font-bold tracking-wide">
            Show All Admin
          </button>
        </>
      )}
    </div>
  );
};
export default AdminButtons;
