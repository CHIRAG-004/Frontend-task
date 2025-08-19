import { idbRequestToPromise } from "@/services/utils/idbRequestToPromise";
import type { Image, User } from "../schema/schemaTypes";
import { v4 as uuidv4 } from "uuid";
import { addImage, getAImage } from "./imageStore";

/**
 * create a user
 * @param userObject user details object
 * @returns created user object
 */
export async function createUser(userObject: User) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("User", "readwrite");
  const store = tx.objectStore("User");
  const request = store.add(userObject);

  try {
    const response = await idbRequestToPromise(request);
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * get all users from db
 * @returns all users
 */
export async function getAllUser() {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("User", "readonly");
  const store = tx.objectStore("User");

  try {
    const deleteRequest = store.getAll();
    const response = (await idbRequestToPromise(deleteRequest)) as User[];

    if (response) {
      for (let user of response) {
        if (typeof user.profilePicture == "string") {
          if (!/^https:\/\/*/.test(user.profilePicture)) {
            try {
              const res = (await getAImage(user.profilePicture)) as Image;
              user.profilePicture = res.image || "";
            } catch (error) {
              throw error;
            }
          }
        }
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * update a user's details in db
 * @param id user id(string)
 * @param updates updated field object
 * @returns new updated user object
 */
export async function updateDocument(id: string, updates: Partial<User>) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("User", "readwrite");
  const store = tx.objectStore("User");

  try {
    const getRequest = store.get(id);
    const response = await idbRequestToPromise(getRequest);
    const data = response;

    if (!data) {
      throw new Error("Document not found");
    }

    const updatedData = { ...data, ...updates };
    const putRequest = store.put(updatedData);
    await idbRequestToPromise(putRequest);

    return updatedData;
  } catch (error) {
    throw error;
  }
}

/**
 * get a user yy it's id
 * @param id user id(string)
 * @returns a user object
 */
export async function getData(id: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("User", "readonly");
  const store = tx.objectStore("User");

  try {
    const request = store.get(id);
    const response = (await idbRequestToPromise(request)) as User;
    if (!response) return false;

    if (typeof response.profilePicture == "string") {
      if (!/^https:\/\/*/.test(response?.profilePicture)) {
        try {
          const res = (await getAImage(response.profilePicture)) as Image;
          response.profilePicture = res.image || "";
        } catch (error) {
          throw error;
        }
      }
    }

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * delete a user from db
 * @param id user id(string)
 */
export async function deleteUser(id: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("User", "readwrite");
  const store = tx.objectStore("User");
  const deleteRequest = store.delete(id);

  try {
    await idbRequestToPromise(deleteRequest);
  } catch (error) {
    throw error;
  }
}

/**
 * upload image
 * @param image image File
 */
export async function updateImage(image: File) {
  try {
    const { getUser } = UserStore();
    const imgObj = {
      id: uuidv4(),
      image,
    };
    const response = (await addImage(imgObj)) as Image;
    if (response) {
      updateDocument(getUser?.id!, {
        profilePicture: imgObj.id,
      });
    }
  } catch (error) {
    throw error;
  }
}
