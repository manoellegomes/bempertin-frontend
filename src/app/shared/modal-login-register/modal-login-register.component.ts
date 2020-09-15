import { Component, TemplateRef, Input, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UserService } from "../../pages/services/user/user.service";
import { UserFields } from "../../pages/entities/userFields";
import { Utils } from "./../utils/utils";

@Component({
  selector: "app-modal-login-register",
  templateUrl: "./modal-login-register.component.html",
  styleUrls: ["./modal-login-register.component.scss"],
})
export class ModalLoginRegisterComponent implements OnInit {
  modalRef: BsModalRef;
  @Input() labelButton: string;
  @Input() classButton: string;
  @Input() title: string;
  @Input() type: string;
  @Input() texts;
  formUser: FormGroup;
  errorMsg: string = "";
  requiredErrorMsg: string;

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private utils: Utils
  ) {}

  ngOnInit() {
    this.createForm(new UserFields());
    this.conditionalValidation();
  }

  conditionalValidation() {
    if (this.type === "register") {
      this.formUser
        .get("first_name")
        .setValidators([
          Validators.required,
          Validators.minLength(this.utils.minLengthText),
        ]);
      this.formUser
        .get("last_name")
        .setValidators([
          Validators.required,
          Validators.minLength(this.utils.minLengthText),
        ]);
      this.formUser
        .get("password_confirmation")
        .setValidators([
          Validators.required,
          Validators.minLength(this.utils.minLengthPass),
        ]);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.errorMsg = "";
    this.modalRef = this.modalService.show(template);
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

  onSubmit() {
    if (this.formUser.valid) {
      this.type === "login" ? this.sendLogin() : this.sendRegister();
    }
  }

  verifyAuthorization(res) {
    if (res["token"]) {
      this.modalRef.hide();

      let typeStorage = this.formUser.controls.remember.value ? localStorage : sessionStorage;

      typeStorage["token"] = res["token"];
      typeStorage["idUser"] = res["id"] ? res["id"] : 4;

      this.router.navigate(["/myprofile"]);
    }
  }

  formatError(error: string) {
    switch (error) {
      case "user not found":
        this.errorMsg = this.texts.messages.userNotFound;
        break;

      case "Note: Only defined users succeed registration":
        this.errorMsg = this.texts.messages.onlyDefinedUsers;
        break;

      default:
        this.errorMsg = this.texts.messages.genericError;
        break;
    }
  }

  sendLogin() {
    this.userService.postLogin(this.formUser.value).subscribe(
      (res) => {
        this.verifyAuthorization(res);
      },
      (dataError) => {
        this.formatError(dataError.error.error);
      }
    );
  }

  sendRegister() {
    this.userService.postRegister(this.formUser.value).subscribe(
      (res) => {
        this.verifyAuthorization(res);
      },
      (dataError) => {
        this.formatError(dataError.error.error);
      }
    );
  }
}
