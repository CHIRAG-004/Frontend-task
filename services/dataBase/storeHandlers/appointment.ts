import { idbRequestToPromise } from "@/services/utils/idbRequestToPromise";
import type { Appointment } from "../schema/schemaTypes";

/**
 * create a appointment
 * @param appointmentObject an object of appointment details
 * @returns a appointment
 */
export async function createAppointment(appointmentObject: Appointment) {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Appointment", "readwrite");
  const store = tx.objectStore("Appointment");
  const request = store.add(appointmentObject);

  try {
    const response = await idbRequestToPromise(request);
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * get a appointment
 * @param appointmentId appointmentId(string)
 * @returns a appointment
 */
export async function getAppointment(appointmentId: string) {
  if (!appointmentId) return "Provide a appointment id";

  const { $db } = useNuxtApp();
  const tx = $db.transaction("Appointment", "readonly");
  const store = tx.objectStore("Appointment");
  const request = store.get(appointmentId);

  try {
    const response = await idbRequestToPromise(request);
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * get all appointments
 * @returns all appointments from database
 */
export async function getAllAppointmentsFromDb() {
  const { $db } = useNuxtApp();
  const tx = $db.transaction("Appointment", "readonly");
  const store = tx.objectStore("Appointment");

  try {
    const request = store.getAll();
    const data = await idbRequestToPromise(request);

    if (!data) return "No Appointments";

    // to be continue... we have to see first what kind of data we are recivied here

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * change a appointment status
 * @param appointmentId appointmentId(string)
 * @param newStatus appointment status(string)
 * @returns updated appointment
 */
export async function changeAppointmentStatus(
  appointmentId: string,
  newStatus: string
) {
  if (!appointmentId) return "Provide a appointment id";

  const { $db } = useNuxtApp();
  const tx = $db.transaction("Appointment", "readwrite");
  const store = tx.objectStore("Appointment");

  try {
    const request = store.get(appointmentId);
    const data = await idbRequestToPromise(request);

    if (!data) return "Appointment not found";

    const updatedAppoinntment = {
      ...data,
      ...{
        status: newStatus,
      },
    };

    const putRequest = store.put(updatedAppoinntment);
    await idbRequestToPromise(putRequest);

    return updatedAppoinntment;
  } catch (error) {
    throw error;
  }
}
