import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalLoginRegisterComponent } from "./modal-login-register.component";

describe("ModalLoginRegisterComponent", () => {
  let component: ModalLoginRegisterComponent;
  let fixture: ComponentFixture<ModalLoginRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLoginRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
