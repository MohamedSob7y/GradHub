using GradHubDAL.Context;
using GradHubDAL.Generic_Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace GradHubDAL.Generic_Repository.Implementation
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly GradHubContext _context;

        public GenericRepository(GradHubContext context)
        {
            _context = context;
        }

        public void Add(T entity) =>
            _context.Set<T>().Add(entity);

        public void Update(T entity) =>
            _context.Set<T>().Update(entity);

        public void Delete(T entity) =>
            _context.Set<T>().Remove(entity);

        public IQueryable<T> GetAll(
            Expression<Func<T, bool>>? condition = null,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _context.Set<T>().AsNoTracking();

            foreach (var include in includes)
                query = query.Include(include);

            if (condition is not null)
                query = query.Where(condition);

            return query;
        }

        public T? GetById(int id) =>
            _context.Set<T>().Find(id);
    }
}
