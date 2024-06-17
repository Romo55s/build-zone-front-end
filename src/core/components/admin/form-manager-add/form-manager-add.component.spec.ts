import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManagerAddComponent } from './form-manager-add.component';

describe('FormManagerAddComponent', () => {
  let component: FormManagerAddComponent;
  let fixture: ComponentFixture<FormManagerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormManagerAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormManagerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
