import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookForm } from './book-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../core/services/book.service';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('BookForm', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookForm, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: BookService,
          useValue: {
            getByIsbn: jasmine.createSpy('getByIsbn').and.returnValue(of({
              isbn: '1',
              title: 'Test Book',
              authors: ['Author'],
              category: 'Category',
              year: 2020,
              price: 100
            })),
            create: jasmine.createSpy('create').and.returnValue(of({})),
            update: jasmine.createSpy('update').and.returnValue(of({})),
            delete: jasmine.createSpy('delete').and.returnValue(of({}))
          }
        },
        { provide: CategoryService, useValue: { getCategories: jasmine.createSpy('getCategories').and.returnValue(of(['Category'])) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(false) }) } },
        { provide: NotificationService, useValue: { show: jasmine.createSpy('show') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form if required fields are missing', () => {
    component.form.patchValue({ title: '', isbn: '', authors: '', category: '', year: '', price: '' });
    expect(component.form.invalid).toBeTrue();
  });
});
