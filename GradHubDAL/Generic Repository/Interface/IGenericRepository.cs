using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Generic_Repository.Interface
{
    public interface IGenericRepository<T> where T : class
    {
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        IEnumerable<T> GetAll();
        IEnumerable<T> GetAll(Func<T, bool>? Condition = null);
        T? GetById(int id);
    }
}
