import { MyContext } from "@/context/Context";
import { firestore } from "@/utils/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const AdminButtons = ({
  setMode,
  refresh,
}: {
  setMode: React.Dispatch<React.SetStateAction<any[]>>;
  refresh: () => void;
}) => {
  const [rodalVisible, setRodalVisible] = useState(false);
  const [adminMode, setAdminMode] = useState<"add" | "show" | "">("");
  const [data, setData] = useState({ email: "", uid: "" });
  const [admins, setAdmins] = useState<any[]>([]);
  const { adminAuthorized } = MyContext();

  const sendAdmin = () => {
    addDoc(collection(firestore, "admin"), {
      ...data,
      role: arrayUnion("admin"),
    }).then(() => {
      setAdminMode("");
    });
  };

  const getAdmins = () => {
    let container: any[] = [];
    getDocs(collection(firestore, "admin"))
      .then((res) => res.forEach((doc) => container.push(doc.data())))
      .finally(() => setAdmins(container));
  };

  useEffect(() => {
    setRodalVisible(adminMode !== "");
    if (adminMode == "") {
      setData({ email: "", uid: "" });
      setAdmins([]);
    }
    if (adminMode === "show") getAdmins();
  }, [adminMode]);

  return (
    <div className="flex flex-wrap gap-2">
      <Rodal
        visible={rodalVisible}
        customStyles={{
          width: "fit-content",
          height: "fit-content",
          padding: "8px",
        }}
        onClose={() => setAdminMode("")}
      >
        {adminMode == "add" ? (
          <>
            <h1>Add New Admin</h1>
            <div className="input_container">
              <label htmlFor="">Email</label>
              <input
                type="text"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="input_container">
              <label htmlFor="">uid</label>
              <input
                type="text"
                value={data.uid}
                onChange={(e) => setData({ ...data, uid: e.target.value })}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={sendAdmin} className="btn_full btn_green">
                add
              </button>
              <button
                onClick={() => setAdminMode("")}
                className="btn_full btn_red"
              >
                cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold">List Admin</h1>
            {admins.map((admin) => (
              <div className="border-b-2 border-black last:border-none">
                <p>{admin.email}</p>
                <p>{admin.uid}</p>
              </div>
            ))}
          </>
        )}
      </Rodal>
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
          <button
            className="btn_navy_gold btn_full font-bold tracking-wide"
            onClick={() => setAdminMode("add")}
          >
            Add New Admin
          </button>
          <button
            className="btn_navy_gold btn_full font-bold tracking-wide"
            onClick={() => setAdminMode("show")}
          >
            Show All Admin
          </button>
        </>
      )}
    </div>
  );
};
export default AdminButtons;
