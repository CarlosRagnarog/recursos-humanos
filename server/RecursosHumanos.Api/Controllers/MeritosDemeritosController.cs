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
public class MeritosDemeritosController : ControllerBase
{
    private readonly AppDbContext _context;

    public MeritosDemeritosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{personalId}/{tipo}")]
    public async Task<IActionResult> Get(Guid personalId, string tipo)
    {
        tipo = tipo.ToLower();

        if (tipo == "destinos" || tipo == "cambio-destino")
        {
            var data = await _context.Destinos
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    NroMemo = x.MemoNro,
                    Fecha = x.FechaDestino,
                    UnidadAnterior = x.UnidadAnterior,
                    UnidadActual = x.UnidadActual,
                    CargoActual = x.CargoActual,
                    EstadoPersonal = x.EstadoPersonal,
                    Observaciones = x.Observaciones
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "vacaciones")
        {
            var data = await _context.Vacaciones
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroMemo = x.NroMemo,
                    Desde = x.Desde,
                    Hasta = x.Hasta,
                    Dias = x.Dias,
                    Observaciones = x.Observaciones,
                    AutoridadFirma = x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "bajas-medicas")
        {
            var data = await _context.BajasMedicas
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroFolio = x.NroFolio,
                    Desde = x.Desde,
                    Hasta = x.Hasta,
                    InstitucionMedica = x.InstitucionMedica,
                    Observaciones = x.Observaciones
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "comisiones")
        {
            var data = await _context.Comisiones
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroFolio = x.NroFolio,
                    NroMemo = x.NroMemo,
                    Desde = x.Desde,
                    Hasta = x.Hasta,
                    UnidadOrg = x.UnidadOrg,
                    AutoridadFirma = x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "didipi")
        {
            var data = await _context.Disciplinarios
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroFolio = x.NroFolio,
                    NroMemo = x.NroMemo,
                    Fecha = x.Fecha,
                    Causal = x.Causal,
                    Observaciones = x.Observaciones,
                    AutoridadFirma = x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "felicitaciones")
        {
            var data = await _context.Felicitaciones
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroFolio = x.NroFolio,
                    NroMemo = x.NroMemo,
                    Fecha = x.FechaEntrega,
                    Motivo = x.Motivo,
                    AutoridadFirma = x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "llamadas-atencion")
        {
            var data = await _context.LlamadasAtencion
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroFolio = x.NroFolio,
                    NroMemo = x.NroMemo,
                    Fecha = x.FechaEntrega,
                    Motivo = x.Motivo,
                    AutoridadFirma = x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "designaciones")
        {
            var data = await _context.Designaciones
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    Nro = x.Nro,
                    NroFolio = x.NroFolio,
                    NroMemo = x.NroMemo,
                    Fecha = x.FechaEntrega,
                    Designacion = x.NombreDesignacion,
                    AutoridadFirma = x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        if (tipo == "pasaportes")
        {
            var data = await _context.Pasaportes
                .Where(x => x.PersonalId == personalId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new MeritoDemeritoDto
                {
                    Id = x.Id,
                    PersonalId = x.PersonalId,
                    Tipo = tipo,
                    NroFolio = x.NroFolio,
                    NroPasaporte = x.NroPasaporte,
                    Dias = x.Dias,
                    Desde = x.FechaSalida,
                    Hasta = x.FechaLlegada,
                    Destino = x.Destino,
                    Motivo = x.Motivo
                })
                .ToListAsync();

            return Ok(data);
        }

        return BadRequest(new { message = "Tipo no válido" });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MeritoDemeritoDto dto)
    {
        var tipo = dto.Tipo.ToLower();

        if (tipo == "destinos" || tipo == "cambio-destino")
        {
            _context.Destinos.Add(new Destino
            {
                PersonalId = dto.PersonalId,
                UnidadAnterior = dto.UnidadAnterior,
                UnidadActual = dto.UnidadActual,
                CargoActual = dto.CargoActual,
                MemoNro = dto.NroMemo,
                FechaDestino = dto.Fecha,
                EstadoPersonal = dto.EstadoPersonal,
                Observaciones = dto.Observaciones,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "vacaciones")
        {
            _context.Vacaciones.Add(new Vacacion
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroMemo = dto.NroMemo,
                Desde = dto.Desde,
                Hasta = dto.Hasta,
                Dias = dto.Dias,
                Observaciones = dto.Observaciones,
                AutoridadFirma = dto.AutoridadFirma,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "bajas-medicas")
        {
            _context.BajasMedicas.Add(new BajaMedica
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroFolio = dto.NroFolio,
                Desde = dto.Desde,
                Hasta = dto.Hasta,
                InstitucionMedica = dto.InstitucionMedica,
                Observaciones = dto.Observaciones,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "comisiones")
        {
            _context.Comisiones.Add(new Comision
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroFolio = dto.NroFolio,
                NroMemo = dto.NroMemo,
                Desde = dto.Desde,
                Hasta = dto.Hasta,
                UnidadOrg = dto.UnidadOrg,
                AutoridadFirma = dto.AutoridadFirma,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "didipi")
        {
            _context.Disciplinarios.Add(new Disciplinario
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroFolio = dto.NroFolio,
                NroMemo = dto.NroMemo,
                Fecha = dto.Fecha,
                Causal = dto.Causal,
                Observaciones = dto.Observaciones,
                AutoridadFirma = dto.AutoridadFirma,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "felicitaciones")
        {
            _context.Felicitaciones.Add(new Felicitacion
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroFolio = dto.NroFolio,
                NroMemo = dto.NroMemo,
                FechaEntrega = dto.Fecha,
                Motivo = dto.Motivo,
                AutoridadFirma = dto.AutoridadFirma,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "llamadas-atencion")
        {
            _context.LlamadasAtencion.Add(new LlamadaAtencion
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroFolio = dto.NroFolio,
                NroMemo = dto.NroMemo,
                FechaEntrega = dto.Fecha,
                Motivo = dto.Motivo,
                AutoridadFirma = dto.AutoridadFirma,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "designaciones")
        {
            _context.Designaciones.Add(new Designacion
            {
                PersonalId = dto.PersonalId,
                Nro = dto.Nro,
                NroFolio = dto.NroFolio,
                NroMemo = dto.NroMemo,
                FechaEntrega = dto.Fecha,
                NombreDesignacion = dto.Designacion,
                AutoridadFirma = dto.AutoridadFirma,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (tipo == "pasaportes")
        {
            _context.Pasaportes.Add(new Pasaporte
            {
                PersonalId = dto.PersonalId,
                NroFolio = dto.NroFolio,
                NroPasaporte = dto.NroPasaporte,
                Dias = dto.Dias,
                FechaSalida = dto.Desde,
                FechaLlegada = dto.Hasta,
                Destino = dto.Destino,
                Motivo = dto.Motivo,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            return BadRequest(new { message = "Tipo no válido" });
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Registro agregado correctamente" });
    }
}