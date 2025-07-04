import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelect } from './category-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CategorySelect', () => {
  let component: CategorySelect;
  let fixture: ComponentFixture<CategorySelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySelect, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorySelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
