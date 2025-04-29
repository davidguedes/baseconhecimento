import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentManangerComponent } from './document-mananger.component';

describe('DocumentManangerComponent', () => {
  let component: DocumentManangerComponent;
  let fixture: ComponentFixture<DocumentManangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentManangerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentManangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
