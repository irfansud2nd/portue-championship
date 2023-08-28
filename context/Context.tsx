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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);
  const checkAdminAuthorized = (user: User) => {
    if (user.uid === process.env.NEXT_PUBLIC_ADMIN_UID) {
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
        googleSignIn,
        logOut,
        adminLogin,
        checkAdminAuthorized,
        adminAuthorized,
        submitting,
        setSubmitting,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const MyContext = () => {
  return useContext(Context);
};