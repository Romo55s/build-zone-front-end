import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStoreAddComponent } from './form-store-add.component';

describe('FormStoreAddComponent', () => {
  let component: FormStoreAddComponent;
  let fixture: ComponentFixture<FormStoreAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormStoreAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormStoreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
