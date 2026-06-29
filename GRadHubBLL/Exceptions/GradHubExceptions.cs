namespace GRadHubBLL.Exceptions
{
    /// <summary>Thrown when a requested resource does not exist.</summary>
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }
    }

    /// <summary>Thrown when a duplicate resource would be created.</summary>
    public class ConflictException : Exception
    {
        public ConflictException(string message) : base(message) { }
    }

    /// <summary>Thrown when a caller lacks permission to perform an action.</summary>
    public class ForbiddenException : Exception
    {
        public ForbiddenException(string message) : base(message) { }
    }

    /// <summary>Thrown when input fails business-rule validation.</summary>
    public class ValidationException : Exception
    {
        public Dictionary<string, string[]> Errors { get; }

        public ValidationException(string field, string message)
            : base(message)
        {
            Errors = new Dictionary<string, string[]>
            {
                [field] = [message]
            };
        }

        public ValidationException(Dictionary<string, string[]> errors)
            : base("One or more validation errors occurred.")
        {
            Errors = errors;
        }
    }
}
