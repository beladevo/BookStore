namespace BookStore.Core.Entities
{
    public class Book
    {
        public string Isbn { get; set; } = null!;
        public string Title { get; set; } = null!;
        public List<string> Authors { get; set; } = new();
        public string Category { get; set; } = null!;
        public int Year { get; set; }
        public decimal Price { get; set; }
    }
}
