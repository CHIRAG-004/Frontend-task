import type { Image } from "~/services/dataBase/schema/schemaTypes";
import { addImage, deleteImage, getAImage, getAllImage, updateImage } from "~/services/dataBase/storeHandlers/imageStore";

export default function () {

    /**
     * get an image in db using store handler function
     * @param image image object of Image type
     */
    const addAImage = async function (image: Image) {
        try {
            await addImage(image)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     *  get an image object from db using store hadler function
     * @param id image id(string)
     * @returns an image object of Image type
     */
    const getImageById = async function (id: string) {
        try {
            const response = await getAImage(id)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * udate an image in db by using store handeler function
     * @param id image id
     * @param image image of File type
     */
    const updateAImage = async function (id: string, image: Partial<Image>) {
        try {
            await updateImage(id, image)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * delete an image from db using store handler function
     * @param id image id
     */
    const deleteAImage = async function (id: string) {
        try {
            await deleteImage(id)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * get all immmag from db using store handler function
     * @returns all images from db
     */
    const getAllImages = async function () {
        try {
            const response = await getAllImage()
            return response
        } catch (error) {
            console.log(error)
        }
    }
    return {
        addAImage,
        getImageById,
        updateAImage,
        deleteAImage,
        getAllImages
    }
}