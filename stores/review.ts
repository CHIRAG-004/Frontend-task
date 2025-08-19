import type { ReviewAndRating } from './../services/dataBase/schema/schemaTypes';
import { defineStore } from "pinia";

export const ReviewStore = defineStore("review", {
    state: () => ({
        allReviews: [] as ReviewAndRating[]
    }),

    actions: {
        async setAllReviews() {
            this.allReviews = (await useReview().getAllExistingReviews())!;
        },
        addReview(reviewRating: ReviewAndRating) {
            this.allReviews.push(reviewRating)
        },
    },

    getters: {
        getAReviewById: (state) => {
            return (id: string) => state.allReviews.find(r => r.id == id)
        },
        getConsumerReview: (state) => state.allReviews.filter(review => review.writtenFor == UserStore().getUser?.id),
        getReviewByServiceID: (state) => {
            return (serviceid: string) => state.allReviews.filter(review => review.writtenFor == serviceid)
        }
    },
});
