import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInventoryUpdateComponent } from './form-inventory-update.component';

describe('FormInventoryUpdateComponent', () => {
  let component: FormInventoryUpdateComponent;
  let fixture: ComponentFixture<FormInventoryUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormInventoryUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInventoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
