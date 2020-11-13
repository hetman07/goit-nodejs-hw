const https = require("https");
const got = require("got");
const getFileType = require("file-type");
const path = require("path");
const fs = require("fs");
const { promises: fsPromises } = require("fs");

const multer = require("multer");

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const UserRandomAvatar = require("./user.generator");
const pathTmp = path.join(__dirname, "../../public/tmp/avatar.jpg");
console.log("pathTmp***", pathTmp);
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
    const generatAvatarUrl = UserRandomAvatar;

    const request = await https.get(
      `https://avataaars.io/?accessoriesType=Sunglasses&avatarStyle=Circl
    e&clotheColor=PastelYellow&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Ra
    isedExcited&facialHairColor=Blonde&facialHairType=BeardMedium&hairColor=SilverGr
    ay&hatColor=Black&mouthType=Disbelief&skinColor=Brown&topType=WinterHat2`,
      res => {
        console.log("res: ", res.statusCode);
        console.log("res: ", res.headers);
        console.log("res: ", res.pipe);

        const downloadFile = fs.writeFile(generatAvatarUrl, err => {
          if (err) throw err;
        });

        //fs.writeFileSync(pathTmp, res);

        console.log("downloadFile", downloadFile);
      },
    );
  } catch (err) {
    console.log(err);
  }
  console.log("start");

  // const file = got(generatAvatarUrl)
  //   .then(response => console.log(response.body))
  //   .catch(error => console.log(error.response.body));
  // console.log(file);

  next();
}
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
  generatorAvatar,
};
