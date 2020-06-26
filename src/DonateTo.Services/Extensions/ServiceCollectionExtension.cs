using DonateTo.ApplicationCore.Entities;
using DonateTo.ApplicationCore.Interfaces.Services;
using DonateTo.Infrastructure.Extensions;
using DonateTo.Mailer;
using DonateTo.Mailer.Interfaces;
using DonateTo.Services.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DonateTo.Services.Extensions
{
    public static class ServiceCollectionExtension
    {
        /// <summary>
        /// Add all the DonateTo's dependencies to the collection.
        /// </summary>
        /// <param name="service">IServiceCollection.</param>
        /// <param name="configuration">IConfiguration.</param>
        public static void AddDonateToModule(this IServiceCollection service, IConfiguration configuration)
        {
            service.AddEntityFramework(configuration);

            service.AddScoped<IUserService, UserService>();
            service.AddScoped<IStateService, StateService>();
            service.AddScoped<ICityService, CityService>();
            service.AddTransient<IBaseService<Donation>, DonationService>();
            service.AddTransient<IDonationRequestService, DonationRequestService>();
            service.AddTransient<IBaseService<Country>, CountryService>();
            service.AddTransient<ISearchService, SearchService>();
            service.AddTransient<IOrganizationService, OrganizationService>();
            service.AddTransient<IBaseService<Address>, AddressService>();
            service.AddTransient<IBaseService<Category>, CategoryService>();
            service.AddTransient<IBaseService<Unit>, UnitService>();
            service.AddTransient<IBaseService<Status>, StatusService>();
            service.AddTransient<IBaseService<Question>, QuestionService>();
            service.AddTransient<IMailSender, MailSender>();
        }
    }
}
