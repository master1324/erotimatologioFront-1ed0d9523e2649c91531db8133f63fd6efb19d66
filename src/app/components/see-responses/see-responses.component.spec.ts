import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeResponsesComponent } from './see-responses.component';

describe('SeeResponsesComponent', () => {
  let component: SeeResponsesComponent;
  let fixture: ComponentFixture<SeeResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
