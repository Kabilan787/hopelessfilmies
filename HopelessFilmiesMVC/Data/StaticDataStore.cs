//using System;
//using System.Collections.Generic;

//namespace HopelessFilmiesMVC.Data;
//public class Film
//{
//    public int Id { get; set; }
//    public string Heading { get; set; }
//    public string Description { get; set; }
//    public string Link { get; set; }
//    public string Image { get; set; }
//}

//public class TeamMember
//{
//    public int Id { get; set; }
//    public string Name { get; set; }
//    public string Image { get; set; }
//    public List<string> Roles { get; set; }
//}

//public class ContactInfo
//{
//    public string IconClass { get; set; }
//    public string Text { get; set; }
//    public bool IsLink { get; set; }
//    public string? Link { get; set; }
//}

//public static class StaticDataStore
//{
//    public static List<Film> Films;
//    public static List<TeamMember> TeamMembers;
//    public static List<ContactInfo> ContactInfos;

//    // Static constructor (static block)
//    static StaticDataStore()
//    {
//        Films = new List<Film>
//        {
//            new Film
//            {
//                Id = 1,
//                Heading = "1.Love Forever",
//                Description = "Love Forever is a beautiful story which tells about interesting things which happens around Feb 14 Valentines Day, to a group of friends in college",
//                Link = "https://youtu.be/aksQ1n5fPaY?list=PL2kpOp_flTV5l4XBVG9YUkd5d9BBCdssa",
//                Image = "images/love-forever.gif"
//            },
//            new Film
//            {
//                Id = 2,
//                Heading = "2.AAA",
//                Description = "AAA is an anthological film which revolves around two youngsters, unfortunate conditions force them to involve in a situation which drags them to a big trouble",
//                Link = "https://youtu.be/nW8Eqxzsnjc?list=PL2kpOp_flTV4DEa5vjJjjRcyjijN55jev",
//                Image = "images/aaa.gif"
//            },
//            new Film
//            {
//                Id = 3,
//                Heading = "3.Dhadaladi",
//                Description = "Dhadaladi is a comedy film which happens in one night in an hostel. A small fight leads to big chaos and it unravels mystries around the hostel",
//                Link = "https://drive.google.com/file/d/1Ou5RRS0xNVjiGEdrfKvLDIET9rKl6b2o/view?usp=sharing",
//                Image = "images/dadaladi.gif"
//            }
//        };

//        TeamMembers = new List<TeamMember>
//        {
//            new TeamMember
//            {
//                Id = 1,
//                Name = "Kabilan",
//                Image = "images/kabilan.jpg",
//                Roles = new List<string> { "Director", "Editor", "Actor" }
//            },
//            new TeamMember
//            {
//                Id = 2,
//                Name = "Sharan",
//                Image = "images/sharan.jpg",
//                Roles = new List<string> { "Director", "Editor", "Actor" }
//            },
//            new TeamMember
//            {
//                Id = 3,
//                Name = "Sidharth",
//                Image = "images/sidharth.jpg",
//                Roles = new List<string> { "Cameraman", "Actor", "Dialogues" }
//            },
//            new TeamMember
//            {
//                Id = 4,
//                Name = "Akshay",
//                Image = "images/akshay.jpg",
//                Roles = new List<string> { "Cameraman", "Actor", "Dialogues" }
//            }
//        };

//        ContactInfos = new List<ContactInfo>
//        {
//            new ContactInfo
//            {
//                IconClass = "fas fa-globe",
//                Text = "hopelessfilmies.com",
//                IsLink = false,
//                Link = null
//            },
//            new ContactInfo
//            {
//                IconClass = "fas fa-phone",
//                Text = "(123)456-78910",
//                IsLink = false,
//                Link = null
//            },
//            new ContactInfo
//            {
//                IconClass = "fab fa-facebook-f",
//                Text = "Facebook",
//                IsLink = true,
//                Link = "#"
//            },
//            new ContactInfo
//            {
//                IconClass = "fab fa-instagram",
//                Text = "Instagram",
//                IsLink = true,
//                Link = "#"
//            },
//            new ContactInfo
//            {
//                IconClass = "fab fa-twitter",
//                Text = "Twitter",
//                IsLink = true,
//                Link = "#"
//            }
//        };
//    }
//}

using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HopelessFilmiesMVC.Data;

public class Film
{
    public int Id { get; set; }
    public string Heading { get; set; }
    public string Description { get; set; }
    public string Link { get; set; }
    public string Image { get; set; }
}

public class TeamMember
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public List<string> Roles { get; set; }
}

public class ContactInfo
{
    public string IconClass { get; set; }
    public string Text { get; set; }
    public bool IsLink { get; set; }
    public string Link { get; set; }
}

public class JsonData
{
    public List<Film> Films { get; set; }
    public List<TeamMember> TeamMembers { get; set; }
    public List<ContactInfo> ContactInfo { get; set; }
}

public static class StaticDataStore
{
    public static List<Film> Films;
    public static List<TeamMember> TeamMembers;
    public static List<ContactInfo> ContactInfos;

    static StaticDataStore()
    {
        string jsonFilePath = "wwwroot/data/data.json"; 

        
        string jsonString = File.ReadAllText(jsonFilePath);
        JsonSerializerOptions options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true, // Handle different casing in JSON
                Converters = { new JsonStringEnumConverter() } // Handle enums if any
            };

        JsonData data = JsonSerializer.Deserialize<JsonData>(jsonString, options);

        Films = data.Films ?? new List<Film>(); // Use ?? to handle null lists from JSON
        TeamMembers = data.TeamMembers ?? new List<TeamMember>();
        ContactInfos = data.ContactInfo ?? new List<ContactInfo>();
        
    }
}