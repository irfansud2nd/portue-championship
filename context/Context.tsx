import { auth, firestore } from "@/utils/firebase";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, createContext, useState, useEffect } from "react";

const Context = createContext<any>(null);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminAuthorized, setAdminAuthorized] = useState<any[]>([]);
  const [error, setError] = useState({
    code: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [disable, setDisable] = useState(false);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) =>
      setError({ message: error.message, code: error.code })
    );
  };

  const checkAdminAuthorized = (user: User) => {
    setAdminLoading(true);
    let result: any;
    getDocs(query(collection(firestore, "admin"), where("uid", "==", user.uid)))
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          result = doc.data();
          setAdminAuthorized(result.role);
        })
      )
      .finally(() => setAdminLoading(false));
  };

  const logOut = () => {
    signOut(auth).then(() => {
      setAdminAuthorized([]);
    });
  };

  useEffect(() => {
    if (userLoading) {
      setTimeout(() => {
        setUserLoading(false);
      }, 500);
    }
  }, [loaded]);

  useEffect(() => {
    setLoaded(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <Context.Provider
      value={{
        error,
        user,
        userLoading,
        googleSignIn,
        logOut,
        checkAdminAuthorized,
        adminLoading,
        adminAuthorized,
        submitting,
        setSubmitting,
        disable,
        setDisable,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const MyContext = () => {
  return useContext(Context);
};
