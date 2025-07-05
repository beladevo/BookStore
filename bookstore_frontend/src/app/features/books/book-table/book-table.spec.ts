import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookTable } from './book-table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../core/services/book.service';
import { StorageService } from '../../../core/services/storage.service';
import { DownloadService } from '../../../core/services/download.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('BookTable', () => {
  let component: BookTable;
  let fixture: ComponentFixture<BookTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTable, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: BookService,
          useValue: {
            getAll: jasmine
              .createSpy('getAll')
              .and.returnValue(of({ totalCount: 0, items: [] })),
            delete: jasmine.createSpy('delete').and.returnValue(of(undefined)),
            getStats: jasmine.createSpy('getStats').and.returnValue(
              of({
                totalBooks: 0,
                totalCategories: 0,
                totalAuthors: 0,
              })
            ),
          },
        },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(false) }) },
        },
        {
          provide: StorageService,
          useValue: { get: () => undefined, set: () => {} },
        },
        {
          provide: DownloadService,
          useValue: {
            downloadBooksReport: jasmine.createSpy('downloadBooksReport'),
          },
        },
        {
          provide: NotificationService,
          useValue: { show: jasmine.createSpy('show') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books', (done) => {
    const bookService = TestBed.inject(BookService);
    (bookService.getAll as jasmine.Spy).and.returnValue(
      of({
        totalCount: 1,
        items: [
          {
            isbn: '1',
            title: 'T',
            authors: ['A'],
            category: 'C',
            year: 2020,
            price: 1,
          },
        ],
      })
    );
    component.ngOnInit();
    component.books$.subscribe((books) => {
      expect(books.length).toBe(1);
      expect(books[0].title).toBe('T');
      done();
    });
  });
});
