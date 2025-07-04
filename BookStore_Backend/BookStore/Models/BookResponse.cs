using System.ComponentModel.DataAnnotations;

namespace BookStore.API.Models
{

    public class BookResponse
    {
        public string Isbn { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = new();
        public string Category { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Price { get; set; }
    }
}
