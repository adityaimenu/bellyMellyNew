import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { CommonService } from "../../../services/common/common.service";
import { LocalStorageService } from 'angular-web-storage';
import { ObservableService } from 'src/app/services/observable-service/observable.service';

import { Router } from '@angular/router';
import * as js from '../../../../assets/js/custom';
import * as _ from 'lodash';
import html2canvas from "html2canvas";
import {Meta} from "@angular/platform-browser";

import * as fs from "fs";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api/api.service";
import {RestLoginBody} from "../../../requests/rest-login-body";
import {ToastrManager} from "ng6-toastr-notifications";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss'],
})
export class ThankyouComponent implements OnInit {
  
  currency: string;
  timeInterval: any;
  receiptSent: any = false;
  mobUrl: string;
  country: string;
    restLoginBody = new RestLoginBody();
  orderId: string;
  capturedImage: any;
  orderData:any;

  @ViewChild('screen',  {static: false}) screen: ElementRef;
  @ViewChild('canvas',  {static: false}) canvas: ElementRef;
  @ViewChild('downloadLink',  {static: false}) downloadLink: ElementRef;
  locationDetails:any;

  host:string;
  constructor(
    private common: CommonService,
    private meta: Meta,
   private api: ApiService,
    private toaster: ToastrManager,
    private localStorage: LocalStorageService,
    private observable: ObservableService,
    private router: Router
  ) {
    this.meta.updateTag({ name: 'og:image', content: "http://unrestrictedstock.com/wp-content/uploads/Unrestricted-Stock-Small.png" });

  }

  ngOnInit() {
    js.PopOver();
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
    this.observable.getthankyouData().subscribe((response: any) => {
      if (response) {
        this.orderId = response.orderId;
        this.orderData = response.data;
        console.log(this.orderData);
        this.locationDetails = response.locationDetails;
        console.log(response);
        response.data.ItemList.forEach(element => {
          element.id = element.Id;
          element.name = element.Name;
          element.brand = this.mobUrl;
          element.category = element.catName;
          if(element.ItemAddOnList.length > 0){
            const variant =[]
            element.ItemAddOnList.forEach(ele => {
              variant.push(ele.Name)
            });
            element.variant = variant.toString();
          }else{
            element.variant = '';
          }
         
          element.quantity = element.Qty;
          element.price = element.UnitPrice;
          delete element.Name
          delete element.Id
          delete element.PortionId
          delete element.UnitPrice
          delete element.Qty
          delete element.Amt
          delete element.SpecialInstructions
          delete element.NameOfThePerson
          delete element.ItemAddOnList
          delete element.isShowforSuggestion
          delete element.ItemModList
          delete element.max
        });
     
      js.transactionData(response.orderId, this.mobUrl, 'USD', (response.data.TotalAmt).toFixed(2), response.data.TaxAmt.toFixed(2), response.data.donateValSelected?response.data.donateValSelected:0, response.data.ItemList,this.orderData)
    return
    } else {
        if(window.location.hostname == 'localhost'){
          this.router.navigateByUrl(`${this.country}/${this.mobUrl}/checkout`); //testing
        }else{
          this.router.navigateByUrl(`${this.mobUrl}/thankyou`);
        }
      }
    })

    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    document.getElementById('openOrderSuccess').click();
  }


  save() {

      let div =
          document.getElementById('capture');

      // Use the html2canvas
      // function to take a screenshot
      // and append it
      // to the output div
      var image = new Image();
      var optionalObj = {'fileName': 'imageFileName', 'type':'png'};

      html2canvas(div).then(
          function (canvas) {
            document
                .getElementById('output')
                .appendChild(canvas);

            image.src = canvas.toDataURL("image/png");
            function  base64ToImage(base64Str, path, optionalObj) {

                var fs = require('fs');

                if (!base64Str || !path) {
                    throw new Error('Missing mandatory arguments base64 string and/or path string');
                }

                var optionalObj = optionalObj || {};
                var imageBuffer = decodeBase64Image(base64Str);
                var imageType = optionalObj.type || imageBuffer.type || 'png';
                var fileName = optionalObj.fileName || 'img-' + Date.now();
                var abs;
                var fileName2 = '' + fileName;

                if (fileName2.indexOf('.') === -1) {
                    imageType = imageType.replace('image/', '');
                    fileName2 = fileName2 + '.' + imageType;
                }

                abs = path + fileName2;
                console.log(abs);
                fs.writeFile(abs, imageBuffer.data, 'base64', function(err) {
                    if (err && optionalObj.debug) {
                        console.log("File image write error", err);
                    }

                });
                return {
                    'imageType': imageType,
                    'fileName': fileName2
                };
            }
            function decodeBase64Image(base64Str) {
                (window as any).global = window;
// @ts-ignore
                window.Buffer = window.Buffer || require('buffer').Buffer;
                var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                var image: any = {};
                if (!matches || matches.length !== 3) {
                    throw new Error('Invalid base64 string');
                }

                image.type = matches[1];
                image.data = new Buffer(matches[2], 'base64');

                return image;
            }

              console.log(base64ToImage(image.src,'assets/images/',optionalObj))




            window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(image.src)+'&t='+encodeURIComponent(image.src),'sharer','toolbar=0,status=0,width=626,height=436');return false
          })
      console.log(image.src,'assets/images/',optionalObj);
     // setTimeout(() => {console.log(this.base64ToImage(image.src,'assets/images/',optionalObj));}, 500);

  }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

  sendReceipt(val) {
      if (!val.trim().length || !this.validateEmail(val)) {
          this.toaster.errorToastr('Enter valid email');
          return;
      }
      this.receiptSent = true;
      this.restLoginBody.tId = this.localStorage.get('BM_tId');
      this.restLoginBody.data = {OrderNumber: this.orderId,  EmailId: val};

      this.api.SendOrderReceipt(this.restLoginBody).subscribe((val2: any) => {
          this.receiptSent = false;

          this.toaster.successToastr('Order Receipt Has Been Sent To' + ' ' + val);
      })

  }

   /*base64ToImage(base64Str, path, optionalObj) {

    if (!base64Str || !path) {
      throw new Error('Missing mandatory arguments base64 string and/or path string');
    }

    var optionalObj = optionalObj || {};
    var imageBuffer = this.decodeBase64Image(base64Str);
    var imageType = optionalObj.type || imageBuffer.type || 'png';
    var fileName = optionalObj.fileName || 'img-' + Date.now();
    var abs;
    var fileName = '' + fileName;

    if (fileName.indexOf('.') === -1) {
      imageType = imageType.replace('image/', '');
      fileName = fileName + '.' + imageType;
    }

    abs = path + fileName;
    fs.writeFile(abs, imageBuffer.data, 'base64', function(err) {
      if (err && optionalObj.debug) {
        console.log("File image write error", err);
      }

    });
    return {
      'imageType': imageType,
      'fileName': fileName
    };
  }*/

  /**
   * Decode base64 string to buffer.
   *
   * @param {String} base64Str string
   * @return {Object} Image object with image type and data buffer.
   * @public
   */
   decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image: any = {};
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = new Buffer(matches[2], 'base64');

    return image;
  }

  share(url, text) {
   /* u=TheImg.src;
    // t=document.title;
    t=TheImg.getAttribute('alt');*/
    // window.open('whatsapp://send?text='+encodeURIComponent(url),'sharer','toolbar=0,status=0,width=626,height=436');
    //  'http://www.facebook.com/sharer.php?u='+encodeURIComponent(url)+'&t='+encodeURIComponent(text),'sharer','toolbar=0,status=0,width=626,height=436, caption=' + text

      // http://www.facebook.com/sharer.php?s=100&p[title]=YOUR_TITLE&p[summary]=YOUR_SUMMARY&p[url]=YOUR_URL&p[images][0]=YOUR_IMAGE_TO_SHARE_OBJECT
    window.open('http://www.facebook.com/sharer.php?s=100&p[summary]=' + text + 'p[images][0]=' + url);return false
  }


}
