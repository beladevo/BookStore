using BookStore.Core.Entities;
using FluentValidation;

namespace BookStore.Application.Validators
{
    public class BookValidator : AbstractValidator<Book>
    {
        public BookValidator()
        {
            RuleFor(book => book)
                .NotNull().WithMessage("Book cannot be null.");

            RuleFor(book => book.Isbn)
                .NotEmpty().WithMessage("ISBN is required.");

            RuleFor(book => book.Title)
                .NotEmpty().WithMessage("Title is required.");

            RuleFor(book => book.Authors)
                .NotNull().WithMessage("At least one author is required and cannot be empty.")
                .Must(authors => authors != null && authors.Count > 0 && authors.All(a => !string.IsNullOrWhiteSpace(a)))
                .WithMessage("At least one author is required and cannot be empty.");

            RuleFor(book => book.Category)
                .NotEmpty().WithMessage("Category is required.");

            RuleFor(book => book.Year)
                .InclusiveBetween(1000, DateTime.UtcNow.Year + 1)
                .WithMessage("Invalid year.");

            RuleFor(book => book.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");
        }
    }
}
