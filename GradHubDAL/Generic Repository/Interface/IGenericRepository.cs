using System.Linq.Expressions;

namespace GradHubDAL.Generic_Repository.Interface
{
    public interface IGenericRepository<T> where T : class
    {
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);

        /// <summary>
        /// Returns an IQueryable so callers can compose further operators
        /// (pagination, ordering, projection) before the query executes.
        /// Uses Expression so EF Core translates the predicate to SQL rather
        /// than loading the full table into memory.
        /// </summary>
        IQueryable<T> GetAll(
            Expression<Func<T, bool>>? condition = null,
            params Expression<Func<T, object>>[] includes);

        T? GetById(int id);
    }
}
