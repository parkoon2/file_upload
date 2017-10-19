let express = require('express');
let router = express.Router();
let multiparty = require('multiparty');
let fs = require('fs');
let path =require('path');

/* GET home page. */

router.post('/', function(req, res, next) {

      let form = new multiparty.Form();

      // get field name & value
      form.on('field',function(name,value){

           console.log('normal field / name = '+name+' , value = '+value);

      });

      // file upload handling
      form.on('part',function(part){

           let filename = part.filename || part.resume();
           let size = part.byteCount || part.resume();
           

           console.log("Write Streaming file :"+filename);

           checkTmpDir();
        
           let writeStream = fs.createWriteStream(path.join(__dirname, `../tmp/${filename}`));

           writeStream.filename = filename;
           part.pipe(writeStream);

           part.on('data', function (chunk) {

               //  console.log(filename+' read '+chunk.length + 'bytes');

           });

           part.on('end', function () {

                 console.log(filename+' Part read complete');
                 writeStream.end();

           });

      });

      // all uploads are completed
      form.on('close',function () {

           res.status(200).send('Upload complete');

      });

      // track progress
      form.on('progress', function (byteRead,byteExpected) {

          // console.log(' Reading total  '+byteRead+'/'+byteExpected);

      });

      form.parse(req);

});

function checkTmpDir () {
    let isTmpExist;
    fs.readdir(path.join(__dirname, '../'), function (err, files) {
        files.forEach(function(file) {
            if (file !== 'tmp') {
                isTmpExist = false;
                console.log(isTmpExist)
            } else {
                isTmpExist = true;
            }
        })
        if (!isTmpExist) fs.mkdir('./tmp', function (err) { console.log(err) });
    
    })

    
}

 

module.exports = router;
