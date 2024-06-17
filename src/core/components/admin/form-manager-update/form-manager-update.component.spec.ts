import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManagerUpdateComponent } from './form-manager-update.component';

describe('FormManagerUpdateComponent', () => {
  let component: FormManagerUpdateComponent;
  let fixture: ComponentFixture<FormManagerUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormManagerUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormManagerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
