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
        const acc = []
        const currentCity = this.filteredCities.find((map: ICity) => map.id === city)
        const pendingCities = this.filteredCities
        const shortestCityArray = this.nextShortest(currentCity, pendingCities, acc, currentCity)
        shortestCityArray.push(currentCity)
        shortestCityArray.unshift(currentCity)
        return shortestCityArray
    }

    // Select a city
    // Search from all the continents except that country
    // create a new filtered location
    // Find the nearest continent store it to array
    // Set that city as current city
    // repeat till filtered locaiton is empty
    private nextShortest(currentLocation: ICity, remainingLocations: ICity[], resultArray: any[], baseCity: ICity) {
        const pendingLocations = remainingLocations.filter((location: ICity) => location.contId !== currentLocation.contId)
        if (!pendingLocations.length) {
            const last = resultArray[resultArray.length - 1]
            const distance = Utility.searchShortedDistance(
                last.location.lat, 
                last.location.lon, 
                baseCity.location.lat, 
                baseCity.location.lon
            )
            baseCity.distance = distance
            return resultArray
        }

        const tempCurrentLocation = currentLocation
        let tempShortestCity = null
        let shortestDistance = null;
        let shortestDistantCity = null;
        pendingLocations.forEach((city: ICity) => {
            const distance = Utility.searchShortedDistance(
                tempCurrentLocation.location.lat, 
                tempCurrentLocation.location.lon, 
                city.location.lat, 
                city.location.lon
            )
            if (!shortestDistance) {
                shortestDistance = distance
                shortestDistantCity = city
            } else {
                const currentShortest = shortestDistance
                const currentShortestCity = shortestDistantCity
                shortestDistance = currentShortest < distance ? currentShortest : distance
                shortestDistantCity = currentShortest < distance ? currentShortestCity : city
            }

            tempShortestCity = shortestDistantCity
            city.distance = shortestDistance
        })
        resultArray.push(tempShortestCity)

        return this.nextShortest(tempShortestCity, pendingLocations, resultArray, baseCity)
    }
}
