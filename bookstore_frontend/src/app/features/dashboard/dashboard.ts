import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsSummary } from '../stats-summary/stats-summary';
import { BookTable } from '../books/book-table/book-table';
import { BookService } from '../../core/services/book.service';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { BookStats } from '../../core/models/book-stats.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    StatsSummary,
    BookTable,
  ],
  providers: [BookService],

  template: `
    <div class="dashboard-container">
      <h1>
        <mat-icon>dashboard</mat-icon>
        Dashboard
      </h1>

      <app-stats-summary
        *ngIf="stats$ | async as stats"
        [totalBooks]="stats.totalBooks"
        [totalAuthors]="stats.totalAuthors"
        [totalCategories]="stats.totalCategories"
      ></app-stats-summary>

      <mat-divider></mat-divider>

      <app-book-table></app-book-table>
    </div>
  `,
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  stats$: Observable<BookStats>;

  constructor(private bookService: BookService) {
    this.stats$ = this.bookService.getStats().pipe(
      catchError((error: any) => {
        console.error('Error loading stats:', error);
        return of({
          totalBooks: 0,
          totalCategories: 0,
          totalAuthors: 0,
        });
      }),
      shareReplay(1)
    );
  }
}
