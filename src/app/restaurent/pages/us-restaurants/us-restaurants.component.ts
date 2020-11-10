import { Component, OnInit } from '@angular/core';
declare var $: any
import * as js from '../../../../assets/js/custom';
import { LocalStorageService } from 'angular-web-storage';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from 'src/app/services/common/common.service';
import { ObservableService } from 'src/app/services/observable-service/observable.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from 'src/app/services/url/url.service';
import * as _ from 'lodash';
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
@Component({
  selector: 'app-us-restaurants',
  templateUrl: './us-restaurants.component.html',
  styleUrls: ['./us-restaurants.component.scss']
})
export class UsRestaurantsComponent implements OnInit {
  addAddressString: string;
  type: string = 'imenu';
  latitude: number = 0;
  longitude: number = 0;
  country: string;
  countryAsign: string;
  restaurantname: string;
  servicetype: string = 'Delivery';
  FoodTypes = [];
  FoodTypesId = []
  Locations = [];
  imageUrl: string;
  foodtype = ['0'];
  searchAddress: string;
  gettingData: any = false;
  selectedFood: any;
  currentAddr: string;
  showBoundaryLinks = true;
  totalCount: number;
  bigCurrentPage: number;
  maxSize = 3;
  skipRows: number = 0;
  limit: number = 20;
  searchAddressMobile: string;
  selectedservicetype: string = 'Delivery';
  countryCode: string;
  showRestaurant: number = 0;
  showService: number = 0;
  showFoodtype: number = 0;
  selectedAddr: any;
  options = {
    componentRestrictions: { country: this.countryCode }
  }
  host: string;
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private toaster: ToastrManager,
    private common: CommonService,
    private observable: ObservableService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private url: UrlService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    // this.host = this.common.hostname;
    js.stickyNew()
    this.imageUrl = this.url.imageUrl;
    js.scrolltopnm()
    js.categorySwiper();
    js.scrolltop()
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'au') {
      this.countryCode = 'AU'
      this.countryAsign = 'aus';
      this.host = 'https://bellymelly.com.au';
    } else if (this.country == 'us') {
      this.countryCode = 'US'
      this.countryAsign = 'usa';
      this.host = 'https://bellymelly.com';
    }
    this.options = {
      componentRestrictions: { country: this.countryCode }
    }
    this.comingLatLong();
    this.initMap();

    /*if(localStorage.getItem('adr_address')) {
      this.selectedAddr = localStorage.getItem('adr_address');
    } else {
      this.selectedAddr = '';
    }*/

   // this.getLocationFromLatLong();
  }

  comingLatLong() {
    if (window.location.search) {
      var latitude = window.location.search.replace('?', '').split('&')[0].split('=')[1];
      var longitude = window.location.search.replace('?', '').split('&')[1].split('=')[1];
      this.restaurantname = window.location.search.replace('?', '').split('&')[2].split('=')[1];
      this.latitude = Number(latitude);
      this.longitude = Number(longitude);
      if (this.latitude == 0 && this.restaurantname != '') {
        this.searchrRestaurants(this.servicetype)
        document.getElementById('sizeDimensions').click();
        document.getElementById('sizeDimensionsm').click();
      } else {
        this.currentAddr = ' ';
        this.addAddressString = this.currentAddr;
        this.searchAddressMobile = this.addAddressString;
        console.log(this.servicetype);
        this.searchrRestaurantsWithAddress(this.servicetype);
        document.getElementById('sizeDimensions').click();
        document.getElementById('sizeDimensionsm').click();
      }
    } else {
      if (this.country == 'us') {
        window.location.href = `${this.host}`
      } else if (this.country == 'au') {
        // window.location.href = `${this.host}`
        this.getCurrentPosition();
      }

    }


  }

  getLocationFromLatLong() {
    navigator.geolocation.getCurrentPosition(position => {
      const request = new XMLHttpRequest();
      const method = 'GET';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=AIzaSyC4onu-y-_thwzwRNFQKiTzhLgf63dIJo0`;
      const async = true;
      const self = this;
      request.open(method, url, async);
      request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
          const data = JSON.parse(request.responseText);
          const address = data.results[0];
          console.log(address);
         /* this.latitude = address.geometry.location.lat;
          this.longitude = address.geometry.location.lng;
          this.currentAddr = address.formatted_address;
          this.addAddressString = this.currentAddr;
          this.searchAddressMobile = this.addAddressString;
          this.searchrRestaurantsWithAddress(this.servicetype);*/
        }
      };
    //  request.send();
    });
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      const request = new XMLHttpRequest();
      const method = 'GET';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyC4onu-y-_thwzwRNFQKiTzhLgf63dIJo0`;
      const async = true;
      const self = this;
      request.open(method, url, async);
      request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
          const data = JSON.parse(request.responseText);
          const address = data.results[0];
          this.latitude = address.geometry.location.lat;
          this.longitude = address.geometry.location.lng;
          this.currentAddr = address.formatted_address;
          this.addAddressString = this.currentAddr;
          this.searchAddressMobile = this.addAddressString;
          this.searchrRestaurantsWithAddress(this.servicetype);
        }
      };
      request.send();
    });



    $("input[name=addAddress4545677]").val(this.addAddressString)
    $("input[name=addAddress4545]").val(this.addAddressString)

  }

  public handleAddressChange(address) {
    this.searchAddress = address.formatted_address;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  }

  public handleAddressChangeKeyup(address) {
    this.changeSearchType(1)
    this.searchAddress = address.formatted_address;
    this.addAddressString = this.searchAddress;
    this.searchAddressMobile = this.searchAddress;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.searchrRestaurantsWithAddress(this.servicetype)
    $(".dropdown-menu ").removeClass('show')
  }

  searchrRestaurants(val) {

    this.addAddressString = null;
    this.skipRows = 0;
    this.Locations = [];
    this.totalCount = 0;
    this.servicetype = val;
    this.gettingData = true;
    if (this.servicetype) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
    }
    else {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.spinner.show();
      console.log(response, '1');
      this.showRestaurant = 0
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.gettingData = false;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }
      this.selectedservicetype = this.servicetype;
      document.getElementById('sizeDimensions').click();
      document.getElementById('sizeDimensionsm').click();
      this.searchAddressMobile = this.searchAddress;
      this.spinner.hide();
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }

  searchrRestaurantsWithAddress(val) {
    console.log('hello', val);
    this.restaurantname = null
    this.Locations = [];
    this.totalCount = 0;
    this.skipRows = 0;
    this.servicetype = val;
    this.gettingData = true;
    if (this.servicetype) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
    } else {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.spinner.show();
      console.log(response, '2');
      this.showRestaurant = 1;
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.gettingData = false;
      console.log(this.Locations[0]);
      if (this.Locations[0]) {
        this.selectedAddr = this.Locations[0].City;
      } else {
        let latlng = this.latitude + ',' + this.longitude;
        (document.getElementById("latlng") as HTMLInputElement).value = latlng ;
        (document.getElementById('submitt') as HTMLButtonElement).click();
      }
      console.log(this.selectedAddr);
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }
      this.selectedservicetype = this.servicetype;
      document.getElementById('sizeDimensions').click();
      document.getElementById('sizeDimensionsm').click();

      this.searchAddressMobile = this.searchAddress;
      this.spinner.hide();
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }

  searchrRestaurantsBoth(val) {

    // this.Locations =[];
    // this.totalCount= 0;
    // this.skipRows = 0
    this.servicetype = val;
    this.gettingData = true;
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
      this.spinner.show();
      this.showFoodtype = 1;
      this.showService = 0
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.gettingData = false;
      console.log(this.Locations[0]);
      if (this.Locations[0]) {
        this.selectedAddr = this.Locations[0].City;
      } else {
        let latlng = this.latitude + ',' + this.longitude;
        (document.getElementById("latlng") as HTMLInputElement).value = latlng ;
        (document.getElementById('submitt') as HTMLButtonElement).click();
      }
      console.log(this.selectedAddr, '2');
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }

      this.selectedservicetype = this.servicetype;
     // document.getElementById('sizeWeight').click();

      this.searchAddressMobile = this.searchAddress;
      this.spinner.hide();
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }
openFilters() {
    document.getElementById('filter-menu2').click();
}

 initMap(): void {
    const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 8,
          center: { lat: 41.8781136, lng: -87.6297982 },
        }
    );
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    (document.getElementById("submitt") as HTMLElement).addEventListener(
        "click",
        () => {
          this.geocodeLatLng(geocoder, map, infowindow);
        }
    );
  }

  geocodeLatLng(
      geocoder: google.maps.Geocoder,
      map: google.maps.Map,
      infowindow: google.maps.InfoWindow
  ) {
    const input = (document.getElementById("latlng") as HTMLInputElement).value;
    const latlngStr = input.split(",", 2);
    const latlng = {
      lat: parseFloat(latlngStr[0]),
      lng: parseFloat(latlngStr[1]),
    };
    geocoder.geocode(
        { location: latlng },
        (
            results: google.maps.GeocoderResult[],
            status: google.maps.GeocoderStatus
        ) => {
          if (status === "OK") {
            console.log(results[0].address_components);

            for( let i = 0; i< results[0].address_components.length; i++) {
             if (results[0].address_components[i].types[0] == "locality") {
               this.selectedAddr = results[0].address_components[i].long_name;
               console.log(this.selectedAddr);
             }
            }
            if (results[0]) {
              map.setZoom(11);
              const marker = new google.maps.Marker({
                position: latlng,
                map: map,
              });
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert("No results found");
            }
          } else {
           /* window.alert("Geocoder failed due to: " + status);*/
          }
        }
    );
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



  FoodTypeF(val, id, val2?: any) {
    const data = _.find(this.FoodTypes, function(o) { return o.FoodTypeId == val; })
    const a = data.FoodTypeId
    console.log('hello', val);
    let check: any;
    if (this.foodtype.indexOf(a) == -1) {
      check = true;
    } else {
      check = false;
    }
    if (check) {
      console.log('1');
      this.foodtype.push(a)
      this.FoodTypes.forEach(element => {
        if(element.FoodTypeId == a){

          element.status = true;
          this.sortCategory(val2);
          document.getElementById('foodtype' + a).classList.add('selected');
          document.getElementById('foodtypem' + a).classList.add('selected');
        }
      });
    } else {
      console.log('2');
      this.FoodTypes.forEach(element => {
        if(element.FoodTypeId == a){
          element.status = false
        }
      });
      var index = this.foodtype.findIndex(x => x === val);
      document.getElementById('foodtype' + a).classList.remove('selected');
      document.getElementById('foodtypem' + a).classList.remove('selected');
      this.foodtype.splice(index, 1);
    }
  }
  foodtypeVal(val) {
    const data = _.find(this.FoodTypes, function(o) { return o.FoodTypeId == val; })
    const a = data.FoodTypeId
    return this.FoodTypes[a].Name
  }
  pageChanged(e: any): void {
    const a = e.page * 2;
    const c = a + '0'
    const d = parseInt(c) - 20
    this.skipRows = Number(d);
    this.searchrRestaurantsBoth(this.servicetype);
    $("html").animate({ scrollTop: 800 }, "slow");
    // $(window).scrollTop(900);
  }

  clearALl() {
    // this.servicetype = null
    this.skipRows = 0;
    this.Locations = [];

    this.foodtype = ['0'];
    $('.custom-control-input').prop('checked', false);

    this.FoodTypes.forEach(element => {
      element.status = false
    });

    this.searchrRestaurantsBoth(this.servicetype);
    for (let i = 0; i < 30 ; i++) {
      if (document.getElementById('foodtype' + i)) {

        document.getElementById('foodtype' + i).classList.remove('selected');
        document.getElementById('foodtypem' + i).classList.remove('selected');
      }
    }

  }

  selectService(val) {
    console.log(val);
    this.skipRows = 0;
    this.servicetype = val
    this.Locations = []
    this.searchrRestaurantsBoth(val);
  }
  selectServiceMob(val) {
    this.skipRows = 0;
    this.servicetype = val
    this.Locations = []
  }

  cleaResto() {
    this.comingLatLong();
    return

    if (this.latitude) {
      this.searchrRestaurantsWithAddress(this.servicetype)
    } else {
      this.comingLatLong();
      // navigator.geolocation.getCurrentPosition(position => {
      //   const request = new XMLHttpRequest();
      //   const method = 'GET';
      //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyC4onu-y-_thwzwRNFQKiTzhLgf63dIJo0`;
      //   const async = true;
      //   const self = this;
      //   const service = ''
      //   request.open(method, url, async);
      //   request.onreadystatechange = () => {
      //     if (request.readyState == 4 && request.status == 200) {
      //       const data = JSON.parse(request.responseText);
      //       const address = data.results[0];
      //       this.latitude = address.geometry.location.lat;
      //       this.longitude = address.geometry.location.lng;
      //       this.currentAddr = address.formatted_address;
      //       this.addAddressString = this.currentAddr;
      //       this.searchAddressMobile = this.currentAddr;
      //      this.restaurantname=null;
      //       this.searchrRestaurantsWithAddress(service)
      //       this.clearService()
      //       this.changeSearchType(1);
      //       this.showFoodtype= 0;
      //       this.foodtype = ['0']
      //       this.showRestaurant = 1;
      //     }
      //   };
      //   request.send();
      // });
      $('.headerserachrestaurant').val('')
    }
  }

  clearService() {
    this.skipRows = 0
    this.gettingData = true;
    if (this.addAddressString) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    if (this.restaurantname) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.gettingData = false;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }
      this.showService = 1;
      this.selectedservicetype = '';
      this.searchAddressMobile = this.searchAddress;
      for (let i = 0; i < 30 ; i++) {
        if (document.getElementById('foodtype' + i)) {

          document.getElementById('foodtype' + i).classList.remove('selected');
          document.getElementById('foodtypem' + i).classList.remove('selected');
        }
      }
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })
  }


  sortCategory(val) {

    var first = val;
    this.FoodTypes.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; });

    console.log(this.FoodTypes);


  }

  clearFoodtype(val) {
    document.getElementById('foodtype' + val.FoodTypeId).classList.remove('selected');
    document.getElementById('foodtypem' + val.FoodTypeId).classList.remove('selected');

    var index = this.foodtype.findIndex(x => x === val);
    this.foodtype.splice(index, 1);

    this.Locations = []
    this.gettingData = true;
    this.skipRows = 0
    if (this.addAddressString) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    if (this.restaurantname) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      const a = val;
      this.FoodTypes.forEach(element => {
        if(element.FoodTypeId == a.FoodTypeId){
          element.status = false
        }
      });
      $(`#${a.FoodTypeId}m`).prop('checked', false)
      $(`#${a.FoodTypeId}w`).prop('checked', false)

      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.gettingData = false;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }

      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })
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
