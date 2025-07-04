import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-global-loader',
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './global-loader.html',
  styleUrls: ['./global-loader.scss'],
})
export class GlobalLoader {
  constructor(public loader: LoaderService) {}
}
