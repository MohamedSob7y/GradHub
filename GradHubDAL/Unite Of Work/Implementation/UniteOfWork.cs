using GradHubDAL.Context;
using GradHubDAL.Generic_Repository.Implementation;
using GradHubDAL.Generic_Repository.Interface;
using GradHubDAL.Unite_Of_Work.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Unite_Of_Work.Implementation
{
    public class UniteOfWork : IuniteOfWork
    {
        private readonly Dictionary<Type, object> _Repository = new Dictionary<Type, object>();
        private readonly GradHubContext _gradHubContext;

        public UniteOfWork(GradHubContext gradHubContext)
        {
            _gradHubContext = gradHubContext;
        }
        public IGenericRepository<T> GetRepository<T>() where T :class
        {
            var entitytype = typeof(T);
            if (_Repository.TryGetValue(entitytype, out var Repository))
            {
                return (IGenericRepository<T>)_Repository[entitytype];
            }
            var newRepo = new GenericRepository<T>(_gradHubContext);
            _Repository[entitytype] = newRepo;   
            return newRepo;
          
        }

        public int SaveChanges()
        {
            return _gradHubContext.SaveChanges();
        }



    }
}
