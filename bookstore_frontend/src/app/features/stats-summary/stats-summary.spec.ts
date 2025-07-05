import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSummary } from './stats-summary';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('StatsSummary', () => {
  let component: StatsSummary;
  let fixture: ComponentFixture<StatsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsSummary],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
