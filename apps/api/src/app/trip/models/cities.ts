
export interface ICity {
  id: string;
  name: string;
  location: ICoordinate;
  countryName: string;
  iata: string;
  rank: number;
  countryId: string;
  dest: null | string;
  airports: string[];
  images: string[];
  popularity: number;
  regId: RegID;
  contId: IContID;
  subId: null | string;
  terId: null | string;
  con: number;
}

export enum IContID {
  Africa = 'africa',
  Asia = 'asia',
  Europe = 'europe',
  NorthAmerica = 'north-america',
  Oceania = 'oceania',
  SouthAmerica = 'south-america',
}

export interface ICoordinate {
  lat: number;
  lon: number;
}

export interface IWorldMap {
  continent: IContID,
  countries: ICity[]
}

export enum RegID {
  Australasia = 'australasia',
  Caribbean = 'caribbean',
  CentralAfrica = 'central-africa',
  CentralAmerica = 'central-america',
  CentralAsia = 'central-asia',
  CentralEurope = 'central-europe',
  EasternAfrica = 'eastern-africa',
  EasternAsia = 'eastern-asia',
  EasternEurope = 'eastern-europe',
  Melanesia = 'melanesia',
  Micronesia = 'micronesia',
  NorthernAfrica = 'northern-africa',
  NorthernAmerica = 'northern-america',
  NorthernEurope = 'northern-europe',
  Polynesia = 'polynesia',
  SouthEasternAsia = 'south-eastern-asia',
  SouthernAfrica = 'southern-africa',
  SouthernAmerica = 'southern-america',
  SouthernAsia = 'southern-asia',
  SouthernEurope = 'southern-europe',
  WesternAfrica = 'western-africa',
  WesternAsia = 'western-asia',
  WesternEurope = 'western-europe',
}

