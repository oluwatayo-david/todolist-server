import cloudinary from "../config/cloudinary.js";


const uploadImage = async (buffer, originalname) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                upload_preset:"unsigned_upload",
                allowed_formats:['png' , 'jpg', "jpeg" , 'svg', 'ico' , 'jiff' , 'webp'],

            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        publicId: result.public_id,
                        url: result.secure_url,
                        originalName: originalname
                    });
                }
            }
        );

        uploadStream.end(buffer);
    });
};

// Upload document to Cloudinary
const uploadDocument = async (buffer, originalname) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'user_documents',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        publicId: result.public_id,
                        url: result.secure_url,
                        originalName: originalname
                    });
                }
            }
        );

        uploadStream.end(buffer);
    });
};

const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
};



export  { uploadImage,
    uploadDocument,
    deleteFile}