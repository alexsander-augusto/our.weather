navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=852f2b5ce7220437613706d469459185&units=metric&lang=pt_br`;

    let results = await fetch(url);
    let json = await results.json();

    showInfo({
        name: json.name,
        country: json.sys.country,
        temp: json.main.temp.toFixed(0),
        feels_like: json.main.feels_like.toFixed(0),
        tempIcon: json.weather[0].icon,
        windSpeed: json.wind.speed,
        tempDescription: json.weather[0].description,
        humidity: json.main.humidity
    });
});

document.querySelector('.busca').addEventListener('submit', async (event) => {
    event.preventDefault();

    let input = document.querySelector('#searchInput').value;

    if(input !== '') {
        clearInfo();
        showWarning('Carregando...');

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=852f2b5ce7220437613706d469459185&units=metric&lang=pt_br`;

        let results = await fetch(url);
        let json = await results.json();

        if(json.cod === 200) {
            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp.toFixed(0),
                feels_like: json.main.feels_like.toFixed(0),
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                tempDescription: json.weather[0].description,
                humidity: json.main.humidity
            });
        } else {
            clearInfo();
            showWarning('Localização não encontrada.')
        } 
    } else {
        clearInfo();
    }
});

function showInfo(json) {
    showWarning('');

    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.tempInfo').innerHTML = `${json.temp} <sup>ºC</sup>`;
    document.querySelector('.feels_likeInfo').innerHTML = `${json.feels_like} <span>ºC</span>`;
    document.querySelector('.humidityInfo').innerHTML = `${json.humidity} <span>%</span>`;
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;

    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.date').innerHTML = getDate();
    document.querySelector('.tempDescription').innerHTML = json.tempDescription;

    document.querySelector('.resultado').style.display = 'block';
}

function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}

const daysWeek = [
    'Segunda-feira', 
    'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 
    'Sexta-feira', 
    'Sábado', 
    'Domingo'
];

function getDate() {
    const date = new Date();

    let indexDay = date.getDay();
    let day = daysWeek[indexDay - 1];

    let hour = date.getHours();
    let minute = date.getMinutes();
    minute <= 9 ? minute = '0' + minute : minute;
    
    let fullHour = hour + ':' + minute;

    return `${day}, ${fullHour}`;
};