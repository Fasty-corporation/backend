import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Fasty_media",
    format: async (req, file) => {
      const allowedFormats = ["jpeg", "png", "jpg", "gif"];
      const fileFormat = file.mimetype.split("/")[1];

      if (!allowedFormats.includes(fileFormat)) {
        throw new Error("Invalid file format");
      }

      return fileFormat;
    },
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

export const upload = multer({ storage });
