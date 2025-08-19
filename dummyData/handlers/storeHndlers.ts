import { idbRequestToPromise } from "~/services/utils/idbRequestToPromise";
import categoryData from "../data/category.json";
import userData from "../data/user.json";
import serviceData from "../data/service.json";
import imagesData from "../data/image.json";
import type { Image } from "~/services/dataBase/schema/schemaTypes";

export const categoryStoreHandler = async (tx: IDBTransaction) => {
  const store = tx.objectStore("Categories");
  const defaultCategories: { [key: string]: string[] } = categoryData;
  try {
    const request = store.add({
      id: 1,
      categories: defaultCategories,
    });
    await idbRequestToPromise(request);
  } catch (error) {
    console.error(error);
  }
};

export const userStoreHandler = async (tx: IDBTransaction) => {
  const store = tx.objectStore("User");
  const defaultUsers = userData;
  for (let user of defaultUsers) {
    try {
      const request = store.add(user);
      await idbRequestToPromise(request);
    } catch (error) {
      console.error(error);
    }
  }
};

export const serviceStoreHandler = async (tx: IDBTransaction) => {
  const store = tx.objectStore("ProviderService");
  const defaultServices = serviceData;
  for (let service of defaultServices) {
    try {
      const request = store.add(service);
      await idbRequestToPromise(request);
    } catch (error) {
      console.error(error);
    }
  }
};


export const imageStoreHandler = async (tx: IDBTransaction) => {
  const store = tx.objectStore("Images");
  const defaultImages = imagesData as unknown as Image[]
  for (let image of defaultImages) {
    try {
      const response = await fetch(image.image as unknown as string, {
        method: 'GET',
      })
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      image.image = file
      const request = store.add(image);
      await idbRequestToPromise(request);
    } catch (error) {
      console.error(error);
    }
  }
};
