import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireIdentifiersComponent } from './questionnaire-identifiers.component';

describe('QuestionnaireIdentifiersComponent', () => {
  let component: QuestionnaireIdentifiersComponent;
  let fixture: ComponentFixture<QuestionnaireIdentifiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireIdentifiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireIdentifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
