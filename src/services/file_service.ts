import { IMAGES_PATH } from "../core/constants";

const fs = require('fs').promises;
const path = require('path');

export const deleteImage = async (fileName: string) => {
    const filePath = path.resolve(IMAGES_PATH, fileName);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.log("Error deleting image");
    }
}