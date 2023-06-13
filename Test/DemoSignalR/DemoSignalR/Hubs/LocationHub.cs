using Microsoft.AspNetCore.SignalR;


namespace DemoSignalR.Hubs
{
    public class LocationHub : Hub
    {
        public async Task UpdateLocation(string managerId, double latitude, double longitude)
        {
            await Clients.Group(managerId).SendAsync("LocationUpdate", latitude, longitude);
        }

        public override async Task OnConnectedAsync()
        {
            string managerId = Context.GetHttpContext().Request.Query["managerId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, managerId);
            await base.OnConnectedAsync();
        }
    }
}
