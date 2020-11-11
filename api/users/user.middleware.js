const path = require("path");
const { promises: fsPromises } = require("fs");
const multer = require("multer");

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

//исп этот middleware для того что бы из файла вытянуть
//расширение и при сохраннени на сервере его расширение
//было сохранено
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/tmp");
  },
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage }); //куда будет сохр файл
//для загрузки фото
//минификация файла
async function minifyImage(req, res, next) {
  const files = await imagemin([`public/tmp/${req.file.filename}`], {
    destination: "public/images",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  await fsPromises.unlink(req.file.path);

  next();
}

function returnImage(req, res) {
  return res.status(200).json(req.file);
}

module.exports = {
  minifyImage,
  returnImage,
  upload,
};
