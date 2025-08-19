import type { ProviderService, Slot } from "~/services/dataBase/schema/schemaTypes";
import { createService, deleteService, getAllServices, getAService, getAUserServiceByCategory, getUserAllServices, updateService } from "~/services/dataBase/storeHandlers/providerStore";


export default function () {

    /**
     * get all services provided by a using store handler function
     * @param userId userid(string)
     * @returns all provider services provided by a user
     */
    const getAUserServices = async (userId: string) => {
        try {
            const services = await getUserAllServices(userId)
            return services
        } catch (error) {
            console.log(error)
            return []
        }
    }

    /**
     * create a provider service by using store handler function
     * @param serviceDetails provider service details object
     */
    const createAService = async (serviceDetails: ProviderService) => {
        try {
            const services = await createService(serviceDetails)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * delete a provider service from db using store handler function
     * @param id provider service id
     */
    const deleteAService = async (id: string) => {
        try {
            const services = await deleteService(id)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * get a provider service from db by using store handler function
     * @param serviceId provider service id 
     * @returns a provider service details of given service id
     */
    const getSingleService = async (serviceId: string) => {
        try {
            const service = await getAService(serviceId)
            return service
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * get a provider service of a given category of a user using store handler function
     * @param category category of a provider service
     * @param userId userid(string)
     * @returns a provider service of give userid and category
     */
    const getSingleUserServiceByCategory = async (category: string, userId: string) => {
        try {
            const service = await getAUserServiceByCategory(category, userId)
            return service
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * update a service details in db using store handler 
     * @param id provider service id
     * @param serviceDetails updated service details
     * @returns updated service
     */
    const updateAService = async (id: string, serviceDetails: Partial<ProviderService>) => {
        try {
            const service = await updateService(id, JSON.parse(JSON.stringify(serviceDetails)))
            return service
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * get all provider services from db usin store handler
     * @returns all provider services from db
     */
    const getAllProvidersServices = async () => {
        try {
            return await getAllServices()
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * filter services by given date and time 
     * @param date selected date
     * @param time selected slot time
     * @returns filtered services from all services 
     */
    const getServicesByDateAndTime = (date: Date, time: string) => {

        //getting all services from provider service store
        const services = ProviderServicesStore().allProviderServices
        return services.filter(service => {

            //checking future booking availability
            if ((new Date().getTime() + (service.futureBookingAvailability * 24 * 60 * 60 * 1000)) < date.getTime()) return false
            else {

                //checking unavailability
                if (service.unavailability) {
                    if (new Date(service.unavailability[0]).getTime() < date.getTime() && new Date(service.unavailability[1]).getTime() > date.getTime()) {
                        if(time) 
                        return false
                    }
                }

                // checking service available on given or nearby slot or not
                if (time) {
                    const timeSlot: Slot[] = []
                    const index = service.slots.findIndex(slot => {
                        return slot.time === time || slot.time == ((Number(time.split(":")[0]) - 1) % 12 == 0 ? "12:00 PM" : (Number(time.split(":")[0]) - 1) % 12 + + ":" + time.split(":")[1]) || slot.time == ((Number(time.split(":")[0]) + 1) % 12 == 0 ? "12:00 PM" : (Number(time.split(":")[0]) + 1) % 12 + ":" + time.split(":")[1])
                    })
                    if (index == -1) return false
                    else {
                        if (index - 1 >= 0) timeSlot.push(service.slots[index - 1])
                        timeSlot.push(service.slots[index])
                        if (index + 1 < service.slots.length) timeSlot.push(service.slots[index + 1])
                    }
                    if (timeSlot.length) return true
                    else return false
                }
                else return true
            }
        })

    }

    return {
        getAUserServices,
        createAService,
        deleteAService,
        getSingleService,
        getSingleUserServiceByCategory,
        updateAService,
        getAllProvidersServices,
        getServicesByDateAndTime
    }
}