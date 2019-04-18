import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignNavComponent } from './sign-nav.component';

describe('SignNavComponent', () => {
  let component: SignNavComponent;
  let fixture: ComponentFixture<SignNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
