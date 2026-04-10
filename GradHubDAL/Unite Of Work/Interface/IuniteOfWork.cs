using GradHubDAL.Generic_Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Unite_Of_Work.Interface
{
    public interface IuniteOfWork
    {
        IGenericRepository<T> GetRepository<T>() where T :class;
        public int SaveChanges();
    }
}
