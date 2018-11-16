const express = require('express');
const alasql = require('alasql');
const bodyParser = require('body-parser');
const multer = require('multer');

const port = process.env.PORT || 3000;

let upload = multer();
let uploadSingle = multer({dest: 'uploads/'});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let nameWithoutExtension = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, nameWithoutExtension + Date.now() + ext)
  }
});
const uploadStorage = multer({storage: storage});

let app = express();

app.post('/csvtoxlsx', uploadStorage.single('file'), (req, res) => {

  console.log(req.file);
  let delimeter = req.body.delimeter;
  let path = req.file.path;
  let originalname = req.file.originalname;
  console.log(path);

  alasql.promise('select * from csv(?,{separator:?})', [path, delimeter])
    .then(function (data) {
      //console.log(data);
      console.log('csv file readed');
      let timeInMiliseconds = Date.now();
      let xlsx = "./results/" + originalname + "-" + timeInMiliseconds + ".xlsx";
      alasql.promise('SELECT * INTO XLSX(?,{headers:true}) from ?', [xlsx, data])
        .then(function (e) {
          console.log('Data saved into xlsx ');
          res.status(200).download(xlsx);
        }).catch(showError);
    }).catch(showError);

  //res.status(200).download('./app.js')
});

app.post('/csvtoxls', uploadStorage.single('file'), (req, res) => {

  console.log(req.file);
  let delimeter = req.body.delimeter;
  let path = req.file.path;
  let originalname = req.file.originalname;
  console.log(path);

  alasql.promise('select * from csv(?,{separator:?})', [path, delimeter])
    .then(function (data) {
      //console.log(data);
      console.log('csv file readed');
      let timeInMiliseconds = Date.now();
      let xls = "./results/" + originalname + "-" + timeInMiliseconds + ".xls";
      alasql.promise('SELECT * INTO XLS(?,{headers:true}) from ?', [xls, data])
        .then(function (e) {
          console.log('Data saved into xls ');
          res.status(200).download(xls);
        }).catch(showError);
    }).catch(showError);

  //res.status(200).download('./app.js')
});

app.post('/xlstocsv', uploadStorage.single('file'), (req, res) => {
  console.log(req.file);
  let path = req.file.path;
  let originalname = req.file.originalname;
  console.log(path);

  alasql.promise('select * from xls(?)', [path])
    .then(function (data) {
      console.log(data);
      console.log('xls file readed');
      let timeInMiliseconds = Date.now();
      let csv = "./results/" + originalname + "-" + timeInMiliseconds + ".csv";
      alasql.promise('SELECT * INTO CSV(?) from ?', [csv, data])
        .then(function (e) {
          console.log('Data saved into csv ');
          res.status(200).download(csv);
        }).catch(showError);
    }).catch(showError);

  //res.status(200).download('./app.js')
});

app.post('/xlsxtocsv', uploadStorage.single('file'), (req, res) => {
  console.log(req.file);
  let path = req.file.path;
  let originalname = req.file.originalname;
  console.log(path);

  alasql.promise('select * from xlsx(?)', [path])
    .then(function (data) {
      console.log(data);
      console.log('xlsx file readed');
      let timeInMiliseconds = Date.now();
      let csv = "./results/" + originalname + "-" + timeInMiliseconds + ".csv";
      alasql.promise('SELECT * INTO CSV(?) from ?', [csv, data])
        .then(function (e) {
          console.log('Data saved into xlsx ');
          res.status(200).download(csv);
        }).catch(showError);
    }).catch(showError);

  //res.status(200).download('./app.js')
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Started on ${port} port`);
});

function showError(err) {
  console.log('Error', err);
}