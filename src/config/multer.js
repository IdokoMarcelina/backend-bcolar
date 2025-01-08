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
    folder: "productPics",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const collaboPicStorage = multer.diskStorage ({
  // cloudinary,
  // params: {
  //   folder: "collaboPics",
  //   allowed_formats: ["jpg", "jpeg", "png"],
  // },
  filename: (req,file,cb)=>{
    cb(null , Date.now() + path.extname(file.originalname))
  }
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
