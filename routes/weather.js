const router = require('express').Router();
const verify = require('../middleware/verifyToken');
const axios = require('axios');


router.post('/weather/:cityName', verify, (req, res) => {
    let cityName = req.params.cityName;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_KEY}`)
        .then(data => {
            const iconWeather = data.data.weather[0].icon;
            console.log(data);
            res.send({
                data: data.data,
                icon_url: `http://openweathermap.org/img/w/${iconWeather}.png`
            });
        })
        .catch((error) => {
            res.send(error.message);
        });
});

module.exports = router;