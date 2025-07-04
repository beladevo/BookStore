import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dark-mode-toggle',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  template: `
    <button mat-icon-button (click)="theme.toggleDarkMode()" [attr.aria-label]="(theme.isDarkMode$ | async) ? 'Switch to light mode' : 'Switch to dark mode'">
      <mat-icon>{{ (theme.isDarkMode$ | async) ? 'dark_mode' : 'light_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    button {
      color: var(--app-primary);
      transition: color 0.2s;
    }
    mat-icon {
      font-size: 1.7rem;
    }
  `]
})
export class DarkModeToggleComponent {
  theme = inject(ThemeService);
}
