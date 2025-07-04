import {
  Component,
  Input,
  forwardRef,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './category-select.html',
  styleUrls: ['./category-select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelect),
      multi: true,
    },
  ],
})
export class CategorySelect implements ControlValueAccessor, OnInit {
  @Output() optionSelected = new EventEmitter<string>();
  @Input() label = 'Category';
  categories$!: Observable<string[]>;

  value: string = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSelectOption(event: any, value: string) {
    if (event.isUserInput) {
      this.optionSelected.emit(value);
      this.onChange(value);
    }
  }
}
