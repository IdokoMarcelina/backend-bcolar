const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const idCardstorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "id_cards", 
    allowed_formats: ["jpg", "jpeg", "png"], 
  },
});

const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePics",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const productPicStorgae = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePics",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const collaboPicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "collaboPics",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
})




const idCardUpload = multer({ storage: idCardstorage });
const profilePicUpload = multer({storage: profilePicStorage})
const productPicUpload = multer({storage: productPicStorgae})
const collaboPicUpload = multer({storage: collaboPicStorage})

module.exports = {
  idCardUpload,
  profilePicUpload,
  productPicUpload,
  collaboPicUpload
};
