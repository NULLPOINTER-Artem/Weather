import { Position } from '../models/position.interface';

// import URL constants
import { environment as baseIconURL } from '../../environments/icon';
import { environment as baseWeatherURL } from '../../environments/weather';
import { id } from '../../environments/appid';

export class HTTPWeatherApiReq {

  constructor() {
  }

  /**
     * Gets weather by coords
     * @param position 
     * @returns weather by coords 
     */
  getWeatherByCoords(position: Position): Promise<Response> {
    let fetchedWeather: Promise<Response> = null;

    try {
      fetchedWeather = fetch(baseWeatherURL.baseURL +
        `lat=${position.coords.latitude}&lon=${position.coords.longitude}&` +
        `units=metric&appid=${id}`);
    } catch (error) {
      throw Error('Error occured with fetch data of weather by coords -> ' + error);
    }

    return fetchedWeather;
  }

  /**
   * Gets weather by city name
   * @param city 
   * @returns  
   */

  getWeatherByCityName(city: string): Promise<Response> {
    let fetchedWeather: Promise<Response> = null;

    try {
      fetchedWeather = fetch(baseWeatherURL.baseURL + `q=${city}&units=metric&appid=${id}`);
    } catch (error) {
      throw Error('Error occured with fetch data of weather by city name -> ' + error);
    }

    return fetchedWeather;
  }

  /**
 * Gets icon of weather
 * @param icon 
 * @returns icon of weather 
 */
  getIconOfWeather(icon: string): Promise<Response> {
    let fetchedIconOfWeather: Promise<Response> = null;

    try {
      fetchedIconOfWeather = fetch(baseIconURL.baseURL + `${icon}@2x.png`);
    } catch (error) {
      throw Error('Error occured with fetch icon of weather -> ' + error);
    }

    return fetchedIconOfWeather;
  }
  
}