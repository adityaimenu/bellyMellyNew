import { Component, OnInit } from '@angular/core';
import * as js from '../../../../assets/js/custom';
import { LoginService } from "../../../services/login/login.service";
import { LocalStorageService } from "angular-web-storage";
import { User } from "../../../models/user";
import { ActivatedRoute, Router } from "@angular/router";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { UrlService } from "../../../services/url/url.service";
import { CommonService } from 'src/app/services/common/common.service';
import * as moment from "moment-timezone";
import {LoginBody} from "../../../requests/login-body";
import {RestLoginBody} from "../../../requests/rest-login-body";
import {ApiService} from "../../../services/api/api.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogin: boolean;
  user: any;
  currentAddr: string;
  history = window.history;
  mobUrl: any;
  locationDetails: any;
  logoImage: string;
  openCloseTime: any;
  imageUrl: string;
  country: string;
  mobUrlNew: string;
  loginBody = new LoginBody();
  restLoginBody = new RestLoginBody();
  showlocation: any = true;
  host: string;
 showLogin: any = true;
  constructor(
    private loginService: LoginService,
    private localStorage: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private observable: ObservableService,
    private url: UrlService,
    private common: CommonService,
    private api: ApiService,
  ) { }

  ngOnInit() {
    if (location.href.indexOf('#dinein') != -1) {
      this.showlocation = false;
    }

    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'us'){
      moment.tz.setDefault("America/Chicago");
    }else if(this.country == 'au'){
      moment.tz.setDefault("Australia/Sydney");
    }
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    setTimeout(function () {
      if(window.location.hostname != 'localhost'){
      if (window.location.href == `${this.host}/${this.country}`) {
        window.location.href = `${this.host}/${this.country}/restaurants`
      }
    }
    }, 2000)

    this.imageUrl = this.url.imageUrl;
    js.tooltip();
    js.sideNav();


    this.observable.getLocationDetails().subscribe((response: any) => {
      this.locationDetails = response;
      if (this.locationDetails && this.locationDetails.Address) {
        localStorage.setItem('locDetail', JSON.stringify(this.locationDetails));
        this.openCloseTime = this.common.showOpenCloseTime(this.locationDetails);
      }
      if (this.locationDetails && this.locationDetails.LogoImg) this.logoImage = this.imageUrl + this.locationDetails.LogoImg;
      else this.logoImage = 'assets/images/defaultRest.png';





      if (location.href.indexOf('#dinein') != -1) {
        this.showLogin = false;

        if(this.localStorage.get('BM_tId')) {



          let uname = 'guestuser@bellymelly.com'
          let pwd = 'guestuser!@#'
          this.loginBody = this.localStorage.get('BM_LoginBody');
          this.restLoginBody.tId = this.localStorage.get('BM_tId');
          this.restLoginBody.data = {username: uname, password: pwd, isBMPortal: 1, isguestcheckout: 1};

          setTimeout(() => {

            this.api.loginRest(this.restLoginBody).subscribe((response: any) => {
              console.log('dsfsdfsdf');

              if (response.serviceStatus != 'S') return;
              this.localStorage.set('BM_USER', response.data);
              this.localStorage.set('guest', true);
              this.loginService.setVal(true);
              this.loginService.setUser(response.data);


            })
          }, 2000);
        }



      } else {

        if (this.localStorage.get('guest') == true && location.href.indexOf('checkout') == -1) {

          this.logout();
          this.showLogin = true;
        } else if (this.localStorage.get('guest') == true && location.href.indexOf('checkout') != -1)  {
          this.showLogin = false;
        } else if (this.localStorage.get('guest') != true){
          this.showLogin = true;
        } else {
          this.showLogin = true;
        }

      }



    });

    this.loginService.isLoggedIn().subscribe((login: boolean) => {

      this.isLogin = login;
      this.user = this.localStorage.get('BM_USER');
      this.loginService.onUpdateProfile().subscribe((user: any) => {
        if (user) {
          if (this.user) user.token = this.user.token;
          this.user = user;
          if (this.user) this.localStorage.set('BM_USER', this.user);
        }
      })
      this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; //Without hashing
      this.country = window.location.pathname.replace('/', '').split('/')[0]; //Without hashing
      this.mobUrlNew = window.location.pathname;
    });

    if (location.href.indexOf('thankyou') != -1) {
      // this.router.navigateByUrl(this.host + '/' + this.country + '/' + this.mobUrl);
      if (this.host && this.mobUrl) {
        window.location.href = `${this.host}` + '/' + this.country + '/' + this.mobUrl;
      }
    }

    if (this.locationDetails && this.locationDetails.Address) {
      console.log(this.locationDetails);
      this.openCloseTime = this.common.showOpenCloseTime(this.locationDetails)
    } else {
      console.log('hello');
      this.locationDetails = JSON.parse(localStorage.getItem('locDetail'));
      this.openCloseTime = this.common.showOpenCloseTime(this.locationDetails);
      console.log(this.openCloseTime);
    }
    this.activatedRoute.params.subscribe((param: any) => {
      console.log(param);

      this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; //Without hashing
      this.country = window.location.pathname.replace('/', '').split('/')[0]; //Without hashing
      this.mobUrlNew = window.location.pathname;

      var segment = (window.location.href).split('/').length - 1 - ((window.location.href).indexOf('https://') == -1 ? 0 : 2);
      console.log(segment);


      if ((this.localStorage.get('BM_MobUrl') != this.mobUrl) && (segment != 3)) {

        this.localStorage.set('cartItem', []);
        this.observable.setSpecialOffer(false)
        this.localStorage.set('specialOfferData', null)
      }
      if (this.localStorage.get('BM_Country') != this.country) {
      /*  this.localStorage.remove('placeOrderData');
        this.localStorage.remove('cartItem');
        /!*this.localStorage.clear();
        this.loginService.setUser(null);
        this.loginService.setVal(false);*!/
        this.observable.setSpecialOffer(false)
        this.localStorage.set('specialOfferData', null)*/

      }
      this.localStorage.set('BM_MobUrl', this.mobUrl);
      this.localStorage.set('BM_Country', this.country);
      this.loginService.isLoggedIn().subscribe((login: boolean) => {

        this.isLogin = login;
        this.user = this.localStorage.get('BM_USER');
        this.loginService.onUpdateProfile().subscribe((user: any) => {
          if (user) {
            if (this.user) user.token = this.user.token;
            this.user = user;
            if (this.user) this.localStorage.set('BM_USER', this.user);
          }
        })
      });
    });
    console.log('15',moment().format('MMMM DD, YYYY HH:mm:ss'))
  }
  getCurrentAddr(addr) {
    if (this.showlocation) {
      this.currentAddr = addr;
    }
  }
  logout() {
    this.localStorage.clear();
    this.loginService.setUser(null);
    this.loginService.setVal(false);
   // this.router.navigate([this.mobUrl]);
    if (this.host && this.mobUrl) {
      window.location.href = `${this.host}` + `/us/` + this.mobUrl;
    } else {
      location.reload();
    }
    // this.router.navigateByUrl(`/${this.country}/${this.mobUrl}`);
    // if (window.location.hash.replace('#/', '').split('/').length > 2) {
    // if (window.location.pathname.replace('/', '').split('/').length > 2) {
    //   // const url = `/${this.mobUrl}`
    //   // this.router.navigateByUrl(url);
    //   // this.router.navigateByUrl(`/${this.country}/${this.mobUrl}`)
    //   // location.reload(`/${this.country}/${this.mobUrl}`);
    // } else {
    //   location.reload();
    // }

    // window.location.href = url;
    // window.location.href = `/bellymelly/#/${this.country}/${this.mobUrl}`;
    // window.location.reload();
  }

}
