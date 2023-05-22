
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer');
const cors = require('cors')
const upload = multer();
const fileUpload = require('express-fileupload');
const  AWS = require('aws-sdk');
const dotenv = require('dotenv');

const s3 = new AWS.S3({
  region: 'eu-north-1',
  apiVersion: '2006-03-01',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

app.use(fileUpload());
app.use(cors())
app.use(express.json())



app.get('/', async (req, res) => {
  
  const bucketParams = {
    Bucket : 'aptrebucket',
  };
  console.log('GET')
  const objects = []; // korjaa tyyppi
  let fileNameArray = [];
  
  await s3.listObjects(bucketParams, async function (err, data) {
    if(err)throw err;
    const array =  data.Contents.map((object) => object.Key);
    array.forEach((element) => {
      fileNameArray.push(element)
    });

   await fileNameArray.forEach((name, index) => {
      let params = {Bucket: bucketParams.Bucket, Key: name}
      
       s3.getObject(params, async function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } 
        else {
          console.log('INDEX', index)
          console.log('OBJECTS', objects);
          await objects.push({key: name, file: data});
          if(index === 3 ){

            console.log('INDEX', index, "arrayLength:", fileNameArray.length, objects, "FILENAMEARRAY", fileNameArray)
            await  res.status(200).send(objects);
           
          }
        }         
      });
    })
    console.log('Haloo, ', objects)
  
  });
});

app.post('/file', async function(req,res){
    console.log('REQ1', req.files.file);
    const file = req.files.file;
    await s3.upload({
        Bucket: "aptrebucket",
        Key: file.name,
        Body: file.data,
      }).promise();

    return res.status(200).send("It's working");
});


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

