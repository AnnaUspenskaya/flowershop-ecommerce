import Item from '../models/Item';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

});

const uploadImage=async (image) => {
    const options ={
    use_filename:true,
    unique_filename:false,
    overwrite: true,
    folder: '',
    }

};

export const createProduct = async(req, res) => {
    try{
        if(!req.files || req.files.length === 0){
            return res.status(400).json({error: "No image upladed"});
        }

    const uploadImages = [];
    for (const file of req.files){
        uploadImages.push(await uploadImage(file));
    };

    const shortDesc = req.body.longDescription.length < 157 ? req.body.longDescription : `${req.body.longDescription.substring(0,157)}...`;
    const product = new Product({
        ...req.body,
        images: uploadImages,
        shortDescription: shortDesc,
    });

    console.log(product);
    console.log(product.images);
    await product.save();
    res.status(201).json(product);
    }catch(error){
        res.status(400).json({error: error.messasge});
    }
};