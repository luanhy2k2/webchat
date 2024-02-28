using Application.Hubs;
using Application.Model;
using AutoMapper;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Repository;

namespace ChatApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RoomRepository _repository;
        private readonly IMapper _mapper;
        private readonly IHubContext<ChatHub> _hubContext;
        public RoomController(RoomRepository repository, IMapper mapper, IHubContext<ChatHub> hubContext)
        {
            _repository = repository;
            _mapper = mapper;
            _hubContext = hubContext;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomModel>>> Get()
        {
            var rooms = await _repository.Get();
            return Ok(rooms);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> Get(int id)
        {
            var room = await _repository.Get(id);
            if (room == null)
                return NotFound();
            return Ok(room);
        }
       
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] RoomModel model)
        {
            try
            {
                var result = await _repository.Create(model.Name, User.Identity.Name);
                Console.WriteLine(User.Identity.Name);
                
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<ActionResult> Edit([FromBody] RoomModel roomViewModel)
        {
            try
            {
                var result = await _repository.Edit(roomViewModel.ID,User.Identity.Name, roomViewModel);
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _repository.Delete(id, User.Identity.Name);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

    }
}
