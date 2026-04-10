using GradHubDAL.Context;
using GradHubDAL.Generic_Repository.Implementation;
using GradHubDAL.Generic_Repository.Interface;
using GradHubDAL.Unite_Of_Work.Implementation;
using GradHubDAL.Unite_Of_Work.Interface;
using Microsoft.EntityFrameworkCore;

namespace GradHubPL
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

           
            #region Open Connection With Database 
            builder.Services.AddDbContext<GradHubContext>(options =>
            {
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            #endregion

            #region Inject Object from I Generic Repository
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>)); 
            #endregion

            #region Inject Object From IuniteOfWork
            builder.Services.AddScoped<IuniteOfWork, UniteOfWork>(); 
            #endregion



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthorization();

            app.MapStaticAssets();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}")
                .WithStaticAssets();

            app.Run();
        }
    }
}
