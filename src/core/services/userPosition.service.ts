import { Position } from '../models/position.interface';

export class UserPositionService {

    constructor() {

    }

    /**
   * Gets current user position
   * @returns current user position 
   */
    getCurrentUserPosition(): Promise<Position> {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position: Position) => {
                resolve(position);
              },
              () => {
                reject('error');
                console.error(this.handleLocationError(true));
              }
            )
          } else {
            reject('error');
            console.error(this.handleLocationError(false));
          }
        });
    }

    /**
   * Handles location error
   * @param browserHasGeolocation 
   */
    private handleLocationError(browserHasGeolocation: boolean): string {
        return browserHasGeolocation ?
            "Error: The Geolocation service failed"
            : "Error: Your browser doesn't support geolocation.";
    }
}