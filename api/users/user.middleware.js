const https = require("https");
const fetch = require("node-fetch");

const path = require("path");
const fs = require("fs");
const { promises: fsPromises } = require("fs");

const { AvatarGenerator } = require("random-avatar-generator");
const multer = require("multer");

const imagemin = require("imagemin");
const imageminSvgo = require("imagemin-svgo");

const pathTmp = path.join(__dirname, "../../public/tmp");
const pathImg = path.join(__dirname, "../../public/images");

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
  const generator = new AvatarGenerator();
  let generatAvatarUrl = "";
  // Simply get a random avatar
  generatAvatarUrl = await generator.generateRandomAvatar();
  console.log("generatAvatarUrl", generatAvatarUrl);

  const url = `${generatAvatarUrl}`;

  const get_data = async url => {
    try {
      const response = await fetch(url).then(data => {
        const newNameAvatar = Date.now() + ".svg";
        console.log("newNameAvatar", newNameAvatar);
        fs.writeFileSync(`${pathTmp}/${newNameAvatar}`, data, err => {
          if (err) {
            console.log("err: ", err);
          } else {
            console.log("File written successfully\n");
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  await get_data(url);

  next();
}

//для загрузки фото
//минификация файла
async function minifyImage(req, res, next) {
  try {
    const delFile = await fsPromises.readdir(pathTmp, err => {
      if (err) {
        console.error("error ReadDIR", err);
      }
    });
    console.log("delFile: ", delFile);

    const files = await imagemin(["public/tmp/*.svg"], {
      destination: "public/images",
      plugins: [imageminSvgo()],
    });
    console.log("files", files);

    delFile.map(async file => await fsPromises.unlink(`${pathTmp}/${file}`));

    next();
  } catch (err) {
    console.error("err minifyImage", err);
  }
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
