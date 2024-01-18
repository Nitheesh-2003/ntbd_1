const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file1'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    const filePath = path.join(__dirname, 'public', req.file.originalname);

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(fileContent);
    const capitals = [];
    $('#main ul li').each((index, element) => {
        const capitalTag=$(element).find('strong');
        const spanTag=$(element).find('span');
        const capital=capitalTag.text().trim();
        const state=spanTag.text().trim();
        capitals.push({capital : capital,state : state})
    });
    const summary={
        numberOfCapitals : capitals.length
    };
    const jsonFile=path.join(__dirname,'public','result.json')
    fs.writeFileSync(jsonFile,'');
    fs.appendFileSync(jsonFile,JSON.stringify({capitals : capitals,summary : summary}))
    res.status(200).sendFile(jsonFile);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
