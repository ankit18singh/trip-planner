import { ICity } from '../models/cities';
import CITY_LIST from '../../../assets/json/cities.json';
import { Constants } from './constants';


export class Utility {

    /**
     * Utility method to get a cleaned data set of cities for better search result.
     * @returns 
     */
    static getCities(): ICity[] {
        const keys = Object.keys(CITY_LIST)
        const filteredArray = keys.reduce((acc, item) => { 
            if (item && CITY_LIST[item]) {
            acc.push(CITY_LIST[item])
            }
            return acc
        }, []);

        return filteredArray as ICity[]
    }

    /**
     * Utility method to search shortest distance between two location.
     * @link https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/27943#27943
     * @param latOne 
     * @param longOne 
     * @param latTwo 
     * @param longTwo 
     * @returns 
     */
    static searchShortedDistance(latOne: number, longOne: number, latTwo: number,longTwo: number): number {
        const radius = Constants.RADIUS_OF_EARTH
        const dLat = this.degreeToRadius(latTwo-latOne);  // this.degreeToRadius below
        const dLon = this.degreeToRadius(longTwo-longOne); 
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.degreeToRadius(latOne)) * Math.cos(this.degreeToRadius(latTwo)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = radius * c; // Distance in km
        return distance;
    }

    static degreeToRadius(degree: number) {
        return degree * (Math.PI/180)
    }
}