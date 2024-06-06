import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInventoryAddComponent } from './form-inventory-add.component';

describe('FormInventoryAddComponent', () => {
  let component: FormInventoryAddComponent;
  let fixture: ComponentFixture<FormInventoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormInventoryAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInventoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
