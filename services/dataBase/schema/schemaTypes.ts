export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePicture?: string | File;
  role: "consumer" | "admin" | "provider";
  phoneNo: string;
  reviewAndRatingIds?: string[]; // ReviewAndRating.id
  consumerAppointmentsIds?: string[]; // Appointment.id
  providerServicesIds?: string[]; // ProviderService.id
}

export interface ReviewAndRating {
  id: string;
  review: string;
  rating: number;
  dateAndTime: Date;
  writtenBy: string;
  writtenFor: string;
  subCategory: string;
  category: string;
  role: string
}

export interface Slot {
  time: string;
  price: number;
  selected: boolean;
  bookingDate?: number[];
}

export type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface ProviderService {
  id: string;
  userId: string; // User.id
  category: string;
  subCategory: string;
  slots: Slot[];
  workingDays: Days[];
  cancellationAvailability: number;
  businessDescription: string;
  businessDocuments: string[];
  businessAddress: string;
  futureBookingAvailability: number;
  unavailability: Date[] | null;
  status: "active" | "inactive" | "processing";
  ratingAndReviewIds?: string[]; // ReviewAndRating.id
  appointmentIds?: string[]; // Appointment.id
}

export interface Appointment {
  id: string;
  bookedBy: string; // User.id
  bookedFor: string; // ProviderService.id
  category: string;
  subCategory: string;
  slot: Partial<Slot>;
  bookedDate: Date;
  paymentId: string;
  documents: string[];
  description: string;
  status:
    | "booked"
    | "completed"
    | "cancelled by consumer"
    | "cancelled by provider"
    | "rescheduled";
}

export interface Payment {
  id: string;
  paymentBy: string; // User.id
  paymentFor: string; // ProviderService.id
  admin: boolean;
  price: number;
  paidPayment: string;
  restPayment: string;
  madeFor: "booking" | "refund";
  cancelledBy?: "user" | "provider";
  paymentMethod: "credit_card" | "upi" | "netBanking";
  paymentDate: Date;
  appointmentId: string; // Appointment.id
}

export interface Image {
  id: string;
  image: File;
}
