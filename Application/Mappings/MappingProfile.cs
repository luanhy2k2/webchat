using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using AutoMapper;
using Data.Entities;


namespace DTO.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<Room, RoomModel>().ReverseMap();
            CreateMap<Message, MessageModel>().ReverseMap();

        }
    }
}
