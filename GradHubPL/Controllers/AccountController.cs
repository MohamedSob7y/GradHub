using Microsoft.AspNetCore.Mvc;

namespace GradHubPL.Controllers
{
    public class AccountController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }
    }
}
