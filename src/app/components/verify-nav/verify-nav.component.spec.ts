import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyNavComponent } from './verify-nav.component';

describe('VerifyNavComponent', () => {
  let component: VerifyNavComponent;
  let fixture: ComponentFixture<VerifyNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
