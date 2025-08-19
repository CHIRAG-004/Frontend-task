import { idbRequestToPromise } from "~/services/utils/idbRequestToPromise";
import type { ProviderService } from "../schema/schemaTypes";

/**
 * create a provider service in db
 * @param serviceDetails a provider service deatails object
 */
export const createService = async function (serviceDetails: ProviderService) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readwrite");
  const store = tx.objectStore("ProviderService");
  try {
    const request = store.add(serviceDetails);
    await idbRequestToPromise(request);
  } catch (error) {
    throw error;
  }
};

/**
 * get a provider service using its id from db
 * @param id provider service id in string
 * @returns a provider service
 */
export const getAService = async function (id: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readonly");
  const store = tx.objectStore("ProviderService");
  try {
    const request = store.get(id);
    const response = (await idbRequestToPromise(request)) as ProviderService;
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * get all services provided by a user
 * @param userId userid in string
 * @returns an array of provider services provided by a user
 */
export const getUserAllServices = async function (userId: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readonly");
  const store = tx.objectStore("ProviderService");
  try {
    const request = store.getAll();
    const response = (await idbRequestToPromise(request)) as ProviderService[];
    return response.filter((res) => res.userId == userId);
  } catch (error) {
    throw error;
  }
};

/**
 * update a service details in db
 * @param id service id in srting
 * @param serviceDetails updated details of a service
 * @returns updated service
 */
export const updateService = async function (
  id: string,
  serviceDetails: Partial<ProviderService>
) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readwrite");
  const store = tx.objectStore("ProviderService");
  try {
    const request = store.get(id);
    const response = (await idbRequestToPromise(request)) as ProviderService;
    if (!response) {
      throw Error("Service not found");
    }
    const updatedServideDetails = { ...response, ...serviceDetails };
    const putRequest = store.put(updatedServideDetails);
    const data = await idbRequestToPromise(putRequest);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * delete a service from db using its id
 * @param id a service id
 */
export const deleteService = async function (id: string) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readwrite");
  const store = tx.objectStore("ProviderService");
  try {
    const request = store.delete(id);
    await idbRequestToPromise(request);
  } catch (error) {
    throw error;
  }
};

/**
 * get a user service by its userid or category
 * @param category service category
 * @param userId userid in string
 * @returns a service provided by a user using its id and category
 */
export const getAUserServiceByCategory = async function (
  category: string,
  userId: string
) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readonly");
  const store = tx.objectStore("ProviderService");
  const index = store.index("category");
  try {
    const request = index.getAll(category);
    const response = (await idbRequestToPromise(request)) as ProviderService[];
    return response.filter((res) => res.userId == userId)[0];
  } catch (error) {
    throw error;
  }
};

/**
 * get all services from db
 * @returns all provided services from db
 */
export const getAllServices = async function () {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ProviderService", "readonly");
  const store = tx.objectStore("ProviderService");
  try {
    const request = store.getAll();
    const response = (await idbRequestToPromise(request)) as ProviderService[];
    return response;
  } catch (error) {
    throw error;
  }
};
