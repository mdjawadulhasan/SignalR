using DemoSignalR.Hubs;
using DemoSignalR.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DemoSignalR.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class LocationController : ControllerBase
    {
        private readonly IHubContext<LocationHub> _hubContext;

        public LocationController(IHubContext<LocationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> UpdateLocation(LocationData locationData)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _hubContext.Clients.Group(locationData.ManagerId).SendAsync("LocationUpdate", locationData);
            var test = _hubContext.Clients.Group;
            return Ok("Location Updated");
        }


    }

}
