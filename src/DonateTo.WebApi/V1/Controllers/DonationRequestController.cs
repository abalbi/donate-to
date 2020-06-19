using Microsoft.AspNetCore.Mvc;
using DonateTo.ApplicationCore.Entities;
using DonateTo.ApplicationCore.Interfaces.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using DonateTo.Mailer.Interfaces;
using System.Globalization;

namespace DonateTo.WebApi.V1.Controllers
{
    ///<inheritdoc cref="BaseApiController{DonationRequest}"/>
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class DonationRequestController : BaseApiController<DonationRequest>
    {
        private readonly IDonationRequestService _donationRequestService;
        private readonly IMailSender _mailSender;
        private const string _clientClaim = "client";

        public DonationRequestController(
            IDonationRequestService donationRequestService,
            IMailSender mailSender) : base(donationRequestService)
        {
            _donationRequestService = donationRequestService;
            _mailSender = mailSender;
        }

        /// <summary>
        /// Creates a new DonationRequest.
        /// </summary>
        /// <param name="value">Entity to create.</param>
        /// <returns>Created entity.</returns>
        [HttpPost(Name = "[controller]_[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public override async Task<IActionResult> Post([FromBody] DonationRequest value)
        {
            if (!ModelState.IsValid || value == null)
            {
                return BadRequest();
            }
            else
            {
                var username = User.Claims.FirstOrDefault(claim => claim.Type == _usernameClaim)?.Value;
                var client = User.Claims.FirstOrDefault(claim => claim.Type == _clientClaim)?.Value;
                value.UserId = Convert.ToInt64(User.Claims.FirstOrDefault(claim => claim.Type == _userIdClaim)?.Value, CultureInfo.InvariantCulture);

                var donationRequest = await _baseService.CreateAsync(value, username).ConfigureAwait(false);
                await _donationRequestService.SendNewRequestMailToOrganizationUsersAsync(donationRequest, client).ConfigureAwait(false);

                return Ok(donationRequest);
            }
        }
    }
}