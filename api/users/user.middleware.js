const https = require("https");
const fetch = require("node-fetch");
const imageminJpegtran = require("imagemin-jpegtran");

const path = require("path");
const fs = require("fs");
const { promises: fsPromises } = require("fs");

const { AvatarGenerator } = require("random-avatar-generator");
const multer = require("multer");

const imagemin = require("imagemin");
const imageminSvgo = require("imagemin-svgo");

const UserModel = require("./user.model");

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

  const url = `${generatAvatarUrl}`;

  const get_data = async url => {
    try {
      const response = await fetch(url)
        .then(res => res.text())
        .then(body => {
          console.log("body", body);
          const newNameAvatar = Date.now() + ".svg";
          console.log("newNameAvatar", newNameAvatar);
          fs.writeFileSync(`${pathTmp}/${newNameAvatar}`, body, err => {
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
    const file = await imagemin(["public/tmp/*.svg"], {
      destination: "public/images",
      plugins: [imageminSvgo()],
    });
    console.log("files", file);

    next();
  } catch (err) {
    console.error("err minifyImage", err);
  }
}

async function minifyImageDownload(req, res, next) {
  try {
    const file = await imagemin(["public/tmp/*.jpg"], {
      destination: "public/images",
      plugins: [imageminJpegtran()],
    });
    await fsPromises.unlink(req.file.path);
    next();
  } catch (err) {
    console.error("err minifyImage", err);
  }
}

async function updateUserUrl(req, res) {
  try {
    const { filename } = req.file;
    const { _id } = req.user;
    const urlAvatar = `http://localhost:3000/images/${filename}`;
    const findUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        $set: { avatarURL: urlAvatar },
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      user: {
        avatarURL: findUser.avatarURL,
      },
    });
  } catch (err) {
    console.error("err updateUserUrl: ", err);
  }
}

module.exports = {
  minifyImage,
  upload,
  generatorAvatar,
  minifyImageDownload,
  updateUserUrl,
};
