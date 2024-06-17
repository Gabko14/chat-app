using AutoMapper;
using cha_app.Domain.Entities;
using chat_app.Application.DTOs;

namespace chat_app.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Entity to DTO
        CreateMap<Message, MessageReadDto>()
            .ForMember(dest => dest.MessageId, opt => opt.MapFrom(src => src.MessageId.ToString()));
        // CreateDTO to Entity
        CreateMap<MessageCreateDto, Message>()
            .ForMember(dest => dest.MessageId, opt => opt.Ignore())
            .ForMember(dest => dest.Timestamp, opt => opt.Ignore());
        
        // UpdateDTO to Entity
        CreateMap<MessageUpdateDto, Message>()
            .ForMember(dest => dest.MessageId, opt => opt.Ignore())
            .ForMember(dest => dest.Content, act => act.MapFrom(src => src.Content))
            .ForMember(dest => dest.Sender, opt => opt.Ignore())
            .ForMember(dest => dest.Timestamp, opt => opt.Ignore());
    }
}