import { auth } from "@/utils/firebase";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useContext, createContext, useState, useEffect } from "react";

const Context = createContext<any>(null);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminAuthorized, setAdminAuthorized] = useState<boolean>(false);
  const [error, setError] = useState({
    code: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [disable, setDisable] = useState(false);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) =>
      setError({ message: error.message, code: error.code })
    );
  };

  const adminLogin = (email: string, pass: string) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        checkAdminAuthorized(userCredential.user);
      })
      .catch((error) => setError({ message: error.message, code: error.code }));
  };

  const logOut = () => {
    signOut(auth).then(() => {
      setAdminAuthorized(false);
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

  const checkAdminAuthorized = (user: User) => {
    if (user.uid === process.env.ADMIN_UID) {
      setAdminAuthorized(true);
    } else {
      setError({ ...error, message: "UID doesnt match" });
    }
  };
  return (
    <Context.Provider
      value={{
        error,
        user,
        userLoading,
        googleSignIn,
        logOut,
        adminLogin,
        checkAdminAuthorized,
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
