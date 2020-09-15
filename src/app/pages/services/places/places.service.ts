import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private keyGooglePlaces = environment.keyGooglePlaces;
  private urlPlacesNearby = environment.urlPlacesNearby;
  private urlPlacesDetails = environment.urlPlacesDetails;
  private urlPlaces = environment.urlPlaces;
  private proxyCors = environment.proxyCors

  constructor(private httpClient: HttpClient) { }

  getPlaces(location) {
    return this.httpClient.get(`${this.proxyCors}${this.urlPlaces}/nearbysearch/json?key=${this.keyGooglePlaces}&location=${location.latitude},${location.longitude}&radius=1000`);
  }

  getDetailsPlace(idPlace) {
    return this.httpClient.get(`${this.proxyCors}${this.urlPlaces}/details/json?key=${this.keyGooglePlaces}&place_id=${idPlace}`);
  }
  
}
