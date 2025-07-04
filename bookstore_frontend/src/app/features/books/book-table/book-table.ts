import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { openConfirmDeleteDialog } from '../../../shared/components/confirm-dialog/confirm-dialog.util';
import { StorageService } from '../../../core/services/storage.service';
import { CACHE_KEYS } from '../../../core/constants/cache-keys';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  switchMap,
  tap,
  map,
  debounceTime,
  catchError,
  of,
  shareReplay,
} from 'rxjs';
import { DownloadService } from '../../../core/services/download.service';
import { CategorySelect } from '../../../shared/components/category-select/category-select';
import { Book } from '../../../core/models/book.model';
import { APP_CONFIG } from '../../../core/constants/app-config';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-book-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    CategorySelect,
  ],
  templateUrl: './book-table.html',
  styleUrls: ['./book-table.scss'],
})
export class BookTable implements OnInit {
  displayedColumns = [
    'isbn',
    'title',
    'authors',
    'category',
    'year',
    'price',
    'actions',
  ];


  search$ = new BehaviorSubject<string>('');
  category$ = new BehaviorSubject<string>('All');

  initialPageSize!: number;

  page$!: BehaviorSubject<{ pageIndex: number; pageSize: number }>;

  totalCount = 0;
  books$: Observable<Book[]> = new Observable<Book[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private storage: StorageService,
    private download: DownloadService,
    private notify: NotificationService,
  ) {}

  ngOnInit() {
    console.log('on init');
    
    this.initialPageSize =
      this.storage.get<number>(CACHE_KEYS.BOOKS_PAGE_SIZE) ??
      APP_CONFIG.DEFAULT_PAGE_SIZE;

    this.page$ = new BehaviorSubject<{ pageIndex: number; pageSize: number }>({
      pageIndex: 0,
      pageSize: this.initialPageSize,
    });

    this.books$ = combineLatest([
      this.page$,
      this.search$.pipe(debounceTime(300)),
      this.category$,
    ]).pipe(
      switchMap(([page, search, category]) =>
      {
        console.log('on switch map');
        return this.bookService
          .getAll(page.pageIndex + 1, page.pageSize, search, category)
          .pipe(
            tap((response) => (this.totalCount = response.totalCount)),
            map((response) => response.items),
            catchError((error: any) => {
              console.error('Error loading books:', error);
              this.notify.error('Failed to load books. Please try again later.');
              return of([]);
            })
          )
          
        }
      ),
      shareReplay(1)

    );
  }

  onPageChange(event: PageEvent) {
    this.storage.set<number>(CACHE_KEYS.BOOKS_PAGE_SIZE, event.pageSize);

    this.page$.next({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  confirmDelete(book: Book) {
    openConfirmDeleteDialog(
      this.dialog,
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.bookService.delete(book.isbn).subscribe({
          next: () => {
            this.page$.next({ ...this.page$.value });
            this.notify.success(`Book "${book.title}" deleted successfully.`);
          },
          error: (error) => {
            console.error('[Delete Error]', error);
            const message = error?.error?.message ?? 'Failed to delete book.';
            this.notify.error(message);
          },
        });
      }
    });
  }

  exportReport() {
    this.download.downloadBooksReport('BookReport.html');
  }
}
