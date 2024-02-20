using Application.Model;
using AutoMapper;
using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappings
{
    public class RoomProfile:Profile
    {
        public RoomProfile()
        {
            CreateMap<Room, RoomModel>()
                .ForMember(dst => dst.ID, otp => otp.MapFrom(o => o.Id))
                .ForMember(dst => dst.Name, otp => otp.MapFrom(o => o.Name));
            CreateMap<RoomModel, Room>();
        }
    }
}
