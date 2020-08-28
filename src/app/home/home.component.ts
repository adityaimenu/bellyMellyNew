import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UrlService} from "../services/url/url.service";
import {LoginService} from "../services/login/login.service";
import {ObservableService} from "../services/observable-service/observable.service";
import {CommonService} from "../services/common/common.service";
import {ToastrManager} from "ng6-toastr-notifications";
import {ApiService} from "../services/api/api.service";
import {LocalStorageService} from "angular-web-storage";
import * as js from "../../assets/js/custom";
import {SwiperOptions} from "swiper";
declare var $: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  addAddressString: string;
  type: string = 'imenu';
  latitude: number = 0;
  longitude: number = 0;
  country: string;
  countryAsign: string;
  restaurantname: string;
  servicetype: string = 'Pickup';
  FoodTypes = [];
  FoodTypesId = []
  Locations = [];
  imageUrl: string;
  foodtype = ['0'];
  searchAddress: string;
  currentAddr: string;
  showBoundaryLinks = true;
  totalCount: number;
  bigCurrentPage: number;
  maxSize = 3;
  skipRows: number = 0;
  limit: number = 20;
  searchAddressMobile: string;
  selectedservicetype: string;
  countryCode: string;
  showRestaurant: number = 0;
  showService: number = 0;
  showFoodtype: number = 0;


  constructor( private localStorage: LocalStorageService,
               private api: ApiService,
               private toaster: ToastrManager,
               private common: CommonService,
               private observable: ObservableService,
               private loginService: LoginService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private url: UrlService) { }

  ngOnInit() {
    js.swipper();
  }

  addressStatic(lat, long, addr?: any) {
    location.href = "https://bellymelly.com/us/restaurants?latitude=" + lat + "&longitude=" + long + "&restaurant=" ;
  }

  searchrRestaurants(val) {
    localStorage.removeItem('adr_address');
    this.addAddressString = null;
    this.skipRows = 0;
    this.Locations = [];
    this.totalCount = 0;
    this.servicetype = val;
    location.href = "https://bellymelly.com/us/restaurants?latitude=0&longitude=0&restaurant=" + this.restaurantname;
    if (this.servicetype) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
    }
    else {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.showRestaurant = 0
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;

      }
      this.selectedservicetype = this.servicetype;
      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }


  searchrRestaurantsWithAddress(val) {
    this.restaurantname = null
    this.Locations = [];
    this.totalCount = 0;
    this.skipRows = 0;
    this.servicetype = val;
    location.href = "https://bellymelly.com/us/restaurants?latitude=" + this.latitude + "&longitude=" + this.longitude + "&restaurant=";
    if (this.servicetype) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
    } else {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.showRestaurant = 1;
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;

      }
      this.selectedservicetype = this.servicetype;
      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }

  saveLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        location.href = "https://bellymelly.com/us/restaurants?latitude=" + latitude + "&longitude=" + longitude + "&restaurant=";
      });

    } else {
      console.log('No support for geolocation');
    }
  }

  searchrRestaurantsBoth(val) {
    // this.Locations =[];
    // this.totalCount= 0;
    // this.skipRows = 0
    this.servicetype = val;
    if (this.addAddressString) {
      if (this.servicetype) {
        var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
      } else {
        var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
      }
    }
    if (this.restaurantname) {
      if (this.servicetype) {
        var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
      } else {
        var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
      }
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.showFoodtype = 1;
      this.showService = 0
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;

      }

      this.selectedservicetype = this.servicetype;

      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }

  public handleAddressChangeKeyup(address) {
    console.log(address);
    localStorage.setItem('adr_address', address.adr_address);
    this.changeSearchType(1)
    this.searchAddress = address.formatted_address;
    this.addAddressString = this.searchAddress;
    this.searchAddressMobile = this.searchAddress;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.searchrRestaurantsWithAddress(this.servicetype)
    $(".dropdown-menu ").removeClass('show')
  }

  changeSearchType(val) {
    this.skipRows = 0;
    $('.restaurantname').val('')

    $("input[name=addAddress4545677]").val('')
    $("input[name=addAddress4545]").val('')
    // this.clearALl()
    // this.addAddressString = null;
    // this.restaurantname = null;
    if (val == 1) {
      $('.addAddressString').val('')
      // this.getCurrentPosition()
    }
    this.foodtype = ['0'];
    $('.custom-control-input').prop('checked', false)
  }


  error = (message: string) => {
    this.toaster.errorToastr(message);
  }
  warning = (message: string) => {
    this.toaster.warningToastr(message);
  }
  success = (message: string) => {
    this.toaster.successToastr(message);
  }

}
