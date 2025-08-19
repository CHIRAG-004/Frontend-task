import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";

import type {
  User,
  User as UserCandidate,
} from "../services/dataBase/schema/schemaTypes";
import {
  createUser,
  getAllUser,
  getData,
} from "~/services/dataBase/storeHandlers/user";
import { useToast } from "vue-toastification";

export const useAuth = () => {
  const { $auth } = useNuxtApp();
  const { setUser, clearUser } = UserStore();

  const provider = new GoogleAuthProvider();

  // checking auth state of user from firebase
  const handleAuthState = () => {
    return new Promise((resolve) => {
      $auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser({
            id: user?.uid!,
            firstName: user?.displayName?.split(" ")[0]!,
            lastName: user?.displayName?.split(" ")[1]!,
            profilePicture: user.photoURL,
            email: user.email,
            ...UserStore().user,
          } as User);
        }
        resolve(user);
      });
    });
  };

  const toast = useToast();
  const router = useRouter();

  // Email/Password Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword($auth, email, password);

      if (user) {
        const userData = (await getData(user.user.uid)) as User;

        if (userData) {
          setUser(userData);
        }
      }
      useAppointment().getAllAppointments();
      toast.success("logged in");
      router.push("/user/profile");
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Email/Password Sign Up
  const signUp = async (user: UserCandidate) => {
    const { email, password, firstName, lastName, phoneNo, role } = user;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password!
      );

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName.charAt(
          0
        )}%20&.svg`,
      });

      const userData: UserCandidate = {
        id: userCredential.user.uid,
        firstName,
        lastName,
        email,
        phoneNo,
        role,
        profilePicture: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName.charAt(
          0
        )}%20&.svg`,
        consumerAppointmentsIds: [],
        providerServicesIds: [],
      };

      await createUser(userData);
      setUser(userData);
      UserStore().allUser.push(userData);

      router.push("/user/profile");
      toast.success("Registered and logged in successfully");
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut($auth);
      clearUser();
      AppointmentStore().clearAppointments();
      toast.success("logged out");
      router.push("/");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const getAllExistingUsers = async () => {
    try {
      const data = getAllUser();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // Google Sign In/Up
  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup($auth, provider);
      const { user } = userCredential;
      const userData = (await getData(user.uid)) as User;
      if (!userData) {
        //check user in data base if user does not exists  
        const userData: UserCandidate = {
          id: user.uid,
          firstName: user.displayName?.split(" ")[0]!,
          lastName: user.displayName?.split(" ")[1]!,
          email: user.email!,
          phoneNo: user.phoneNumber || "",
          role: "consumer",
          profilePicture:
            user.photoURL ||
            `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName
              ?.split(" ")[0]
              .charAt(0)}%20&.svg`,
          consumerAppointmentsIds: [],
          providerServicesIds: [],
        };

        await createUser(userData);

        // set user into user store
        UserStore().setUser(userData as User);
        UserStore().allUser.push(userData);

        toast.success("Registered and logged in successfully");
      } else toast.success("Logged in");

      // if user exists in db then logged in and set user data into user store
      setUser(userData);
      useAppointment().getAllAppointments();
      router.push("/user/profile");
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Unified error handler
  const handleAuthError = (error: any) => {
    if (error instanceof Error) {
      toast.error("Wrong email and password");
      throw new Error(error.message);
    }
    throw new Error("An unknown authentication error occurred");
  };

  return {
    setUser,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    handleAuthState,
    getAllExistingUsers,
  };
};
