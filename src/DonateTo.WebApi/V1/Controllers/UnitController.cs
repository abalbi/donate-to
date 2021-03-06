﻿using Microsoft.AspNetCore.Mvc;
using DonateTo.ApplicationCore.Entities;
using DonateTo.ApplicationCore.Interfaces.Services;
using DonateTo.ApplicationCore.Models.Filtering;

namespace DonateTo.WebApi.V1.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UnitController : BaseApiController<Unit, BaseFilterModel>
    {
        public UnitController(IBaseService<Unit, BaseFilterModel> unitService) : base(unitService)
        {
        }
    }
}