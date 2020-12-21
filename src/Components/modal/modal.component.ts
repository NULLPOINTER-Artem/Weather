import { dateService } from '../../core/services/date.service'
import { WeatherData } from '../../core/models/weatherData.interface';

let arrowIcon = require('../../../assets/arrow.png');
let pressure = require('../../../assets/pressure.png');

export class ModalComponent extends HTMLElement {
    dateService = new dateService();

    constructor() {
        super()
    }

    /**
     * parses current date,
     * returns formatted date for modal
     * @param date current date
     */
    private getFormattedDate(date: Date) {
        const monthDayOption = {
            month: 'short',
            day: 'numeric',
        }

        const monthDay = date.toLocaleString('en-US', monthDayOption);

        let hours = date.getHours();
        let minutes: String = new String(date.getMinutes());
        let ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12;

        minutes = Number.parseInt(minutes.toString()) < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}, ${monthDay}`;
    }

    /**
     * Sets data on modal window
     * @returns function for add data on details block of the Modal Window
     */
    private setDetailsOnModalWindow(): Function {
        let details: HTMLUListElement = this.shadowRoot.querySelector<HTMLUListElement>('.details-list');

        return (text: string, img?: HTMLImageElement) => {
            let li = document.createElement('li');

            if (img) {
                li.append(img);

                let span = document.createElement('span');
                span.innerHTML = text;

                li.append(span);
            } else {
                li.innerHTML = text;
            }

            details.append(li);
        }
    }

    /**
     * Chooses direction of wind
     * @param deg 
     * @returns direction of wind 
     */
    private chooseDirectionOfWind(deg: number): string {
        let direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];

        if (deg >= 180) {
            deg = deg - 180;
        } else {
            deg = deg + 180;
        }

        let w = Math.round(deg / 45);

        return direction[w];
    }

    /**
     * Creates new image
     * @param URL 
     * @param alt 
     * @param width 
     * @param height 
     * @param [rotate] 
     * @param [deg] 
     * @returns new image 
     */
    private createNewImage(URL: string, alt: string, 
        width: string, height: string, 
        top?: string, left?: string,
        rotate?: boolean, deg?: number): HTMLImageElement {
        let img = document.createElement('img');

        img.src = URL;
        img.alt = alt;

        img.style.width = width;
        img.style.height = height;

        img.style.top = top;
        img.style.left = left;

        if (rotate) {
            img.style.transform = `rotate(${deg}deg)`;
        }

        return img;
    }

    connectedCallback() {
        const weather: WeatherData = JSON.parse(window.sessionStorage.getItem('weather'));
        const iconUrl: string = window.sessionStorage.getItem('weather-icon');
        const date = this.getFormattedDate(this.dateService.getCurrDate(weather?.dt));

        this.attachShadow({
            mode: "open"
        });

        let template: HTMLTemplateElement = document.querySelector<HTMLTemplateElement>('#modalWindow');
        let clonedTemplateContent = template.content.cloneNode(true);
        this.shadowRoot.append(clonedTemplateContent);


        let time: HTMLDivElement = this.shadowRoot.querySelector('.time');
        time.innerHTML = `<time>${date}</time>`;

        let loc: HTMLDivElement = this.shadowRoot.querySelector('.location');
        loc.innerHTML = `<b>${weather?.name}, ${weather?.sys.country}</b>`;

        let weatherImg: HTMLImageElement = this.createNewImage(
            iconUrl, "weather icon", "50px", "50px"
        );
        this.shadowRoot.querySelector('.icon-wrapper').append(weatherImg);

        let temp = Math.round(<number>weather?.main.temp);
        this.shadowRoot.querySelector('.temp').innerHTML = `<p><b>${temp}&deg</b> C</p>`;

        this.shadowRoot.querySelector('.description')
            .innerHTML = `<b>Feels like ${Math.round(weather?.main.feels_like)}&deg
             C. ${weather?.weather[0].main}. ${weather?.weather[0].description}</b>`;


        let { rain, snow, wind, main, visibility } = weather;

        let addData: Function = this.setDetailsOnModalWindow();

        if (rain) {
            addData(<string>rain["1h"] + 'mm/h', this.createNewImage(
                iconUrl, "weather-image", "30px", "30px", "-5px", "-28px"
            ));
        } else if (snow) {
            addData(<string>snow["1h"] + 'mm/h', this.createNewImage(
                iconUrl, "weather-image", "30px", "30px", "-8px", "-28px"
            ));
        }

        addData(<string>wind.speed + 
            ` m/s ${this.chooseDirectionOfWind(wind.deg)}`, this.createNewImage(
                arrowIcon.default, "arrow-image", "15px", "15px", "-1px", "-21px", true, wind.deg
            ));
        addData(<string>main.pressure + ' hPa', this.createNewImage(
            pressure.default, "pressure-image", "20px", "20px", "-5px", "-24px"
        ));
        addData('Humidity: ' + <string>main.humidity + '%');
        addData('Dew point: ' + new String(Math.round(<number>main.temp)) + '&deg C');
        addData('Visibility: ' + new String(<number>visibility / 1000) + 'km');

        
        new Promise((resolve, reject) => {
            setTimeout(() => {
                this.style.opacity = '1';
                resolve('done!')
            }, 400);
        })
    }

    disconnectedCallback() { }

    static get observedAttributes() {
        return [''];
    }

    attributeChangedCallback(name: string, prev: string, curr: string) {
    }
}