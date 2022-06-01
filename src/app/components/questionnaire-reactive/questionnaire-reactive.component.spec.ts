import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireReactiveComponent } from './questionnaire-reactive.component';

describe('QuestionnaireReactiveComponent', () => {
  let component: QuestionnaireReactiveComponent;
  let fixture: ComponentFixture<QuestionnaireReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireReactiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
