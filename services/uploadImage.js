const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./Images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

exports.imageFileUpload = upload.single("image");
