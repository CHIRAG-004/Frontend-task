import { defineStore } from "pinia";

export const CategoryStore = defineStore("category", {
  state: () => ({
    categoriesWithSubcategories: {} as { [key: string]: string[] },
  }),

  actions: {
    async setCategoriesAndSubCategories() {
      const { categoriesAndSubcategories } = useCategories();
      this.categoriesWithSubcategories = (await categoriesAndSubcategories())!;
    }
  },
  getters: {
    getCategories: (state) => {
      return Object.keys(state.categoriesWithSubcategories);
    },
    getSubCategories: (state) => {
      return Object.values(state.categoriesWithSubcategories).flat();
    },
    getSubCategoriesByCategory: (state) => {
      return (category: string): string[] => {
        return state.categoriesWithSubcategories[category] || [];
      };
    }
  },
});
