import { idbRequestToPromise } from "~/services/utils/idbRequestToPromise";
import type { Image } from "../schema/schemaTypes";

/**
 * Add a image into database
 * @param image file(png, jpg, jpge etc.)
 * @returns response object
 */
export const addImage = async function (image: Image) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Images", "readwrite");
  const store = tx.objectStore("Images");
  const finalImage = {
    id: image.id,
    image: image.image,
  };
  try {
    const request = store.add(finalImage);
    const response = await idbRequestToPromise(request);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * get a image by image id
 * @param id image id(string)
 * @returns response object with image
 */
export const getAImage = async function (id: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Images", "readonly");
  const store = tx.objectStore("Images");
  try {
    const request = store.get(id);
    const response = (await idbRequestToPromise(request)) as Image;
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * update a image in db
 * @param id image id(string)
 * @param image an image of File type
 */
export const updateImage = async function (id: string, image: Partial<Image>) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Images", "readonly");
  const store = tx.objectStore("Images");
  try {
    const request = store.get(id);
    const response = (await idbRequestToPromise(request)) as Image;
    if (!response) {
      throw Error("Service not found");
    }
    const updatedServideDetails = { ...response, ...image };
    const putRequest = store.put(updatedServideDetails);
    await idbRequestToPromise(putRequest);
  } catch (error) {
    throw error;
  }
};

/**
 * delete a image from database
 * @param id image id(string)
 */
export const deleteImage = async function (id: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Images", "readwrite");
  const store = tx.objectStore("Images");
  try {
    const request = store.delete(id);
    (await idbRequestToPromise(request)) as Image;
  } catch (error) {
    throw error;
  }
};

/**
 * get all images from database
 * @returns an images array
 */
export const getAllImage = async function () {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Images", "readonly");
  const store = tx.objectStore("Images");
  try {
    const request = store.getAll();
    const response = (await idbRequestToPromise(request)) as Image[];
    return response;
  } catch (error) {
    throw error;
  }
};
