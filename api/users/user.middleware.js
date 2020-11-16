const https = require("https");
const got = require("got");
const getFileType = require("file-type");
const path = require("path");
//const fs = require("fs");
const { promises: fsPromises } = require("fs");

const { AvatarGenerator } = require("random-avatar-generator");
const multer = require("multer");

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

//const UserRandomAvatar = require("./user.generator");
const pathTmp = path.join(__dirname, "../../public/tmp/avatar.svg");
const pathImg = path.join(__dirname, "../../public/images");

console.log("pathTmp***", pathTmp);
console.log("pathImg***", pathImg);

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

async function generatorAvatar(req, res, next) {
  try {
    const generator = new AvatarGenerator();
    let generatAvatarUrl = "";
    // Simply get a random avatar
    generatAvatarUrl = generator.generateRandomAvatar();

    console.log("generatAvatarUrl", generatAvatarUrl);

    const request = await https
      .get(`${generatAvatarUrl}`, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", async () => {
          await fsPromises.writeFile(pathTmp, data, err => {
            if (err) {
              console.log("err: ", err);
            } else {
              console.log("File written successfully\n");
            }
          });
        });
      })
      .on("error", err => {
        console.log("Error: " + err.message);
      });
  } catch (err) {
    console.log("error: ", err);
  }

  next();
}

//для загрузки фото
//минификация файла
async function minifyImage(req, res, next) {
  console.log("pathTmp***", pathTmp);
  const files = await imagemin([`${pathTmp}`], {
    destination: `${pathImg}`, //куда сохр. файл

    use: [
      imageminSvgo({
        plugins: [{ removeViewBox: false }],
      }),
    ],
  });
  console.log(files);
  //await fsPromises.unlink(req.file.path);

  next();
}

function returnImage(req, res) {
  return res.status(200).send(res.data);
}

module.exports = {
  minifyImage,
  returnImage,
  upload,
  generatorAvatar,
};
