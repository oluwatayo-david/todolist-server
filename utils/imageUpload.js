// import { gfs } from '../config/cloudinary.js';
// import mongoose from 'mongoose';
//
// /**
//  * Convert GridFS image to base64 data URL
//  * @param {ObjectId} fileId - GridFS file ID
//  * @returns {Promise<string|null>} - Base64 data URL or null if no image
//  */
// export const getImageAsBase64 = async (fileId) => {
//     try {
//         if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
//             return null;
//         }
//
//         const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(fileId) });
//
//         if (!file || file.length === 0) {
//             return null;
//         }
//
//         // Check if it's an image
//         if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.contentType)) {
//             return null;
//         }
//
//         return new Promise((resolve, reject) => {
//             const readstream = gfs.createReadStream(file.filename);
//             const chunks = [];
//
//             readstream.on('data', (chunk) => {
//                 chunks.push(chunk);
//             });
//
//             readstream.on('end', () => {
//                 const buffer = Buffer.concat(chunks);
//                 const base64 = buffer.toString('base64');
//                 const dataUrl = `data:${file.contentType};base64,${base64}`;
//                 resolve(dataUrl);
//             });
//
//             readstream.on('error', (error) => {
//                 console.error('Error reading image:', error);
//                 resolve(null);
//             });
//         });
//     } catch (error) {
//         console.error('Error getting image as base64:', error);
//         return null;
//     }
// };
//
// /**
//  * Add image data to a single object
//  * @param {Object} obj - Object with image field
//  * @param {string} imageField - Name of the image field (e.g., 'profileImage', 'taskImage')
//  * @returns {Promise<Object>} - Object with image data added
//  */
// export const addImageToObject = async (obj, imageField) => {
//     if (!obj || !obj[imageField]) {
//         return { ...obj, [`${imageField}Url`]: null };
//     }
//
//     const imageUrl = await getImageAsBase64(obj[imageField]);
//     return {
//         ...obj,
//         [`${imageField}Url`]: imageUrl
//     };
// };
//
// /**
//  * Add image data to an array of objects
//  * @param {Array} objects - Array of objects with image fields
//  * @param {string} imageField - Name of the image field
//  * @returns {Promise<Array>} - Array with image data added to each object
//  */
// export const addImageToObjects = async (objects, imageField) => {
//     if (!objects || !Array.isArray(objects)) {
//         return [];
//     }
//
//     const objectsWithImages = await Promise.all(
//         objects.map(obj => addImageToObject(obj.toObject ? obj.toObject() : obj, imageField))
//     );
//
//     return objectsWithImages;
// };