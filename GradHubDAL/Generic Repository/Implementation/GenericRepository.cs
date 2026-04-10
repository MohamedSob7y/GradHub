using GradHubDAL.Context;
using GradHubDAL.Generic_Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Generic_Repository.Implementation
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly GradHubContext _gradHubContext;

        public GenericRepository(GradHubContext gradHubContext)
        {
          _gradHubContext = gradHubContext;
        }

        public void Add(T entity)
        {
            _gradHubContext.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _gradHubContext.Set<T>().Remove(entity);

        }

        public IEnumerable<T> GetAll() => _gradHubContext.Set<T>().ToList();

        public IEnumerable<T> GetAll(Func<T, bool>? Condition = null)
        {

            if (Condition is null)
            {
                return _gradHubContext.Set<T>().AsNoTracking()
                    .ToList();
            }
            else
            {
                return _gradHubContext.Set<T>().AsNoTracking().Where(Condition)
                    .ToList();
              
            }
        }

        public T? GetById(int id) => _gradHubContext.Set<T>().Find(id);


        public void Update(T entity)
        {
            _gradHubContext.Set<T>().Update(entity);

        }


    }
}
