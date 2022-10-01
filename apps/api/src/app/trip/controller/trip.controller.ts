import { Request, Response } from 'express'
import { TripService } from '../services/trip.service'

/**
 * Controller class to handle all the API's required for the trip API.
 * 
 * @author Ankit Singh
 */
export class TripController {

    /**
     * Endpoint to list all the cities based on the search query.
     * @param req 
     * @param res 
     */
    static listCities = async (req: Request, res: Response) => {
        try {
            const query = req.query.search as string
            const tripInstance = TripService.getInstance()
            const cities = tripInstance.getCities()
            const result = cities.filter(item => item.name.includes(query))

            res.send({
                items: result,
            })
        } catch(err) {
            // TODO: add a logger class here
            console.log(err)
        }
    }

    static createTrip = async (req: Request, res: Response) => {
        try {
            const tripInstance = TripService.getInstance()
            const result = tripInstance.createTrip(req.body.city)

            res.send({
                items: result,
            })
        } catch(err) {
            // TODO: add a logger class here
            console.log(err)
        }
    }
}