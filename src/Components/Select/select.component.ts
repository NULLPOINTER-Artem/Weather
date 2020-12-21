import { weatherReq, temperatureElem, descriptionOfTemperatureElem, iconWrapper } from '../../index';
import { ModalComponent } from '../modal/modal.component';

export class ComponentSelect extends HTMLElement {
    constructor() {
        super();
    }

    selectedIndex: number;

    /**
     * Sets selected index
     * @param option 
     */
    private setSelectedIndex(option: HTMLCollection): void {
        [].forEach.call(option, (item: HTMLOptionElement, index: number): void => {
            if (item.slot == "selected") {
                this.selectedIndex = index;
            }
        })
    }

    /**
     * Deletes modal window
     */
    private deleteModalWindow() {
        new Promise((resolve) => {
            let modal: ModalComponent = document.querySelector('modal-component');

            if (modal) {
                modal.style.opacity = "0";
                modal.style.transition = "opacity 1s";

                setTimeout(() => {
                    modal.remove(); // remove from DOM
                    modal = null; // remove link on the object of Modal Window
                    resolve(true); // complete Promise
                }, 1000);
            }
        })
    }

    /**
     * Changes selected slot on any name slot of the template
     * @param slotName 
     * @param option 
     * @param selectedSlot 
     */
    private changeSelectedSlotOn(
        slotName: string,
        option: HTMLCollection,
        selectedSlot: HTMLSlotElement): void {
        option[this.selectedIndex].slot = slotName;

        selectedSlot.slot = "selected"
    }

    /**
     * Toggles list of options
     */
    private toggleListOfOptions(): void {
        this.shadowRoot.querySelector('.dropdown-list').classList.toggle('closed');
    }

    connectedCallback() {
        this.attachShadow({
            mode: "open"
        });

        const template: HTMLTemplateElement = document.querySelector<HTMLTemplateElement>('#dropdown');
        const content = template.content.cloneNode(true);
        this.shadowRoot.append(content);

        const option = document.querySelector('#city').children;

        this.setSelectedIndex(option);

        this.shadowRoot.querySelector<HTMLSlotElement>('slot[name="last-item"]')
            .onclick = (e: MouseEvent) => {
                this.changeSelectedSlotOn("last-item", option, e.target as HTMLSlotElement);

                this.setSelectedIndex(option);

                this.toggleListOfOptions();
            }

        this.shadowRoot.querySelector<HTMLSlotElement>('slot[name="item"]')
            .onclick = (e: MouseEvent) => {
                this.changeSelectedSlotOn("item", option, e.target as HTMLSlotElement);

                this.setSelectedIndex(option);

                this.toggleListOfOptions();
            }

        this.shadowRoot.querySelector('slot[name="selected"]')
            .addEventListener('slotchange', (e) => {
                let selectedCity = (option[this.selectedIndex] as HTMLOptionElement).text;

                weatherReq.getWeatherByCityName(selectedCity)
                    .then((response) => response.json())
                    .then((weather) => {
                        this.deleteModalWindow();

                        let temp = Math.round(weather.main.temp);
                        temperatureElem.innerHTML = `<p><b>${temp}&deg</b> C</p>`;

                        let desc = weather.weather[0].description.split(' ')
                            .map((word: string) => word[0].toUpperCase() + word.substring(1)).join(' ');
                        descriptionOfTemperatureElem.innerHTML = `<p>${desc}</p>`;

                        /* Set current data of weather into Session Storage */
                        window.sessionStorage.setItem('weather', JSON.stringify(weather));

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

                        window.sessionStorage.setItem('weather-icon', URL.createObjectURL(icon));
                    }).then(() => {
                        // create new Modal Window for new information of Weather
                        let newModal: ModalComponent = new ModalComponent();
                        document.querySelector('.content-wrapper').after(newModal);
                    })
            })

        this.shadowRoot.querySelector<HTMLSlotElement>('slot[name="selected"]')
            .onclick = () => {
                this.toggleListOfOptions();
            }
    }

    disconnectedCallback() { }

    static get observedAttributes(): Array<string> {
        return [];
    }

    attributeChangedCallback(attName: string, attPreVal: string, attCurrVal: string) {
    }
}