import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProductAdminComponent } from './table-product-admin.component';

describe('TableProductAdminComponent', () => {
  let component: TableProductAdminComponent;
  let fixture: ComponentFixture<TableProductAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableProductAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableProductAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
