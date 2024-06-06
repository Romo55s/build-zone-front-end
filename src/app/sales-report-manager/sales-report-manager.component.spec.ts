import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportManagerComponent } from './sales-report-manager.component';

describe('SalesReportManagerComponent', () => {
  let component: SalesReportManagerComponent;
  let fixture: ComponentFixture<SalesReportManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesReportManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesReportManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
