const express = require('express');
const app = express();
const cors = require('cors');
// var sha1 = require('sha1');
// var signature = sha1(payload_to_sign + '0Yo9E-Rs8OoiKgFbULlkrN82IYc');
const { cloudinary } = require('./utils/cloudinary');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/models/galary', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:interviewFolder')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});

app.post('/', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'interview',
        });
        console.log(uploadResponse);
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post('/models/delete', (req, res) => {
    const imageSample = req.body.data
    console.log(imageSample)
    cloudinary.uploader.destroy(imageSample, function (error, result) {
        console.log(result, error)
    });

});



// app.post(POST /:resource_type/destroy)
//to delete resources
// cloudinary.v2.uploader.destroy('sample', function(error,result) {
//     console.log(result, error) });

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});