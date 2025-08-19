
import { getAllCategories } from "~/services/dataBase/storeHandlers/categoryStore";

export default function () {

    // get all categories and subcategories by using store handler function
    const categoriesAndSubcategories = async () => {
        try {
            return await getAllCategories()
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * get all subcategories of given category
     * @param category cateory(string)
     * @returns all subcategories of given category
     */
    const searchedSubcategories = async (category: string) => {

        try {
            return (await getAllCategories())[category]
        } catch (error) {
            console.log(error)
        }
    }

    return {
        searchedSubcategories,
        categoriesAndSubcategories
    }

}
