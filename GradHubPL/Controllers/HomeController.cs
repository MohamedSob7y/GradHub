using Microsoft.AspNetCore.Mvc;

namespace GradHubPL.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
