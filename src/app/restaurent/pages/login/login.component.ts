import { Component, OnInit } from '@angular/core';
import { LoginBody } from "../../../requests/login-body";
import { ApiService } from "../../../services/api/api.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { LocalStorageService } from "angular-web-storage";
import { AppComponent } from "../../../app.component";
import { LoginService } from "../../../services/login/login.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../services/common/common.service";
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";
import { RestLoginBody } from 'src/app/requests/rest-login-body';
import { JsonPipe } from '@angular/common';
declare var $: any;
import * as js from '../../../../assets/js/custom';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginBody = new LoginBody();
  restLoginBody = new RestLoginBody();
  socialUser: SocialUser;
  flags = {
    isLogin: false
  };
  tId: string;
  baseUrl: string;
  socialLoginBody: any;
  isCheckoutWithoutLogin = false;
  usernameForgot: string;
  visiblePass: any = false;
  chainId: number = -1;
  OTP: string;
  password: string;
  isExistsIMenuAccount: number
  loginUserData = [];

  fbemail: string;
  FName: string;
  LName: string;
  tel: string;
  forgotOtpPresent: any = false;
  socialType: number;
  country: string;
  responseSendOTPForgot = [];
  findCountry: boolean;
  mobUrl: string;
  countryNew: string;
  constructor(
    private api: ApiService,
    private toaster: ToastrManager,
    private localStorage: LocalStorageService,
    private app: AppComponent,
    private loginService: LoginService,
    private observable: ObservableService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.loginBody.data = { username: '', password: '', isBMPortal: 1 };
    this.observable.getIsCheckoutWithoutLogin().subscribe((value: boolean) => {
      this.isCheckoutWithoutLogin = value;
    });
    this.activatedRoute.params.subscribe((response: any) => {
      this.country = response.country;
      this.countryNew = window.location.pathname.replace('/', '').split('/')[0];

      if (this.countryNew.toUpperCase() == 'IN') {
        this.findCountry = true;
      } else {
        this.findCountry = false;
      }
      this.mobUrl = window.location.pathname.replace('/', '').split('/')[1];
    })
    this.loginUserData = this.localStorage.get('BM_USER');
    if (this.loginUserData) {
      if (this.localStorage.get('BM_LoginBody')) {
       // this.loginRest();
      }
    }
    this.baseUrl = window.location.pathname.replace('/', '').split('/')[0];
    // this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
    // this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hasing
    
  }

  login() {
    console.log('login');

    this.loginBody.tId = this.common.loginToken;
    this.flags.isLogin = true;
    console.log(this.loginBody);
    if (!this.loginBody.data.username.trim().length || !this.loginBody.data.password.trim().length) {
      this.toaster.errorToastr('Please enter valid credentials');
      this.flags.isLogin = false;
      return;
    }

    this.api.newRestLogin(this.loginBody).subscribe((response: any) => {
      if (response.data == null) {
        this.flags.isLogin = false;
      }

      /*this.flags.isLogin = false;*/
      if (response.serviceStatus != 'S') return ;
      this.localStorage.set('BM_LoginBody', this.loginBody);
      this.localStorage.remove('BM_SocialLoginBody');
      this.loginRest();
      $.fancybox.close();
    }, error => {
      this.flags.isLogin = false;
    });
  }

  loginRest() {
    console.log('login2   ')
    this.loginBody = this.localStorage.get('BM_LoginBody');
    this.restLoginBody.tId = this.localStorage.get('BM_tId');
    this.restLoginBody.data = { username: this.loginBody.data.username, password: this.loginBody.data.password, isBMPortal: 1 };

    this.api.loginRest(this.restLoginBody).subscribe((response: any) => {
      if (response.data == null) {
        this.flags.isLogin = false;
      }

      if (response.serviceStatus != 'S') return ;
      this.localStorage.set('BM_USER', response.data);
      this.loginService.setVal(true);
      this.loginService.setUser(response.data);
      this.localStorage.set('guest', false);
      this.flags.isLogin = false;
      if (this.isCheckoutWithoutLogin) {
        if(window.location.hostname == 'localhost'){
          this.router.navigateByUrl(`${this.country}/${this.mobUrl}/checkout`); //testing
       //   alert('login');
          /*location.reload();*/
          /*setTimeout(() => {location.reload();},2000);*/
        }else{
          this.router.navigateByUrl(`/${this.mobUrl}/checkout`);//live
          /*setTimeout(() => {location.reload();},2000);*/
        }
      } else {
      //  location.reload();
      }
     // location.reload();
      document.getElementById('close2').click();
      $.fancybox.close();

    }, error1 => {
      this.flags.isLogin = false;
    })
  }
  signUp() {
    $.fancybox.close();
    document.getElementById('openSignUpModal').click();
  }
  socialFbSignIn(val) {
    this.socialType = val;
    let socialProvider;
    socialProvider = FacebookLoginProvider.PROVIDER_ID;
    this.authService.signIn(socialProvider).then((user: SocialUser) => {

      this.socialUser = user;
      const data = { tId: this.localStorage.get('BM_tId'), data: { isBMPortal: 1, customerfbdata: { fbemail: this.socialUser.email, FName: this.socialUser.firstName, LName: this.socialUser.lastName, FId: this.socialUser.id } } };
      this.localStorage.set('BM_SocialLoginBody', { status: true, google: false, body: data });
      this.api.CheckAccountExists(data).subscribe((response: any) => {

        if (response.serviceStatus != 'S') return;
        if (response.data.isExistsIMenuAccount == 2) {
          this.localStorage.set('BM_USER', response.data);
          this.loginService.setVal(true);
          this.localStorage.set('guest', false);
          this.loginService.setUser(response.data);
          if (this.isCheckoutWithoutLogin) {
            if(window.location.hostname == 'localhost'){
              this.router.navigateByUrl(`${this.country}/${this.mobUrl}/checkout`); //testing
             // alert('login');
              /*location.reload();*/
              /*setTimeout(() => {location.reload();},2000);*/
            }else{
              this.router.navigateByUrl(`/${this.mobUrl}/checkout`);//live
              /*setTimeout(() => {location.reload();},2000);*/
            }
          } else {
          //  location.reload();
          }
        } else {
          this.fbemail = this.socialUser.email;
          this.FName = this.socialUser.firstName;
          this.LName = this.socialUser.lastName;
          $('#sendOtpSignupModal').modal('show');
          $("div").removeClass("modal-backdrop")
        }
        document.getElementById('close').click();

        $.fancybox.close();

      });
    })
  }
  socialGoogleSignIn(val) {
    console.log('1');
    this.socialType = val;
    let socialProvider;
    socialProvider = GoogleLoginProvider.PROVIDER_ID;
    console.log('2');
    this.authService.signIn(socialProvider).then((user: SocialUser) => {
      console.log('3');
      this.socialUser = user;
      const data = { tId: this.localStorage.get('BM_tId'), data: { isBMPortal: 1, customerfbdata: { fbemail: this.socialUser.email, FName: this.socialUser.firstName, LName: this.socialUser.lastName, FId: this.socialUser.id } } };
      this.localStorage.set('BM_SocialLoginBody', { status: true, google: true, body: data });
      this.api.CheckGoogleAccountExists(data).subscribe((response: any) => {

        if (response.serviceStatus != 'S') return;
        console.log(response.data.isExistsIMenuAccount);
        if (response.data.isExistsIMenuAccount == 2) {
          this.localStorage.set('BM_USER', response.data);
          this.loginService.setVal(true);
          this.localStorage.set('guest', false);
          this.loginService.setUser(response.data);
          if (this.isCheckoutWithoutLogin) {
            if(window.location.hostname == 'localhost'){
              this.router.navigateByUrl(`${this.country}/${this.mobUrl}/checkout`); //testing
            //  alert('login');
              /*location.reload();*/
             /*setTimeout(() => {location.reload();},2000);*/
            }else{
              this.router.navigateByUrl(`/${this.mobUrl}/checkout`);//live
              /*setTimeout(() => {location.reload();},2000);*/
            }
          } else {
         //   location.reload();
          }
        } else {
          this.fbemail = this.socialUser.email;
          this.FName = this.socialUser.firstName;
          this.LName = this.socialUser.lastName;
          $('#sendOtpSignupModal').modal('show');
          $("div").removeClass("modal-backdrop")
        }
            // location.reload();
        document.getElementById('close').click();
        $.fancybox.close();
       // location.reload();
      });
    })
  }

  signupSocial() {
    const tId = this.localStorage.get('BM_tId');

    // const data = { tId: this.localStorage.get('BM_tId'), data: { customerfbdata: { fbemail: this.socialUser.email, FName: this.socialUser.firstName, LName: this.socialUser.lastName, FId: this.socialUser.id }, customerData: { tel: this.tel, OTP: this.OTP, MobileOptIn: 1 },checkOTP:1 },checkOTP:1 };
    const data = { tId: this.localStorage.get('BM_tId'), data: { customerfbdata: { fbemail: this.socialUser.email, FName: this.socialUser.firstName, LName: this.socialUser.lastName, FId: this.socialUser.id }, customerData: { tel: this.tel,  MobileOptIn: 1 } } };
    if (this.socialType == 1) {
      this.api.DoFBLogin(data).subscribe((response: any) => {

        if (response.serviceStatus != 'S') return;
        this.localStorage.set('BM_USER', response.data);
        this.loginService.setVal(true);
        this.loginService.setUser(response.data);
        this.localStorage.set('guest', false);
        $('#sendOtpSignupModal').modal('hide');
        // $('#enterOtpSigupModal').modal('hide');
        if (this.isCheckoutWithoutLogin) {
          if(window.location.hostname == 'localhost'){
            this.router.navigateByUrl(`${this.country}/${this.mobUrl}/checkout`); //testing
            //  alert('login');
            /*location.reload();*/
            /*setTimeout(() => {location.reload();},2000);*/
          }else{
            this.router.navigateByUrl(`/${this.mobUrl}/checkout`);//live
            /*setTimeout(() => {location.reload();},2000);*/
          }
        } else {
         /* location.reload();*/
        }
        // location.reload()
      });
    } else {
      this.api.DoGoogleLogin(data).subscribe((response: any) => {
        if (response.serviceStatus != 'S') return;
        this.localStorage.set('BM_USER', response.data);
        this.localStorage.set('guest', false);
        this.loginService.setVal(true);
        this.loginService.setUser(response.data);
        $('#sendOtpSignupModal').modal('hide');
        if (this.isCheckoutWithoutLogin) {
          this.router.navigateByUrl(`/${this.mobUrl}/checkout`);
        }
        //  location.reload()
      });
    }
    this.OTP = '';
  }

  sendOtpForgotModalOpen() {
    $.fancybox.close();
    // setTimeout(function(){
    $('#sendOtpForgotModal').modal('show');
    $("div").removeClass("modal-backdrop")
    // },2000)
  }

  sendOtpForgot() {
    console.log('hellooo');

    this.forgotOtpPresent = true;

    if (!this.usernameForgot.trim().length) {
      this.toaster.errorToastr('Enter Valid Email');
      this.forgotOtpPresent = false;
      return;
    }
    const data = { tId: this.localStorage.get('BM_tId'), data: { customerData: {}, username: this.usernameForgot } }
    this.api.sendOtpForgot(data).subscribe((response: any) => {
      this.forgotOtpPresent = false;

      if (response.serviceStatus != 'S') return
      this.responseSendOTPForgot = response.data;
      $('#sendOtpForgotModal').modal('hide');
      $('#enterOtpForgotModal').modal('show');
      $("div").removeClass("modal-backdrop")
    },error1 => {
      this.forgotOtpPresent = false;
    });

  }

  sendOtpSignup() {
    const data = { tId: this.localStorage.get('BM_tId'), data: { customerData: { fname: this.FName, cell: '', mname: '', email: this.fbemail, tel: this.tel } } }
    this.api.sendSignUpOtp(data).subscribe((response: any) => {
      if (response.serviceStatus != 'S') return;
      $('#sendOtpSignupModal').modal('hide');
      $('#enterOtpSigupModal').modal('show');
      $("div").removeClass("modal-backdrop")
      this.success(response.message);
    });

  }

  ResendsendOtp() {
    const data = { tId: this.localStorage.get('BM_tId'), data: { customerData: {}, username: this.usernameForgot } }
    this.api.sendOtpForgot(data).subscribe((response: any) => {
      if (response.serviceStatus != 'S') return;
      this.responseSendOTPForgot = response.data;
      this.success('OTP has been resent.');

    });
  }


  myFunction() {
    var x = document.getElementById("typepass") as HTMLInputElement;
    if (x.type === "password") {
      x.type = "text";
      this.visiblePass = true;
    } else {
      x.type = "password";
      this.visiblePass = false;
    }
  }

  myFunction2() {
    var x = document.getElementById("typepass2") as HTMLInputElement;
    if (x.type === "password") {
      x.type = "text";
      this.visiblePass = true;
    } else {
      x.type = "password";
      this.visiblePass = false;
    }
  }





  resetPassword() {
    if (!this.password) {
      return this.toaster.errorToastr('Enter New Password');
    }

    if (this.password.length <= 7) {return this.toaster.errorToastr('Enter password minimum 8 digit')}

    if (!this.OTP) {
      return this.toaster.errorToastr('Enter OTP');
    }

    const data = { tId: this.localStorage.get('BM_tId'), data: { username: this.usernameForgot, customerData: { tel: this.usernameForgot, OTP: this.OTP }, password: this.password } }

    if (this.findCountry) {

      this.api.ResetPassword(data).subscribe((response: any) => {

        if (response.serviceStatus != 'S') return;
        this.success(response.message)
        $('#enterOtpForgotModal').modal('hide');
        this.usernameForgot = '';
        this.password = '';
        this.OTP = '';
        $('#openLoginModalBtn').trigger('click');
      });
    }
    if (!this.findCountry) {

      this.api.ResetPassword_OTP(data).subscribe((response: any) => {

        if (response.serviceStatus != 'S') return;
        this.success(response.message)
        $('#enterOtpForgotModal').modal('hide');
        this.usernameForgot = '';
        this.password = '';
        this.OTP = '';
        $('#openLoginModalBtn').trigger('click');
      });
    }

  }



  toggle() {
    js.showPass()
  }



  error = (message: string) => {
    this.toaster.errorToastr(message);
  }
  success = (message: string) => {
    this.toaster.successToastr(message);
  }


}
