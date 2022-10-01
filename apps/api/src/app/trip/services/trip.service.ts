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
            const selectedCity = map.countries.find(item => item.id === city)
            if (selectedCity) {
                currentCity = selectedCity
            }
        })

        const pendingLocations = this.worldMap.filter((mapItem: IWorldMap) => mapItem.continent !== currentCity.contId)
        const shortestCityArray = this.nextShortest(currentCity, pendingLocations, acc)
        acc.push(currentCity, ...shortestCityArray, currentCity)
        return acc
    }

    // Select a city
    // Search from all the continents except that country
    // create a new filtered location
    // Find the nearest continent store it to array
    // Set that city as current city
    // repeat till filtered locaiton is empty
    private nextShortest(currentLocation: ICity, remainingLocations: IWorldMap[], resultArray: any[]) {
        if (remainingLocations.length === 1) {
            return resultArray
        }

        let tempCurrentLocation = currentLocation
        let tempShortestCity = null
        const shortestCityArray = []
        const pendingLocations = remainingLocations.filter((mapItem: IWorldMap) => mapItem.continent !== tempCurrentLocation.contId)
        pendingLocations.forEach((location: IWorldMap) => {
            let shortestDistance = null;
            let shortestDistantCity = null;
            location.countries.map((city: ICity) => {
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
                    const currentShortest = shortestDistance;
                    const currentShortestCity = shortestDistantCity;
                    shortestDistance = currentShortest < distance ? currentShortest : distance
                    shortestDistantCity = currentShortest < distance ? currentShortestCity : city
                }

                tempShortestCity = shortestDistantCity
                city.distance = shortestDistance
            })
            shortestCityArray.push(tempShortestCity)
            shortestCityArray.sort((cityOne: ICity, cityTwo: ICity) => cityOne.distance - cityTwo.distance)
            tempCurrentLocation = shortestCityArray[0]
        })
        resultArray.push(tempCurrentLocation)
        resultArray.sort((cityOne: ICity, cityTwo: ICity) => cityOne.distance - cityTwo.distance)
        return this.nextShortest(tempCurrentLocation, pendingLocations, resultArray)
    }
}
