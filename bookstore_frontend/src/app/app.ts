import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { GlobalLoader } from './shared/components/global-loader/global-loader';
import { DarkModeToggleComponent } from './shared/components/dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, GlobalLoader, DarkModeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly title = 'Bookstore';
}
