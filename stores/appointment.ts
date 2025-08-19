import { defineStore } from "pinia";
import type { Appointment, User } from "~/services/dataBase/schema/schemaTypes";
interface NewAppointment extends Appointment {
  data?: Partial<User>
}
export const AppointmentStore = defineStore("appointment", {
  state: () => ({
    consumerAppointments: [] as Appointment[],
    providerAppointments: [] as Appointment[],
  }),

  actions: {
    // Set appointments for consumers or providers dynamically
    setAppointments(
      appointments: Appointment[],
      type: "consumer" | "provider" = "consumer"
    ) {
      if (type === "consumer") {
        this.consumerAppointments = appointments;
      } else {
        this.providerAppointments = appointments;
      }
    },

    // Add a single appointment to the list
    addAppointment(
      appointment: NewAppointment,
    ) {
      this.consumerAppointments = [...this.consumerAppointments, appointment]
    },

    // Clear all appointments
    clearAppointments() {
      this.consumerAppointments = [];
      this.providerAppointments = [];
    },
  },

  getters: {
    // Get all appointments for consumers or providers
    getAllAppointments:
      (state) =>
      (type: "consumer" | "provider" = "consumer", subCategory?: string) => {
        return type === "consumer"
          ? state.consumerAppointments
          : state.providerAppointments?.filter(
              (appointment) => appointment.subCategory == subCategory
            );
      },

    // Get appointments by status (dynamic)
    getAppointmentsByStatus:
      (state) =>
      (
        status: string,
        type: "consumer" | "provider" = "consumer",
        subCategory?: string
      ) => {
        const appointments =
          type === "consumer"
            ? state.consumerAppointments
            : state.providerAppointments?.filter(
                (appointment) => appointment.subCategory == subCategory
              );
        return (
          appointments?.filter((appointment, idx) => {
            if (idx <= 6) {
              return status == "cancelled"
                ? appointment.status.match(/cancelled/)
                : appointment.status === status;
            }
          }) || []
        );
      },

    // Get upcoming appointments (dynamic)
    getUpcomingAppointments:
      (state) =>
      (type: "consumer" | "provider" = "consumer", subCategory?: string) => {
        const currentDate = new Date();
        const appointments =
          type === "consumer"
            ? state.consumerAppointments
            : state.providerAppointments?.filter(
                (appointment) => appointment.subCategory == subCategory
              );
        return (
          appointments?.filter((appointment, idx) => {
            if (idx <= 6) {
              const appointmentDate = new Date(appointment.bookedDate);
              return (
                appointmentDate > currentDate && appointment.status === "booked"
              );
            }
          }) || []
        );
      },
  },
});
