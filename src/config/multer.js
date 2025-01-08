const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const idCardstorage = new CloudinaryStorage({
  filename: (req,file,cb)=>{
    cb(null , Date.now() + path.extname(file.originalname))
  }
});

const profilePicStorage = new CloudinaryStorage({
  filename: (req,file,cb)=>{
    cb(null , Date.now() + path.extname(file.originalname))
  }
});

const productPicStorgae = multer.diskStorage({
  filename: (req,file,cb)=>{
    cb(null , Date.now() + path.extname(file.originalname))
  }
});

const collaboPicStorage = multer.diskStorage ({
  // cloudinary,
  // params: {
  //   folder: "collaboPics",
  //   allowed_formats: ["jpg", "jpeg", "png"],
  // }
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
