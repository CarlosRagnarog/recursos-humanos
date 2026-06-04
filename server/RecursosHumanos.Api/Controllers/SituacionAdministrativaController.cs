using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Data;
using RecursosHumanos.Api.DTOs;
using RecursosHumanos.Api.Models;

namespace RecursosHumanos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SituacionAdministrativaController : ControllerBase
{
    private readonly AppDbContext _context;

    public SituacionAdministrativaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{personalId}")]
    public async Task<IActionResult> GetByPersonal(Guid personalId)
    {
        var destino = await _context.Destinos
            .Where(x => x.PersonalId == personalId)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var situacion = await _context.Situaciones
            .Where(x => x.PersonalId == personalId)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var baja = await _context.Bajas
            .Where(x => x.PersonalId == personalId)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var reclamacion = await _context.Reclamaciones
            .Where(x => x.PersonalId == personalId)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        return Ok(new SituacionAdministrativaDto
        {
            PersonalId = personalId,

            UnidadAnterior = destino?.UnidadAnterior,
            UnidadActual = destino?.UnidadActual,
            CargoActual = destino?.CargoActual,
            MemoNro = destino?.MemoNro,
            FechaDestino = destino?.FechaDestino,
            EstadoPersonal = destino?.EstadoPersonal,
            ObservacionesDestino = destino?.Observaciones,

            TipoSituacion = situacion?.Tipo,
            Causal = situacion?.Causal,
            FechaInicio = situacion?.FechaInicio,
            FechaRetorno = situacion?.FechaRetorno,
            SituacionActual = situacion?.SituacionActual,
            ObservacionesSituacion = situacion?.Observaciones,

            FechaBaja = baja?.FechaBaja,
            MotivoBaja = baja?.Motivo,
            ObservacionesBaja = baja?.Observaciones,

            TipoReclamacion = reclamacion?.Tipo,
            FechaReclamacion = reclamacion?.Fecha,
            UnidadRepresentada = reclamacion?.UnidadRepresentada,
            NroMemorandum = reclamacion?.NroMemorandum,
            ObservacionesReclamacion = reclamacion?.Observaciones
        });
    }

    [HttpPost]
    public async Task<IActionResult> Save(SituacionAdministrativaDto dto)
    {
        var personalExiste = await _context.Personal
            .AnyAsync(p => p.Id == dto.PersonalId && p.DeletedAt == null);

        if (!personalExiste)
        {
            return NotFound(new { message = "Personal no encontrado" });
        }

        if (
            !string.IsNullOrWhiteSpace(dto.UnidadAnterior) ||
            !string.IsNullOrWhiteSpace(dto.UnidadActual) ||
            !string.IsNullOrWhiteSpace(dto.CargoActual) ||
            !string.IsNullOrWhiteSpace(dto.MemoNro)
        )
        {
            _context.Destinos.Add(new Destino
            {
                PersonalId = dto.PersonalId,
                UnidadAnterior = dto.UnidadAnterior,
                UnidadActual = dto.UnidadActual,
                CargoActual = dto.CargoActual,
                MemoNro = dto.MemoNro,
                FechaDestino = dto.FechaDestino,
                EstadoPersonal = dto.EstadoPersonal,
                Observaciones = dto.ObservacionesDestino,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (
            !string.IsNullOrWhiteSpace(dto.TipoSituacion) ||
            !string.IsNullOrWhiteSpace(dto.Causal) ||
            !string.IsNullOrWhiteSpace(dto.SituacionActual)
        )
        {
            _context.Situaciones.Add(new Situacion
            {
                PersonalId = dto.PersonalId,
                Tipo = dto.TipoSituacion,
                Causal = dto.Causal,
                FechaInicio = dto.FechaInicio,
                FechaRetorno = dto.FechaRetorno,
                SituacionActual = dto.SituacionActual,
                Observaciones = dto.ObservacionesSituacion,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (
            dto.FechaBaja != null ||
            !string.IsNullOrWhiteSpace(dto.MotivoBaja)
        )
        {
            _context.Bajas.Add(new Baja
            {
                PersonalId = dto.PersonalId,
                FechaBaja = dto.FechaBaja,
                Motivo = dto.MotivoBaja,
                Observaciones = dto.ObservacionesBaja,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (
            !string.IsNullOrWhiteSpace(dto.TipoReclamacion) ||
            !string.IsNullOrWhiteSpace(dto.UnidadRepresentada) ||
            !string.IsNullOrWhiteSpace(dto.NroMemorandum)
        )
        {
            _context.Reclamaciones.Add(new Reclamacion
            {
                PersonalId = dto.PersonalId,
                Tipo = dto.TipoReclamacion,
                Fecha = dto.FechaReclamacion,
                UnidadRepresentada = dto.UnidadRepresentada,
                NroMemorandum = dto.NroMemorandum,
                Observaciones = dto.ObservacionesReclamacion,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Situación administrativa registrada correctamente" });
    }
}