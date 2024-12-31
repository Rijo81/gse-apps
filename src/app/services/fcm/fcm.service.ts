//  Apply push notification : https://ionicframework.com/docs/native/push-notifications  y https://www.youtube.com/watch?v=pVsOIXjKbas
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications'
import { StorageService } from '../storage.service';
import { BehaviorSubject } from 'rxjs';
import { FCM_TOKEN } from 'src/app/constansts';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);
  get redirect() {

    return this._redirect.asObservable()
  }
  constructor(private storage: StorageService) { }


  async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      console.log("a")
      await this.registerPush();
      console.log("b")
    }
  }

  private async registerPush() {
    try {
      console.log("step 1")
      this.addListeners();
      console.log("step 2")
      let permStatus = await PushNotifications.checkPermissions();
      console.log("step 3")

      if (permStatus.receive === 'prompt') {
        console.log("step 4")
        permStatus = await PushNotifications.requestPermissions();
        console.log("step 5")
      }

      console.log("step 6")
      if (permStatus.receive !== 'granted') {
        console.log("step 7")
        throw new Error("Usuario ha denegado el permiso de las notificaciones")

      }
      console.log("step 8")

      await PushNotifications.register();
      console.log("step 9")

    } catch (error) {
      console.log("step 10")
      console.log(error);
      console.log(`registration push ${error}`)
    }
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log("delivered Notifications", notificationList);
  }

  addListeners() {
    PushNotifications.addListener('registration', async (token: Token) => {
      try {


        console.log("registration 1")
        console.log("My Token: ", token);
        const fcmtoken = (token?.value);
        let go = 1;
        console.log("registration 2")
        const savedToken = await this.storage.get(FCM_TOKEN)
        console.log("registration 3")
        if (savedToken) {
          if (fcmtoken == savedToken) {
            console.log("same token");
            go = 0
            console.log("registration 4")
          } else {
            go = 2;
            console.log("registration 5")
          }
        }

        if (go == 1) {
          console.log("registration 6")
          await this.storage.set(FCM_TOKEN, fcmtoken)
        } else if (go == 2) {
          const data = {
            expired_token: savedToken,
            refreshed_token: fcmtoken
          }
          console.log("registration 7")
          await this.storage.set(FCM_TOKEN, fcmtoken)
          console.log("registration 8")
        }
      } catch (error) {
        console.log(`Error registration listner, ${error}`)
      }
    })

    PushNotifications.addListener('registrationError', (error: any) => {

      console.log(`ERROR: ${error}`);
    })

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      try {

        console.log("Push received: " + JSON.stringify(notification));
        const data = notification?.data
        if (data?.redirect) this._redirect.next(data?.redirect)
      } catch (error) {
        console.log(`ERROR pushNotificationReceived ${error}`)
      }
    })

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
      try {
        const data = notification.notification.data;
        console.log(`Action perfomed: ${JSON.stringify(notification.notification)}`);
        console.log("push data ", data);
        if (data?.redirect) this._redirect.next(data?.redirect)

      } catch (error) {
        console.log(`pushNotificationActionPerformed ${error}`)
      }
    })
  }

  async removeFcmToken() {
    try {
      await this.storage.remove(FCM_TOKEN)
    } catch (error) {
      console.log("e");
      console.log(`removeFcmToken ${error}`)
    }
  }
}
