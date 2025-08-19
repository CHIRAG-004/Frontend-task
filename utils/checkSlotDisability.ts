import type { ProviderService, Slot } from "~/services/dataBase/schema/schemaTypes";

export default function (slot: Slot, selectedDate: Date, providerService: ProviderService){
    const time = slot.time.split(" ")[1] == "PM" ? Number(slot.time.split(":")[0]) + 12 : Number(slot.time.split(":")[0]);
  if (providerService.unavailability) {
    if (selectedDate.getDate() <= new Date(providerService.unavailability[1]).getDate() && selectedDate.getDate() >= new Date(providerService.unavailability[0]).getDate()) {
      if (time < new Date(providerService.unavailability[1]).getHours() && time >= new Date(providerService.unavailability[0]).getHours()) {
        return true
      }
      return false
    }
  }
  if (slot.bookingDate?.length) {
    const bookedSlot = slot.bookingDate.filter(date => {
      if (selectedDate.getDate() == new Date(date).getDate()) return true
      else {
        if (new Date().getHours() > time && selectedDate.getDate() == new Date().getDate()) return true
        return false
      }
    })
    return bookedSlot.length ? true : false
  }
  else if (time <= new Date().getHours() && selectedDate.getDate() == new Date().getDate()) return true
  return false
}