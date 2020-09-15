import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { Utils } from "../../../shared/utils/utils";
import { UserService } from "../../services/user/user.service";
import { UserFields } from "../../entities/userFields";
import { TextsPortuguese } from "../../../shared/texts/texts-portuguese";

@Component({
  selector: "app-profile",
  templateUrl: "profile.component.html",
  styleUrls: ["profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  formUser: FormGroup;
  msgAlert: string = "";
  typeAlert: string = "";
  avatar: string = "";
  editable: boolean = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private utils: Utils,
    private texts: TextsPortuguese
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");

    this.createForm(new UserFields());
    this.getProfile();
    this.formUser.disable();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  createForm(user: UserFields) {
    this.formUser = this.formBuilder.group(
      {
        id: [user.id],
        email: [user.email, [Validators.required, Validators.email]],
        avatar: [user.avatar],
        remember: [user.remember],
        password: [
          user.password,
          [Validators.required, Validators.minLength(this.utils.minLengthPass)],
        ],
        last_name: [user.last_name],
        first_name: [user.first_name],
        password_confirmation: [user.password_confirmation],
      },
      {
        validators: this.utils.password.bind(this),
      }
    );
  }

  getProfile() {
    this.userService.getProfile(this.formUser.value).subscribe(
      (res) => {
        this.avatar = res["data"].avatar;
        sessionStorage['avatar'] = this.avatar;
        let form = this.formUser.controls;
        let password = res["data"].password || "cityslicka";
        let password_confirmation =
          res["data"].password_confirmation || "cityslicka";

        form.id.setValue(res["data"].id);
        form.avatar.setValue(res["data"].avatar);
        form.first_name.setValue(res["data"].first_name);
        form.last_name.setValue(res["data"].last_name);
        form.email.setValue(res["data"].email);
        form.password.setValue(password);
        form.password_confirmation.setValue(password_confirmation);
      },
      (dataError) => {
        this.formatError(dataError.error.error);
      }
    );
  }

  formatError(error: string) {
    switch (error) {
      case "user not found":
        this.msgAlert = this.texts.messages.userNotFound;
        break;

      case "Note: Only defined users succeed registration":
        this.msgAlert = this.texts.messages.onlyDefinedUsers;
        break;

      default:
        this.msgAlert = this.texts.messages.genericError;
        break;
    }
  }

  onChangeEditSwitch(event) {
    this.editable = event.currentValue;
    this.msgAlert = "";
    this.checkStatusEdit();
  }

  checkStatusEdit() {
    this.editable ? this.formUser.enable() : this.formUser.disable();
  }

  onSubmit() {
    this.userService.updateProfile(this.formUser.value).subscribe(
      (res) => {
        this.avatar = res["avatar"];
        let form = this.formUser.controls;

        form.id.setValue(res["id"]);
        form.avatar.setValue(this.avatar);
        form.first_name.setValue(res["first_name"]);
        form.last_name.setValue(res["last_name"]);
        form.email.setValue(res["email"]);
        form.password.setValue(res["password"]);
        form.password_confirmation.setValue(res["password_confirmation"]);

        this.typeAlert = this.utils.alertTypeSuccess;
        this.msgAlert = this.texts.messages.successUpdate;
        this.editable = false;
        this.checkStatusEdit();
      },
      (dataError) => {
        this.typeAlert = this.utils.alertTypeError;
        this.msgAlert = this.texts.messages.errorUpdate;
        this.formatError(dataError.error.error);
      }
    );
  }
}
