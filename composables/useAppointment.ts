import type {
  Appointment,
  Image,
  ProviderService,
  User,
} from "~/services/dataBase/schema/schemaTypes";
import { v4 as uuidv4 } from "uuid";
import {
  createAppointment,
  changeAppointmentStatus,
  getAppointment,
} from "~/services/dataBase/storeHandlers/appointment";
import {
  updateDocument,
  updateImage,
} from "~/services/dataBase/storeHandlers/user";

interface NewAppointment extends Appointment {
  data?: Partial<User> & { cancellationAvailability: number };
}

const { addAImage } = useImage();

export const useAppointment = () => {
  const router = useRouter();
  const { getUser } = UserStore();
  const { setAppointments, addAppointment } = AppointmentStore();

  //
  /**
   * create a appointment using store handler functions
   * @param appointment appointment details object
   * @param providerService providerService details object
   */
  const createAAppointment = async (
    appointment: Partial<Appointment>,
    providerService: ProviderService
  ) => {
    try {
      const {
        description,
        documents,
        bookedDate,
        bookedFor,
        category,
        slot,
        subCategory,
      } = appointment;

      // uploading appointment documents into database
      const documentIds = [];
      if (documents?.length) {
        for (let i = 0; i < documents?.length!; i++) {
          const imageObj: Image = {
            id: uuidv4(),
            image: documents[i] as unknown as File,
          };
          await addAImage(imageObj);
          ImageStore().addImage(imageObj);
          documentIds.push(imageObj.id);
        }
      }

      // creating appointment object
      const appointmentDetails: NewAppointment = {
        id: uuidv4(),
        bookedBy: getUser?.id!,
        bookedDate: bookedDate!,
        bookedFor: bookedFor!,
        category: category!,
        description: description!,
        documents: documentIds,
        paymentId: uuidv4(),
        slot: {
          time: slot?.time,
          price: slot?.price,
        },
        status: "booked",
        subCategory: subCategory!,
      };
      await createAppointment(appointmentDetails);

      // updating provider service details with appointment id
      providerService.appointmentIds = providerService.appointmentIds?.length
        ? [...providerService.appointmentIds, appointmentDetails.id]
        : [appointmentDetails.id];
      providerService.slots = providerService.slots.map((el) => {
        if (slot?.time === el.time) {
          if (el.bookingDate?.length) {
            el.bookingDate.push(bookedDate?.getTime()!);
          } else {
            el.bookingDate = [bookedDate?.getTime()!];
          }
        }
        return el;
      });

      // updating provider service in db
      await useProvider().updateAService(providerService.id, {
        appointmentIds: providerService.appointmentIds,
        slots: providerService.slots,
      });

      // updating provider service in provider store
      ProviderServicesStore().updateService(providerService);

      const { firstName, lastName, email, phoneNo, profilePicture, id } =
        UserStore().getUserById(providerService.userId) as User;

      // adding provider details in appointment data
      appointmentDetails.data = {
        firstName,
        lastName,
        email,
        id,
        phoneNo,
        profilePicture,
        cancellationAvailability: providerService.cancellationAvailability,
      };

      // updating user details in db with appointment id
      await updateDocument(getUser?.id!, {
        consumerAppointmentsIds: getUser?.consumerAppointmentsIds?.length
          ? [...getUser.consumerAppointmentsIds, appointmentDetails.id]
          : [appointmentDetails.id],
      });

      //  updating user details in user store with appointment id
      UserStore().updateUserDetails({
        consumerAppointmentsIds: getUser?.consumerAppointmentsIds?.length
          ? [...getUser.consumerAppointmentsIds, appointmentDetails.id]
          : [appointmentDetails.id],
      });
      onSuccess("appointment booked.");

      // adding new appointment in appointment store
      addAppointment(appointmentDetails);
      router.push("/user/profile");
    } catch (error) {
      console.log(error);
      onFailure("Can't booked appointment");
    }
  };

  /**
   * get all appointments of a current loggedin user as consumer or provider
   */
  const getAllAppointments = async () => {
    try {
      const user = UserStore().getUserById(getUser?.id!);
      const consumerAppointmentIds = user?.consumerAppointmentsIds;
      const providerServiceIds = user?.providerServicesIds;

      // getting as provider appoinments
      if (providerServiceIds?.length) {
        const providerAllAppointment = [];
        for (let i = 0; i < providerServiceIds.length; i++) {
          const service = ProviderServicesStore().getServiceByServiceId(
            providerServiceIds[i]
          );

          for (let k = 0; k < service.appointmentIds?.length!; k++) {
            const res = (await getAppointment(
              service.appointmentIds![k]
            )) as Appointment;
            if (res) {
              const consumerID = res.bookedBy;

              let consumer = UserStore().getUserById(consumerID!) as User;

              if (
                new Date(res.bookedDate) < new Date() &&
                !res.status.includes("cancelled")
              ) {
                res.status = "completed";
                await changeAppointmentStatus(
                  providerServiceIds[i],
                  "completed"
                );
              }
              providerAllAppointment.push({
                ...res,
                data: {
                  firstName: consumer.firstName,
                  lastName: consumer.lastName,
                  id: consumer.id,
                  email: consumer.email,
                  phoneNo: consumer.phoneNo,
                  profilePicture: consumer.profilePicture,
                },
              });
            }
          }
        }

        // set all appointments as provider in appointment store
        setAppointments(providerAllAppointment, "provider");
      }

      // getting aas consumer appoinments
      if (consumerAppointmentIds?.length) {
        const consumerAllAppointments = [];
        for (let i = 0; i < consumerAppointmentIds.length; i++) {
          const res = (await getAppointment(
            consumerAppointmentIds[i]
          )) as Appointment;
          if (res) {
            const providerService =
              ProviderServicesStore().getServiceByServiceId(res.bookedFor);
            let provider = UserStore().getUserById(
              providerService.userId!
            ) as User;

            if (
              new Date(res.bookedDate) < new Date() &&
              !res.status.includes("cancelled")
            ) {
              res.status = "completed";
              await changeAppointmentStatus(
                consumerAppointmentIds[i],
                "completed"
              );
            }
            consumerAllAppointments.push({
              ...res,
              data: {
                firstName: provider.firstName,
                lastName: provider.lastName,
                id: provider.id,
                email: provider.email,
                phoneNo: provider.phoneNo,
                profilePicture: provider.profilePicture,
                cancellationAvailability:
                  providerService.cancellationAvailability,
              },
            });
          }
        }

        // set all appointments as consumer in appointment store
        setAppointments(consumerAllAppointments, "consumer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * cancle an appointment
   * @param appointment an appointment details object
   */
  const cancelAppointment = async (appointment: Appointment) => {
    try {
      const appointmentStore = AppointmentStore();

      // removing appointment from consumer appointments from appointment store
      appointmentStore.consumerAppointments.forEach((appt) =>
        appt.id == appointment.id
          ? (appt.status = `cancelled by ${getUser?.role == "provider" ? "provider" : "consumer"
            }`)
          : ""
      );

      // removing appointment from provideer appointments from appointment store
      appointmentStore.providerAppointments.forEach((appt) =>
        appt.id == appointment.id
          ? (appt.status = `cancelled by ${getUser?.role == "provider" ? "provider" : "consumer"
            }`)
          : ""
      );

      // changing appointment status in db
      await changeAppointmentStatus(
        appointment.id,
        `cancelled by ${getUser?.role == "provider" ? "provider" : "consumer"}`
      );

      const service = ProviderServicesStore().getServiceByServiceId(
        appointment.bookedFor
      );

      // removing booked slot from provider services details of an cancled appointment
      service.slots.forEach((slot) => {
        if (slot.time == appointment.slot.time) {
          if (slot.bookingDate?.length)
            slot.bookingDate = slot.bookingDate.filter(
              (date) => appointment.bookedDate == new Date(date)
            );
        }
      });

      // update provider details in db
      await useProvider().updateAService(appointment.bookedFor, {
        slots: service.slots,
      });

      // update provider details in provider store
      ProviderServicesStore().updateService(service);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * update user profile picture
   * @param image image file
   */
  const updateUserProfile = async (image: File) => {
    try {
      await updateImage(image);
      UserStore().updateUserDetails({ profilePicture: image });
      onSuccess("Image updated");
    } catch (error) {
      throw error;
    }
  };

  /**
   * update user details
   * @param newUserDetails new object field
   */
  const updateUserDetails = async (newUserDetails: Partial<User>) => {
    try {
      await updateDocument(getUser?.id!, newUserDetails);
      UserStore().updateUserDetails(newUserDetails);
      onSuccess("user details updated");
    } catch (error) {
      throw error;
    }
  };

  return {
    createAAppointment,
    getAllAppointments,
    updateUserProfile,
    updateUserDetails,
    cancelAppointment,
  };
};
