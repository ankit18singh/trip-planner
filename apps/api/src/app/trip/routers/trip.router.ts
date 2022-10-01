import { Router } from 'express';
import { TripController } from '../controller';

export const tripRouter = Router()

tripRouter.get('/cities', TripController.listCities)
tripRouter.post('/create', TripController.createTrip)
