using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Data;

namespace RecursosHumanos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class ReportesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{modulo}")]
    public async Task<IActionResult> GetReporte(
        string modulo,
        [FromQuery] string? buscar,
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta)
    {
        modulo = modulo.ToLower();
        buscar = buscar?.ToLower();

        if (modulo == "personal")
        {
            var query = _context.Personal
                .Include(p => p.Grado)
                .Where(p => p.DeletedAt == null);

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                query = query.Where(p =>
                    (p.Ci ?? "").ToLower().Contains(buscar) ||
                    (p.Escalafon ?? "").ToLower().Contains(buscar) ||
                    (p.PrimerNombre ?? "").ToLower().Contains(buscar) ||
                    (p.ApPaterno ?? "").ToLower().Contains(buscar));
            }

            var data = await query
                .OrderBy(p => p.ApPaterno)
                .Select(p => new
                {
                    p.Escalafon,
                    p.Ci,
                    p.Exp,
                    Nombre = $"{p.PrimerNombre} {p.SegundoNombre} {p.ApPaterno} {p.ApMaterno}",
                    Grado = p.Grado != null ? p.Grado.Nombre : "",
                    p.Genero,
                    p.AlturaCm,
                    p.PesoKg,
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(data);
        }

        if (modulo == "instituciones")
        {
            var data = await _context.Instituciones
                .Where(x =>
                    string.IsNullOrWhiteSpace(buscar) ||
                    (x.Nombre ?? "").ToLower().Contains(buscar) ||
                    (x.Sigla ?? "").ToLower().Contains(buscar) ||
                    (x.Tipo ?? "").ToLower().Contains(buscar))
                .OrderBy(x => x.Nombre)
                .Select(x => new
                {
                    x.Nombre,
                    x.Sigla,
                    x.Tipo,
                    Estado = x.Activo ? "Activa" : "Inactiva",
                    x.CreatedAt
                })
                .ToListAsync();

            return Ok(data);
        }

        if (modulo == "correspondencia")
        {
            var query = _context.Correspondencias.AsQueryable();

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                query = query.Where(x =>
                    (x.CodigoRegistro ?? "").ToLower().Contains(buscar) ||
                    (x.Origen ?? "").ToLower().Contains(buscar) ||
                    (x.Referencia ?? "").ToLower().Contains(buscar) ||
                    (x.Remitente ?? "").ToLower().Contains(buscar));
            }

            if (desde.HasValue)
                query = query.Where(x => x.FechaHora >= desde.Value.ToUniversalTime());

            if (hasta.HasValue)
                query = query.Where(x => x.FechaHora <= hasta.Value.ToUniversalTime());

            var data = await query
                .OrderByDescending(x => x.FechaHora)
                .Select(x => new
                {
                    x.Tipo,
                    x.CodigoRegistro,
                    x.Origen,
                    x.NroOficio,
                    x.Referencia,
                    x.Remitente,
                    x.Seccion,
                    x.FechaHora,
                    x.Firma,
                    x.TiempoRespuesta
                })
                .ToListAsync();

            return Ok(data);
        }

        if (modulo == "revision-juridica")
        {
            var query = _context.RevisionesJuridicas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                query = query.Where(x =>
                    (x.Codigo ?? "").ToLower().Contains(buscar) ||
                    (x.Destino ?? "").ToLower().Contains(buscar) ||
                    (x.Origen ?? "").ToLower().Contains(buscar) ||
                    (x.Motivo ?? "").ToLower().Contains(buscar));
            }

            var data = await query
                .OrderByDescending(x => x.Fecha)
                .Select(x => new
                {
                    x.Tipo,
                    x.Codigo,
                    x.Destino,
                    x.Origen,
                    x.Fecha,
                    x.FechaHora,
                    x.Motivo,
                    x.Recepcion,
                    x.Firma,
                    x.Entrega
                })
                .ToListAsync();

            return Ok(data);
        }

        if (modulo == "meritos")
        {
            var data = await _context.Vacaciones
                .Include(x => x.Personal)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    Tipo = "Vacación",
                    Personal = x.Personal != null ? $"{x.Personal.PrimerNombre} {x.Personal.ApPaterno}" : "",
                    x.Nro,
                    x.NroMemo,
                    x.Desde,
                    x.Hasta,
                    x.Dias,
                    x.Observaciones,
                    x.AutoridadFirma
                })
                .ToListAsync();

            return Ok(data);
        }

        return BadRequest(new { message = "Módulo no válido" });
    }
}