import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectInvoiceDialogComponent } from './collect-invoice-dialog.component';

describe('CollectInvoiceDialogComponent', () => {
  let component: CollectInvoiceDialogComponent;
  let fixture: ComponentFixture<CollectInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectInvoiceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
