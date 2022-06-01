import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnareStatsComponent } from './questionnare-stats.component';

describe('QuestionnareStatsComponent', () => {
  let component: QuestionnareStatsComponent;
  let fixture: ComponentFixture<QuestionnareStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnareStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnareStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
