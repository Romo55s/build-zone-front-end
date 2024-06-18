import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStoreUpdateComponent } from './form-store-update.component';

describe('FormStoreUpdateComponent', () => {
  let component: FormStoreUpdateComponent;
  let fixture: ComponentFixture<FormStoreUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormStoreUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormStoreUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
