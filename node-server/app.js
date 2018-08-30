const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const basePath = path.join(__dirname + "/dist");
const cors=require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.get(`/`, (req, res) => {
    let linkList = "";
    let resPage = fs.readFileSync("links.html", "utf-8");
    console.log(resPage);
    fs.readdir(basePath, (err, files) => {
        files.forEach((file) => {
            linkList += `<li><a href="/${file}" target="blank">${file}</a></li>`;
        })
        res.send(resPage.replace("placeHolder", linkList));
    });

});

fs.readdir(basePath, (err, files) => {
    files.forEach((file) => {
        app.use(express.static(`${basePath}/${file}`));
        app.get(`/${file}`, (req, res) => {
            res.sendFile(`${basePath}/${file}/index.html`);
        });
    })
});



app.post("/api/user", (req, res) => {
    let userList = require('./user.json');
   
        //Validate ID
        let total = 0;
        let isValid = true;
        let tz = req.body["tz"];

        for (i = 0; i < 9; i++) {
            let x = (((i % 2) + 1) * tz[i]);
            total += Math.floor(x / 10) + x % 10;
        }
        if (total % 10 != 0)
            isValid = false;
   
        //Validate Age
        if (req.body["age"] < 0 || req.body["age"] > 120)
            isValid = false;
        //Validate name length
        if (req.body["name"].length < 3 || req.body["name"] > 15)
            isValid = false;
        //Validate isMale

        if (typeof JSON.parse(req.body["isMale"]) != "boolean");
        isValid = false;
        //Validate Countries
        let countryList = require('./countries.json');
        if (!countryList.includes(req.body["country"]))
            isValid = false;
            if(isValid==true)
            {
                userList.push(req.body);
                fs.writeFileSync("user.json", JSON.stringify(userList));
                res.status(201).send(JSON.stringify(userList));
            }
            else res.status(400).send();
    

    

})


const port = process.env.PORT || 3500;
app.listen(port, () => { console.log(`OK`); });
