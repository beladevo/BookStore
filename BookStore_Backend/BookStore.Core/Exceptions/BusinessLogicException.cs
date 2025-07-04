using System;

namespace BookStore.Core.Exceptions
{
    public class BusinessLogicException : Exception
    {
        public BusinessLogicException(string message)
            : base(message)
        {
        }
    }
}