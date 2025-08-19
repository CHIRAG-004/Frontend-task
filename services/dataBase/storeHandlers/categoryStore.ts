import { idbRequestToPromise } from "~/services/utils/idbRequestToPromise";

interface Categories {
  id: string;
  categories: {
    [key: string]: string[];
  };
}

/**
 * get all categories from database
 * @returns all categories
 */
export const getAllCategories = async function () {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Categories", "readonly");
  const store = tx.objectStore("Categories");
  try {
    const request = store.getAll();
    const response = (await idbRequestToPromise(request)) as Categories[];
    return response[0].categories;
  } catch (error) {
    throw error;
  }
};
