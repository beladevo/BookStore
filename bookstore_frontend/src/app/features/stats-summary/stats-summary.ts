import { Component, Input } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-stats-summary',
  templateUrl: './stats-summary.html',
  imports: [MatCardModule, MatIconModule, CommonModule],
  styleUrls: ['./stats-summary.scss'],
  animations: [
    trigger('staggerFade', [
      transition(':enter', [
        query('mat-card', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate(
              '400ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class StatsSummary {
  @Input() totalBooks = 0;
  @Input() totalAuthors = 0;
  @Input() totalCategories = 0;

  get stats() {
    return [
      { icon: 'library_books', value: this.totalBooks, label: 'Books' },
      { icon: 'category', value: this.totalCategories, label: 'Categories' },
      { icon: 'person', value: this.totalAuthors, label: 'Authors' },
    ];
  }
}
