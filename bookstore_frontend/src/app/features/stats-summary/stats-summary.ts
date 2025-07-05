import { Component, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./stats-summary.scss'],
  imports: [MatCardModule, MatIconModule, CommonModule],
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
export class StatsSummary implements OnInit {
  @Input() totalBooks = 0;
  @Input() totalAuthors = 0;
  @Input() totalCategories = 0;

  displayedBooks = 0;
  displayedAuthors = 0;
  displayedCategories = 0;

  ngOnInit() {
    this.animateCount(0, this.totalBooks, 1000, (val) => (this.displayedBooks = val));
    this.animateCount(0, this.totalAuthors, 1000, (val) => (this.displayedAuthors = val));
    this.animateCount(0, this.totalCategories, 1000, (val) => (this.displayedCategories = val));
  }

  animateCount(
    start: number,
    end: number,
    duration: number,
    setter: (val: number) => void
  ) {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(start + (end - start) * progress);
      setter(currentValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  get stats() {
    return [
      { icon: 'library_books', label: 'Books' },
      { icon: 'category', label: 'Categories' },
      { icon: 'person', label: 'Authors' },
    ];
  }

  getAnimatedValue(label: string): number {
    switch (label) {
      case 'Books':
        return this.displayedBooks;
      case 'Categories':
        return this.displayedCategories;
      case 'Authors':
        return this.displayedAuthors;
      default:
        return 0;
    }
  }
}
