import { defineStore } from "pinia";
import type {
  ProviderService,
  Slot,
} from "~/services/dataBase/schema/schemaTypes";

export const ProviderServicesStore = defineStore("provider", {
  state: () => ({
    allProviderServices: [] as ProviderService[],
    aProviderServices: [] as ProviderService[],
  }),

  actions: {
    async setAllProviderServices() {
      const { getAllProvidersServices, updateAService } = useProvider()
      this.allProviderServices = (await getAllProvidersServices()) as ProviderService[]
      this.allProviderServices.forEach(async service => {
        service.slots.forEach(slot => {
          if (slot.bookingDate) {
            slot.bookingDate = slot.bookingDate.filter(date => {
              return new Date().getTime() < date ? true : false
            })
          }
        })
        await updateAService(service.id, service)
      })
    },
    setAProviderServices(userId: string) {
      this.aProviderServices = this.allProviderServices.filter(service => service.userId == userId)
    },
    updateService(service: ProviderService) {
      this.allProviderServices = this.allProviderServices.map(s => s.id == service.id ? service : s)
      this.aProviderServices = this.aProviderServices.map(s => s.id == service.id ? service : s)
    }
  },

  getters: {
    getUsedSlots: (state) => {
      let usedslots: Slot[] = [];
      state.aProviderServices.forEach((service) => {
        service.slots.forEach((slot) => {
          if (slot.selected) {
            usedslots.push(slot);
          }
        });
      });
      return usedslots;
    },
    getServiceBySubCategory: (state) => {
      return (subcategory: string): ProviderService => {
        return state.aProviderServices.filter(service => service.subCategory == subcategory)[0]
      }
    },
    getUsedCategogiesAndSubCategories: (state) => {
      let categoriesAndSubCategories: { [key: string]: string[] } = {}
      state.aProviderServices.forEach(service => {
        if (categoriesAndSubCategories[service.category]) {
          categoriesAndSubCategories[service.category].push(service.subCategory)
        } else {
          categoriesAndSubCategories[service.category] = [service.subCategory]
        }
      })
      return categoriesAndSubCategories
    },
    getServiceByServiceId: (state) => {
      return (serviceId: string): ProviderService => {
        return state.allProviderServices.filter(service => service.id == serviceId)[0]
      }
    },
    getAllBookedDates: (state) => {
      let allBookedDates: Date[] = []
      state.aProviderServices.forEach(service => {
        service.slots.forEach(slot => {
          if (slot.bookingDate) {
            slot.bookingDate.forEach(date => {
              allBookedDates.push(new Date(date))
            })
          }
        })
      })
      return allBookedDates
    }
  },
});
