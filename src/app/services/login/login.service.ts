import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LocalStorageService} from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLogin: BehaviorSubject<boolean>;
  user: BehaviorSubject<any>;
  private isSignedIn = new BehaviorSubject(false);
  signedStatus = this.isSignedIn.asObservable();
  constructor(
    private localStorage: LocalStorageService
  ) {
    if (localStorage.get('BM_USER')) {
      this.isLogin = new BehaviorSubject<boolean>(true);
      this.user = new BehaviorSubject<any>(this.localStorage.get('BM_USER'));
    } else {
      this.isLogin = new BehaviorSubject<boolean>(false);
      this.user = new BehaviorSubject<any>(null);
    }
  }

  updateSignedStatus(val: any) {
    console.log('in signed');
    this.isSignedIn.next(val);
  }
  isLoggedIn(): Observable<boolean> {
    return this.isLogin.asObservable();
  }
  setVal(val: boolean) {
    this.isLogin.next(val);
  }
  onUpdateProfile(): Observable<any> {
    return this.user.asObservable();
  }
  setUser(user: any) {
    this.user.next(user);
  }
}
