import { idbRequestToPromise } from "~/services/utils/idbRequestToPromise";
import type { ReviewAndRating } from "../schema/schemaTypes";

/**
 * create a review and rating in db
 * @param reviewAndRating review rating details object
 * @returns response with created review rating object
 */
export const createReviewAndRatingDB = async (
  reviewAndRating: ReviewAndRating
) => {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ReviewAndRating", "readwrite");
  const store = tx.objectStore("ReviewAndRating");
  try {
    const request = store.add(reviewAndRating);
    const response = (await idbRequestToPromise(request)) as ReviewAndRating;
    return response;
  } catch (error) {
    console.log(error);
  }
};

/**
 * get all reviews from db
 * @returns all reviews
 */
export const getAllReviews = async () => {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ReviewAndRating", "readonly");
  const store = tx.objectStore("ReviewAndRating");
  try {
    const request = store.getAll();
    const response = (await idbRequestToPromise(request)) as ReviewAndRating[];
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * get a review from db
 * @param id review id(string)
 * @returns a review object
 */
export const getAreview = async (id: string) => {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("ReviewAndRating", "readonly");
  const store = tx.objectStore("ReviewAndRating");
  try {
    const request = store.get(id);
    const response = (await idbRequestToPromise(request)) as ReviewAndRating;
    return response;
  } catch (error) {
    throw error;
  }
};
