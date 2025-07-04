using BookStore.Core.Entities;

namespace BookStore.Core.Interfaces
{

    public interface IBookRepository
    {
        List<Book> GetAll();
        Book? GetByIsbn(string isbn);
        void Add(Book book);
        void Update(string isbn, Book book);
        void Delete(string isbn);
    }
}
