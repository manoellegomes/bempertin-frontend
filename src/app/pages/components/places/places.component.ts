import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Utils } from "../../../shared/utils/utils";
import { PlacesService } from "../../services/places/places.service";
import { TextsPortuguese } from "../../../shared/texts/texts-portuguese";
import { RateFields } from "../../entities/rateFields";

@Component({
  selector: "app-places",
  templateUrl: "places.component.html",
  styleUrls: ["places.component.scss"],
})
export class PlacesComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  formRate: FormGroup;
  isCollapsed = true;
  msgAlert: string = "";
  typeAlert: string = "";
  yourLocal: string = "";
  colorRowPlaces:string = "";
  avatar: string = sessionStorage['avatar'] || "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg";
  latitude: number;
  longitude: number;
  zoom: number = 15;
  placesStatusUndefined = [];
  placesOpenNow = [];
  placesClosed = [];
  showDetails = false;
  showReviews = false;
  placeDetails;
  markers = [];
  labelBtnFavorite: string = '';
  typeActionFavorite: string = 'add';
  labelBtnRate: string = '';
  typeActionRate: string = 'add';
  showRateSection: boolean = false;
  myRateNumber: number;
  myRateComment: string = '';
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 100,
    minZoom: 8,
  };

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private utils: Utils,
    private texts: TextsPortuguese,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("places-page");

    this.getLocation();
    this.createFormRate(new RateFields());
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("places-page");
  }

  createFormRate(rate: RateFields) {
    this.formRate = this.formBuilder.group(
      {
        rate_number: [rate.rate_number, [Validators.required]],
        comment: [rate.comment, [Validators.required]]
      }
    );
  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{

          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
          
          this.callApiGooglePlaces({latitude: this.latitude, longitude: this.longitude});
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  callApiGooglePlaces(location) {
    this.placesService.getPlaces(location).subscribe(
      (res) => {
        let placeFullString = res['results'][1]['plus_code']['compound_code'];
        this.yourLocal = placeFullString.substr(placeFullString.indexOf(' '), placeFullString.length-1) || res['results'][0]['name'];

        res['results'].shift();
        this.placesOpenNow = res['results'].filter((value, key) => {
          return value.opening_hours?.open_now === true && value.business_status === 'OPERATIONAL';
        });

        this.placesClosed = res['results'].filter((value, key) => {
          return value.opening_hours?.open_now === false && value.business_status === 'OPERATIONAL';
        });

        this.placesStatusUndefined = res['results'].filter((value, key) => {
          return value['opening_hours'] === undefined && value.business_status === 'OPERATIONAL';
        });

        res['results'].forEach(element => {
          if (element.business_status == 'OPERATIONAL') {
            this.addMarker(element['geometry']['location'], element.name);
          }
        });
      },
      (dataError) => {
        console.log('Error', dataError);
      }
    );
  }

  addMarker(location, name) {
    this.markers.push({
      position: {
        lat: location.lat,
        lng: location.lng,
      },
      title: name
    })
  }

  getDetails(item) {
    this.placesService.getDetailsPlace(item.place_id).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.showDetails = true;

          if (res['result']['reviews'] && res['result']['reviews'].length) {
            this.showReviews = true;
            res['result']['reviews'] = this.utils.shuffleArray(res['result']['reviews']);
          } else {
            this.showReviews = false;
          }

          this.placeDetails = res['result'];

          let placeObj = {
            place_id: this.placeDetails.place_id,
            name: this.placeDetails.name
          };

          this.verifyFavorite(placeObj);

          this.verifyRate(placeObj);
        }
      },
      (dataError) => {
        this.showDetails = false;
        console.log('Error', dataError);
      }
    );
  }

  verifyFavorite(place) {
    if (localStorage['favorites']) {
      let favorites = JSON.parse(localStorage['favorites']);
      
      let exists = favorites.find(item => {
        return item.place_id === place.place_id && item.name === place.name;
      });
      
      this.labelBtnFavorite = (exists) ? 'Desfavoritar' : 'Favoritar';
      this.typeActionFavorite = (exists) ? 'remove' : 'add';
    } else {
      this.labelBtnFavorite = 'Favoritar';
      this.typeActionFavorite = 'add';
    }
  }

  verifyRate(place) {
    if (localStorage['rates']) {
      let rates = JSON.parse(localStorage['rates']);
      
      let exists = rates.find(item => {
        return item.place_id === place.place_id && item.name === place.name;
      })
      
      this.labelBtnRate = (exists) ? 'Remover Avaliação' : 'Avaliar';
      this.typeActionRate = (exists) ? 'remove' : 'add';
      this.showRateSection = (exists) ? false : true;

      (exists) ? this.formRate.disable() : this.formRate.enable();;
    } else {
      this.labelBtnRate = 'Avaliar';
      this.typeActionRate = 'add';
    }
  }

  changeStyle($event){
    this.colorRowPlaces = $event.type == 'mouseover' ? "color-row-places" : "color-row-places";
  }

  favorites(place_id, name) {
    let favorites = this.typeActionFavorite === 'add' ? this.addFavorite(place_id, name) : this.removeFavorite(place_id, name);

    localStorage['favorites'] = JSON.stringify(favorites);
    this.verifyFavorite({place_id, name});
  }

  addFavorite(place_id, name) {
    let favorites = [];

    if(localStorage['favorites']) {
      favorites = JSON.parse(localStorage['favorites']);
    }

    favorites.push({place_id, name});

    return favorites;
  }

  removeFavorite(place_id, name) {
    if(localStorage['favorites']) {
      let favorites = JSON.parse(localStorage['favorites']);
      favorites.splice(favorites.indexOf({place_id, name}), 1);

      return favorites;
    }
  }

  rates(place_id, name) {
    if (this.typeActionRate === 'add') {
      this.showRateSection = !this.showRateSection
    } else {
      let rates = this.removeRate(place_id, name);
      localStorage['rates'] = JSON.stringify(rates);
    }

    this.verifyRate({place_id, name});
  }

  addRate(place_id, name) {
    let rates = [];

    if(localStorage['rates']) {
      rates = JSON.parse(localStorage['rates']);
    }

    rates.push({
      place_id,
      name,
      rate_number: this.formRate.value.rate_number,
      comment: this.formRate.value.comment
    });

    return rates;
  }

  removeRate(place_id, name) {
    if(localStorage['rates']) {
      let rates = JSON.parse(localStorage['rates']);
      rates.splice(rates.indexOf({place_id, name}), 1);

      return rates;
    }
    this.showRateSection = false;
    this.formRate.enable();
  }

  onSubmitRate(place_id,name) {
    localStorage['rates'] = JSON.stringify(this.addRate(place_id, name));

    this.verifyRate({place_id, name});
    
  }
  
}
