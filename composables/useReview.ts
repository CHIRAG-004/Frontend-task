import {
  createReviewAndRatingDB,
  getAllReviews,
} from "~/services/dataBase/storeHandlers/review";
import { v4 as uuidv4 } from "uuid";
import type {
  Appointment,
  ReviewAndRating,
  User,
} from "~/services/dataBase/schema/schemaTypes";

export const useReview = () => {
  /**
   * creating a review on a particular appointment
   * @param appointment appointment details
   * @param review review
   * @param rating rating
   */
  const createReviewAndRating = async (
    appointment: Appointment,
    review: string,
    rating: number
  ) => {
    try {
      const providerService = ProviderServicesStore().getServiceByServiceId(
        appointment.bookedFor
      );
      const reviewObj: ReviewAndRating = {
        id: uuidv4(),
        review: review,
        rating: rating,
        dateAndTime: new Date(),
        writtenBy: UserStore().getUser?.id!,
        writtenFor:
          UserStore().getUserRole == "consumer"
            ? appointment.bookedFor
            : appointment.bookedBy,
        subCategory: appointment.subCategory,
        category: appointment.category,
        role: UserStore().getUserRole!,
      };

      // creating review in db
      const reviewAndRating = await createReviewAndRatingDB(reviewObj);

      // adding review in review store
      ReviewStore().addReview(reviewObj);
      if (reviewAndRating) {
        // add review id in prover service details in provider service store
        ProviderServicesStore().updateService({
          ...providerService,
          ratingAndReviewIds: providerService.ratingAndReviewIds?.length
            ? [...providerService.ratingAndReviewIds, reviewObj.id]
            : [reviewObj.id],
        });
        // add review id in prover service details in db
        await useProvider().updateAService(providerService.id, {
          ratingAndReviewIds: providerService.ratingAndReviewIds?.length
            ? [...providerService.ratingAndReviewIds, reviewObj.id]
            : [reviewObj.id],
        });
      }
    } catch (error) {
      console.error("could not created review :", error);
    }
  };

  /**
   * get all review from db using store handler
   * @returns all review from db
   */
  const getAllExistingReviews = async () => {
    try {
      const data = await getAllReviews();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createReviewAndRating,
    getAllExistingReviews,
  };
};
