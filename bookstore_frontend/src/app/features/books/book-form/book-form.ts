import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../core/services/book.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CategorySelect } from '../../../shared/components/category-select/category-select';
import { Book } from '../../../core/models/book.model';
import { NotificationService } from '../../../core/services/notification.service';
import { openConfirmDeleteDialog } from '../../../shared/components/confirm-dialog/confirm-dialog.util';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    CategorySelect,
  ],
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.scss'],
})
export class BookForm implements OnInit {
  form!: FormGroup;
  isbn: string | null = null;
  isEdit = false;
  categories$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.isbn = this.route.snapshot.paramMap.get('isbn');
    this.isEdit = !!this.isbn;

    this.categories$ = this.categoryService.getCategories();

    this.form = this.fb.group({
      isbn: [{ value: '', disabled: this.isEdit }, [Validators.required, Validators.maxLength(20)]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      authors: ['', [Validators.required, this.authorsValidator]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      year: ['', [Validators.required, Validators.pattern(/^\d{4}$/), this.yearValidator]],
      price: ['', [Validators.required, Validators.min(0)]],
    });

    if (this.isEdit) {
      this.bookService.getByIsbn(this.isbn!).subscribe((book) => {
        this.form.patchValue({
          isbn: book.isbn,
          title: book.title,
          authors: book.authors?.join(', '),
          category: book.category,
          year: book.year,
          price: book.price,
        });
        this.form.get('isbn')?.disable();
      });
    }
  }

  private authorsValidator(control: import('@angular/forms').AbstractControl) {
    const value = control.value;
    if (!value) return { authors: 'At least one author is required.' };
    const authors = value.split(',').map((a: string) => a.trim()).filter((a: string) => a);
    if (!authors.length || authors.some((a: string) => !a)) {
      return { authors: 'At least one author is required and cannot be empty.' };
    }
    return null;
  }

  private yearValidator(control: import('@angular/forms').AbstractControl) {
    const value = Number(control.value);
    const currentYear = new Date().getFullYear();
    if (isNaN(value) || value < 1000 || value > currentYear + 1) {
      return { year: 'Invalid year.' };
    }
    return null;
  }

  save() {
    if (this.form.invalid) {
      this.notify.error('Please fix the errors in the form.');
      return;
    }
    const authorsArray = this.form
      .get('authors')
      ?.value.split(',')
      .map((a: string) => a.trim())
      .filter((a: string) => a);

    if (this.isEdit) {
      const updatedBook: Book = {
        isbn: this.isbn!,
        ...this.form.getRawValue(),
        authors: authorsArray,
      };

      this.bookService.update(this.isbn!, updatedBook).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.notify.success(
            `Book "${updatedBook.title}" updated successfully.`
          );
        },
        error: (error) => {
          console.error('[Update Error]', error);
          const message = error?.error?.message ?? 'Failed to update book.';
          this.notify.error(message);
        },
      });
    } else {
      const newBook: Book = {
        ...this.form.value,
        authors: authorsArray,
      };

      this.bookService.create(newBook).subscribe({
        next: () => {
          this.router.navigate(['/'], { state: { newIsbn: newBook.isbn } });
          console.log("🚀 ~ BookForm ~ this.bookService.create ~ newIsbn: newBook.isbn:", newBook.isbn)
          this.notify.success(`Book "${newBook.title}" created successfully.`);
        },
        error: (error) => {
          console.error('[Create Error]', error);
          const message = error?.error?.message ?? 'Failed to create book.';
          this.notify.error(message);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
  delete() {
    openConfirmDeleteDialog(
      this.dialog,
      'Delete Book',
      `Are you sure you want to delete "${this.form.get('title')?.value}"?`
    ).subscribe((confirmed) => {
      if (confirmed && this.isbn) {
        this.bookService.delete(this.isbn).subscribe({
          next: () => {
            this.router.navigate(['/']);
            this.notify.success(
              `Book "${this.form.get('title')?.value}" deleted successfully.`
            );
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
}
