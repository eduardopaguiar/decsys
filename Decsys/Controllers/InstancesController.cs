﻿using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/surveys/{id}/[controller]")]
    public class InstancesController : ControllerBase
    {
        private readonly SurveyInstanceService _instances;

        public InstancesController(SurveyInstanceService instances)
        {
            _instances = instances;
        }

        [HttpGet]
        [SwaggerOperation("List all Survey Instances for a Survey.")]
        [SwaggerResponse(200, "A list of Survey Instances.", Type = typeof(IEnumerable<SurveyInstance>))]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult List(int id)
        {
            try
            {
                return Ok(_instances.List(id));
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpGet("{instanceId}")]
        [SwaggerOperation("Get a single Survey Instance by ID.")]
        [SwaggerResponse(200, "The Survey Instance.", Type = typeof(SurveyInstance))]
        [SwaggerResponse(404, "No Survey Instance, or Survey, was found with the provided ID.")]
        public IActionResult Get(int id, int instanceId)
        {
            try
            {
                return Ok(_instances.Get(id, instanceId));
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPost]
        [SwaggerOperation("Create a Survey Instance for a Survey.")]
        [SwaggerResponse(201, "The Survey Instance was created with the returned ID.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        [SwaggerResponse(400, "This Survey already has an active Instance.")]
        public IActionResult Create(int id)
        {
            try
            {
                var instanceId = _instances.Create(id);

                return Created(
                    Url.Action("Get", "Instances", new { id, instanceId }),
                    instanceId);
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (ArgumentException e) { return BadRequest(e); }
        }

        [HttpPost("{instanceId}/close")]
        [SwaggerOperation("Close a Survey Instance for a Survey.")]
        [SwaggerResponse(204, "The Survey Instance was closed successfully.")]
        [SwaggerResponse(404, "No Survey Instance, or Survey, was found with the provided ID.")]
        public IActionResult Close(int id, int instanceId)
        {
            try
            {
                _instances.Close(id, instanceId);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }
}