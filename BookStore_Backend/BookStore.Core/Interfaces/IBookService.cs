using BookStore.Core.Entities;

namespace BookStore.Core.Interfaces
{
    public interface IBookService
    {
        List<Book> GetAll();
        (int totalCount, List<Book> items) GetPaged(int pageNumber, int pageSize, string? search, string? category);
        Book GetByIsbn(string isbn);
        List<string> GetDistinctCategories();
        void Add(Book book);
        void Update(string isbn, Book book);
        void Delete(string isbn);
    }
}
