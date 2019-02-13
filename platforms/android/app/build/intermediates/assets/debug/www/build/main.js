webpackJsonp([2],{

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginpagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_constants_constants__ = __webpack_require__(179);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_utility_utility__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_settersandgetters_settersandgetters__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_services_request_handler_service__ = __webpack_require__(183);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// import { FingerprintAIO } from '@ionic-native/fingerprint-aio';



/**
 * Generated class for the LoginpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginpagePage = /** @class */ (function () {
    function LoginpagePage(navCtrl, navParams, utility, setAndGet, camera, platform, service) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.utility = utility;
        this.setAndGet = setAndGet;
        this.camera = camera;
        this.platform = platform;
        this.service = service;
        this.data = {
            userName: ""
        };
        this.isFirstTimeLogin = false;
        this.platform.ready().then(function () {
            _this.options = _this.getCameraOptions();
        });
    }
    LoginpagePage.prototype.login = function () {
        if (!this.data.userName) {
            this.utility.presentAlert("Please enter Username!");
            return;
        }
        // else {
        //   //Check if Fingerprint or Face  is available
        //   this.faio.isAvailable()
        //     .then(result => {
        //       console.log(result);
        //       if (result === "finger" || result === "face") {
        //         //Fingerprint or Face Auth is available
        //         console.log("Fingerprint or Face Exist!")
        //         this.faio.show({
        //           clientId: 'DemoBioAuthApp',
        //           clientSecret: 'bioAuthDemo', //Only necessary for Android
        //           disableBackup: true, //Only for Android(optional)
        //           localizedFallbackTitle: 'Use Pin', //Only for iOS
        //           localizedReason: 'Please Authenticate' //Only for iOS
        //         })
        //           .then((result: any) => {
        //             console.log(result);
        //             if (result) {
        //               this.setAndGet.UserName = this.data.userName;
        //               this.navCtrl.setRoot('DashboardPage');
        //             }
        //             else {
        //               //Fingerprint/Face was not successfully verified
        //               this.utility.presentAlert(result);
        //             }
        //           })
        //           .catch((error: any) => {
        //             //Fingerprint/Face was not successfully verified
        //             this.utility.presentAlert(error);
        //           });
        //       }
        //       else {
        //         //Fingerprint or Face Auth is not available
        //         this.utility.presentAlert("Fingerprint/Face Auth is not available on this device!");
        //         console.log("Fingerprint/Face Auth is not available on this device!")
        //       }
        //     })
        // }
        this.analyzeFace();
    };
    LoginpagePage.prototype.getCameraOptions = function () {
        return {
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 600,
            targetHeight: 600,
            saveToPhotoAlbum: false,
            allowEdit: true,
            sourceType: 1,
            correctOrientation: false,
            cameraDirection: 1
        };
    };
    LoginpagePage.prototype.analyzeFace = function () {
        var _this = this;
        this.error = null;
        this.takePhoto(
        // If photo was taken
        function (photo) {
            _this.image = photo;
            _this.loading = true;
            _this.sendToImgur(photo);
        }, 
        // If photo wasn't taken
        function () {
            _this.error = "Error: Phone couldn't take the photo.";
        });
    };
    // Takes a photo and returns it in a callback
    LoginpagePage.prototype.takePhoto = function (taken, notTaken) {
        if (taken === void 0) { taken = null; }
        if (notTaken === void 0) { notTaken = null; }
        this.camera.getPicture(this.options).then(function (imageData) {
            var base64Image = 'data:image/jpeg;base64,' + imageData;
            if (taken) {
                taken(base64Image);
            }
        }, function (e) {
            if (notTaken) {
                notTaken(e);
            }
        });
    };
    LoginpagePage.prototype.sendToImgur = function (image) {
        var _this = this;
        image = image.substring(image.indexOf('base64,') + 'base64,'.length);
        var formData = new FormData();
        formData.append('image', image);
        this.service.sendImageToImgur(image).subscribe(function (imgurRes) {
            console.log('imgurRes', imgurRes);
            var serialize = function (parameters) { return Object.keys(parameters).map(function (key) { return key + '=' + parameters[key]; }).join('&'); };
            var faceParameters = {
                returnFaceId: true,
                returnFaceLandmarks: false,
                returnFaceAttributes: __WEBPACK_IMPORTED_MODULE_0__providers_constants_constants__["a" /* Constants */].FACE_ATTRIBUTES
            };
            var serializedFaceParameters = serialize(faceParameters);
            _this.service.analyzeFaceViaAzure(imgurRes.data.link, serializedFaceParameters).subscribe(function (azure) {
                console.log('azure', azure);
                if (_this.isFirstTimeLogin) {
                    sessionStorage.setItem('faceId1', azure[0].faceId);
                }
                _this.loading = false;
                var faceId1 = sessionStorage.getItem('faceId1') ? sessionStorage.getItem('faceId1') : '';
                _this.service.verifyFaceViaAzure(faceId1, azure[0].faceId).subscribe(function (verifyRes) {
                    console.log(verifyRes);
                });
            }, function (err) {
                console.log(err);
                _this.loading = false;
            }, function () {
            });
        }, function (err) {
            console.log(err);
            _this.loading = false;
        }, function () {
        });
    };
    LoginpagePage.prototype.register = function () {
        this.isFirstTimeLogin = true;
        this.analyzeFace();
    };
    LoginpagePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-loginpage',template:/*ion-inline-start:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\pages\loginpage\loginpage.html"*/'<ion-header>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding style="background-color:silver" >\n\n\n\n  <h1 style="text-align: center; margin-top: 10%;font-style:italic; font-family:Cambria; font-size:30px">Face Auth <br> Demo App</h1>\n\n  <div class="container">\n\n    <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>\n\n  </div>\n\n  <div *ngIf="error" class="error">\n\n        {{ error }}\n\n  </div>\n\n  <form style="margin-top: 10%" >\n\n    <div class="container">\n\n      <label><b>Username</b></label>\n\n      <input type="text" placeholder="Enter Username" name="uname" [(ngModel)]="data.userName" required>\n\n\n\n      <button type="submit" (tap)="login();" >Login</button>\n\n      <label>\n\n        <input type="checkbox" checked="checked"> Remember me\n\n      </label>\n\n      <button type="submit" (tap)="register();" >First time Login</button>\n\n    </div>\n\n  </form>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\pages\loginpage\loginpage.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__providers_utility_utility__["a" /* UtilityProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_settersandgetters_settersandgetters__["a" /* SettersandgettersProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_6__providers_services_request_handler_service__["a" /* ServiceRequest */]])
    ], LoginpagePage);
    return LoginpagePage;
}());

//# sourceMappingURL=loginpage.js.map

/***/ }),

/***/ 135:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 135;

/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/dashboard/dashboard.module": [
		402,
		0
	],
	"../pages/loginpage/loginpage.module": [
		403,
		1
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 178;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    // Imgur image upload endpoint
    // This is the same for everybody.
    Constants.IMGUR_ENDPOINT = 'https://api.imgur.com/3/image';
    // Imgur client ID
    Constants.IMGUR_CLIENT_ID = 'ee25e6c79b22423';
    // Azure Face API endpoint
    Constants.AZURE_ENDPOINT = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0';
    // Azure Face API key
    Constants.AZURE_API_KEY = '034211f6b08e4e75ae9285e5fc02c369';
    // temp faceId
    Constants.faceId = '0dd308d4-5a06-42d7-9363-42026953b5f6';
    Constants.FACE_ATTRIBUTES = "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
    return Constants;
}());

//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 180:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilityProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the UtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI. */
var UtilityProvider = /** @class */ (function () {
    function UtilityProvider(alertCtrl) {
        this.alertCtrl = alertCtrl;
    }
    //Show popup alert
    UtilityProvider.prototype.presentAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: msg,
            buttons: ['Ok']
        });
        alert.present();
    };
    UtilityProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], UtilityProvider);
    return UtilityProvider;
}());

//# sourceMappingURL=utility.js.map

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServiceRequest; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants_constants__ = __webpack_require__(179);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ServiceRequest = /** @class */ (function () {
    function ServiceRequest(http) {
        this.http = http;
    }
    /** post data */
    ServiceRequest.prototype.postData = function (url, body, token) {
        var options = this.setRequestOptions(token);
        return this.http.post(url, body, options).pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["map"])(function (response) { return response.json(); }));
    };
    /** get data */
    ServiceRequest.prototype.getData = function (url, token) {
        var options = this.setRequestOptions(token);
        return this.http.get(url, options).pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["map"])(function (response) { return response.json(); }));
    };
    /** update data */
    ServiceRequest.prototype.putData = function (url, body, token) {
        var options = this.setRequestOptions(token);
        return this.http.put(url, body, options).pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["map"])(function (response) { return response.json(); }));
    };
    /** set request Options */
    ServiceRequest.prototype.setRequestOptions = function (token) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return options;
    };
    ServiceRequest.prototype.sendImageToImgur = function (image) {
        var auth = "Client-ID " + __WEBPACK_IMPORTED_MODULE_3__constants_constants__["a" /* Constants */].IMGUR_CLIENT_ID;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Authorization': auth
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(__WEBPACK_IMPORTED_MODULE_3__constants_constants__["a" /* Constants */].IMGUR_ENDPOINT, image, options).pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["map"])(function (response) { return response.json(); }));
    };
    ServiceRequest.prototype.analyzeFaceViaAzure = function (link, serializedFaceParameters) {
        var url = __WEBPACK_IMPORTED_MODULE_3__constants_constants__["a" /* Constants */].AZURE_ENDPOINT + "/detect?" + serializedFaceParameters;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': __WEBPACK_IMPORTED_MODULE_3__constants_constants__["a" /* Constants */].AZURE_API_KEY
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        var payload = JSON.stringify({ 'url': link });
        return this.http.post(url, payload, options).pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["map"])(function (response) { return response.json(); }));
    };
    ServiceRequest.prototype.verifyFaceViaAzure = function (faceId1, faceId2) {
        var url = __WEBPACK_IMPORTED_MODULE_3__constants_constants__["a" /* Constants */].AZURE_ENDPOINT + "/verify";
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': __WEBPACK_IMPORTED_MODULE_3__constants_constants__["a" /* Constants */].AZURE_API_KEY
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        var payload = {
            'faceId1': faceId1,
            'faceId2': faceId2
        };
        return this.http.post(url, payload, options).pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["map"])(function (response) { return response.json(); }));
    };
    ServiceRequest = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]])
    ], ServiceRequest);
    return ServiceRequest;
}());

//# sourceMappingURL=request-handler.service.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_settersandgetters_settersandgetters__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, setAndGet) {
        this.navCtrl = navCtrl;
        this.setAndGet = setAndGet;
        this.data = { name: "" };
        console.log(this.setAndGet.UserName);
        this.data.name = this.setAndGet.UserName;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Fingerprint Auth Demo App</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-card>\n\n      <ion-card-header>\n\n          <h1 style="text-align: center">Welcome {{ data.name }}</h1>\n\n      </ion-card-header>\n\n      <ion-card-content>\n\n        You have arrived at the future!\n\n      </ion-card-content>\n\n    </ion-card>\n\n\n\n    <br>\n\n\n\n    <ion-card>\n\n        <ion-card-header>\n\n         Features\n\n        </ion-card-header>\n\n      \n\n        <ion-list>\n\n          <button ion-item (click)="gotToPage(1)">\n\n            <ion-icon name="md-globe" item-start></ion-icon>\n\n            World Transfers\n\n          </button>\n\n      \n\n        </ion-list>\n\n      </ion-card>\n\n</ion-content>\n\n<ion-footer>\n\n    <ion-toolbar>\n\n      <ion-title>Demo 2018.</ion-title>\n\n    </ion-toolbar>\n\n  </ion-footer>\n\n\n\n\n\n'/*ion-inline-end:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_settersandgetters_settersandgetters__["a" /* SettersandgettersProvider */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ListPage = /** @class */ (function () {
    function ListPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.items = [];
        for (var i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    }
    ListPage_1 = ListPage;
    ListPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(ListPage_1, {
            item: item
        });
    };
    ListPage = ListPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-list',template:/*ion-inline-start:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\pages\list\list.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n\n      {{item.title}}\n\n      <div class="item-note" item-end>\n\n        {{item.note}}\n\n      </div>\n\n    </button>\n\n  </ion-list>\n\n  <div *ngIf="selectedItem" padding>\n\n    You navigated here from <b>{{selectedItem.title}}</b>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(254);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_list_list__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_loginpage_loginpage__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_settersandgetters_settersandgetters__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_fingerprint_aio__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_utility_utility__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__providers_services_request_handler_service__ = __webpack_require__(183);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_loginpage_loginpage__["a" /* LoginpagePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/dashboard/dashboard.module#DashboardPageModule', name: 'DashboardPage', segment: 'dashboard', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/loginpage/loginpage.module#LoginpagePageModule', name: 'LoginpagePage', segment: 'loginpage', priority: 'low', defaultHistory: [] }
                    ]
                }),
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_loginpage_loginpage__["a" /* LoginpagePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_14__providers_services_request_handler_service__["a" /* ServiceRequest */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_11__providers_settersandgetters_settersandgetters__["a" /* SettersandgettersProvider */],
                __WEBPACK_IMPORTED_MODULE_12__ionic_native_fingerprint_aio__["a" /* FingerprintAIO */],
                __WEBPACK_IMPORTED_MODULE_13__providers_utility_utility__["a" /* UtilityProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_loginpage_loginpage__ = __webpack_require__(124);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_6__pages_loginpage_loginpage__["a" /* LoginpagePage */];
        this.initializeApp();
        this.pages = [
            { title: 'Home', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */] },
            { title: 'List', component: __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */] }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\app\app.html"*/'<ion-menu [content]="content">\n\n  <ion-header>\n\n    <ion-toolbar>\n\n      <ion-title>Menu</ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n\n\n  <ion-content>\n\n    <ion-list>\n\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n\n        {{p.title}}\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"C:\Users\user\Desktop\BiometricAuthenticationApp\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettersandgettersProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/*
  Generated class for the SettersandgettersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var SettersandgettersProvider = /** @class */ (function () {
    function SettersandgettersProvider() {
        console.log('Hello SettersandgettersProvider Provider');
    }
    Object.defineProperty(SettersandgettersProvider.prototype, "UserName", {
        get: function () {
            return this.username;
        },
        set: function (val) {
            this.username = val;
        },
        enumerable: true,
        configurable: true
    });
    SettersandgettersProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], SettersandgettersProvider);
    return SettersandgettersProvider;
}());

//# sourceMappingURL=settersandgetters.js.map

/***/ })

},[246]);
//# sourceMappingURL=main.js.map