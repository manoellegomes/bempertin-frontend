import { FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Utils {
  minLengthPass: number = 8;
  minLengthText: number = 3;
  alertTypeSuccess = "success alert-with-icon";
  alertTypeError = "warning alert-with-icon";
  urlImgDefault = "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg";

  password(formUser: FormGroup) {
    return formUser.get("password").value ===
      formUser.get("password_confirmation").value
      ? null
      : { passwordNotMatch: true };
  }
  
shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
