const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
const app = express();

cloudinary.config({
    cloud_name: process.env.CL_NAME,
    api_key: process.env.CL_API_KEY,
    api_secret: process.env.CL_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blogs',
        allowedFormats: ['jpeg', 'jpg', 'png'],
    }
});
module.exports = {
    cloudinary,
    storage
}