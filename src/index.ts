import './style.scss';

// Custom Components
import { ModalComponent } from './Components/modal/modal.component';
import { ComponentSelect } from './Components/Select/select.component';

// Services
import { HTTPWeatherApiReq } from './core/services/weatherAPI.service';
import { UserPositionService } from './core/services/userPosition.service';

// Interfaces
import { WeatherData } from './core/models/weatherData.interface';

// Services
export const positionService = new UserPositionService();
export const weatherReq = new HTTPWeatherApiReq();

// Elements from DOM
export const temperatureElem: HTMLDivElement = document.querySelector('.temp');
export const descriptionOfTemperatureElem: HTMLDivElement = document.querySelector('.additionForTemp');
export const iconWrapper: HTMLDivElement = document.querySelector('.icon-wrapper');


document.addEventListener('DOMContentLoaded', () => {
    // Обьявление компонента select
    customElements.define('component-select', ComponentSelect);

    // Обьявление компонента модалки
    customElements.define('modal-component', ModalComponent);

    positionService.getCurrentUserPosition()
        .then((position) => weatherReq.getWeatherByCoords(position))
        .then((response) => response.json())
        .then((weather) => {         
            const optionElem = document.createElement('option');

            let selectedItem = document.querySelector('option[slot="selected"]');
            selectedItem.slot = "item";

            optionElem.slot = "selected";
            optionElem.innerHTML = weather.name;
            optionElem.title = "This is your current location";
            optionElem.id = "userCurrentPosition";

            selectedItem.before(optionElem);

            let temp = Math.round(weather.main.temp);
            temperatureElem.innerHTML = `<p><b>${temp}</b> C</p>`;

            let desc = weather.weather[0].description.split(' ')
                .map((word: string) => word[0].toUpperCase() + word.substring(1)).join(' ');
            descriptionOfTemperatureElem.innerHTML = `<p>${desc}</p>`;
            
            return weather.weather[0].icon;

        }).then((icon: string) => {
            return weatherReq.getIconOfWeather(icon)
        })
        .then((response) => response.blob())
        .then((icon) => {
            if (!(iconWrapper.querySelector('img'))) {
                let img = document.createElement('img');
                iconWrapper.append(img);
                img.alt = "weather icon";
                img.src = URL.createObjectURL(icon);
            } else {
                let img = iconWrapper.querySelector('img');
                img.src = URL.createObjectURL(icon);
            }
        });

    // Запись последнего выбранного города в Local Storage
    window.addEventListener('beforeunload', () => {
        let weather: WeatherData = JSON.parse(window.sessionStorage.getItem('weather'));
        window.localStorage.setItem('city', weather.name);
    });
})
