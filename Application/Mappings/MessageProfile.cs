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
    public class MessageProfile:Profile
    {
        public MessageProfile()
        {
            CreateMap<Message, MessageModel>()
                .ForMember(dst => dst.User, otp => otp.MapFrom(o => o.User.FullName))
                .ForMember(dst => dst.Avartar, otp => otp.MapFrom(o => o.User.Avartar))
                .ForMember(dst => dst.Content, otp => otp.MapFrom(o => o.Content))
                .ForMember(dst => dst.Timestamp, otp => otp.MapFrom(o => o.TimeStamp)).ReverseMap();
            CreateMap<MessageModel, Message>().ReverseMap();
        }
    }
}
