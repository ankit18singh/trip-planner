import { Constants } from '../helper/constants';
import { Utility } from '../helper/utility';
import { ICity, IContID, ICoordinate, IWorldMap } from '../models/cities';

export class TripService {

    private static instance: TripService;
    private filteredCities: ICity[]
    private worldMap: IWorldMap[]

    private constructor() {
        this.filteredCities = Utility.getCities()
        this.worldMap = this.groupCitiesBasedOnContinents()
    }

    public static getInstance(): TripService {
        if (!TripService.instance) {
            TripService.instance = new TripService()
        }

        return TripService.instance
    }
    
    private groupCitiesBasedOnContinents(): IWorldMap[] {
        const worldMap = this.filteredCities.reduce((acc: IWorldMap[], item: ICity) => {
            if (item) {
                const continent = acc.find((map: IWorldMap) => map.continent === item.contId)
                if (continent) {
                    continent.countries.push(item)
                } else {
                    const newEntry: IWorldMap = {
                        continent: item.contId,
                        countries: [item]
                    }
                    acc.push(newEntry)
                }
            }
            return acc
        }, [])

        return worldMap
    }

    public getCities(): ICity[] {
        return this.filteredCities
    }

    public getWorldMap(): IWorldMap[] {
        return this.worldMap
    }

    public createTrip(city: string) {
        let currentCity = null
        const acc = []
        this.worldMap.forEach((map: IWorldMap) => {
            const selectedCity = map.countries.find(item => item.name === city)
            if (selectedCity) {
                currentCity = selectedCity
            }
        })

        let tempShortestCity = null
        const shortestCityArray = []
        this.worldMap.filter((item: IWorldMap) => item.continent !== currentCity.contId).forEach((mapItem: IWorldMap) => {
            let shortest = null
            let city = null
            mapItem.countries.forEach((item: ICity) => {
                const distance = Utility.searchShortedDistance(currentCity.location.lat, currentCity.location.lon, item.location.lat, item.location.lon)
                if (!shortest) {
                    shortest = distance
                    city = item
                } else {
                    const currentShortest = shortest;
                    const currentShortestCity = city;
                    shortest = currentShortest < distance ? currentShortest : distance
                    city = currentShortest < distance ? currentShortestCity : item
                }

                tempShortestCity = city
            })
            shortestCityArray.push(tempShortestCity)
            console.log(city.name, city.contId, shortest)
        })
        
        acc.push(currentCity, ...shortestCityArray, currentCity)

        return acc
    }
}