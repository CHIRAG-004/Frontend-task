import { defineStore } from "pinia";
import type { Image } from "~/services/dataBase/schema/schemaTypes";

export const ImageStore = defineStore("image", {
  state: () => ({
    allImages: [] as Image[],
  }),

  actions: {
    async setAllImages() {
      this.allImages = (await useImage().getAllImages())!
    },
    addImage(image: Image) {
      this.allImages.push(image)
    },
    updateImage(id: string, image: Partial<Image>) {
      this.allImages.forEach(img => image.id == id ? img.image == image : null)
    },
    deleteImage(id: string) {
      this.allImages = this.allImages.filter(img => img.id != id)
    }
  },
  getters: {
    getAImage: (state) => {
      return (id: string) => state.allImages.find(img => img.id == id)
    }
  }
});
