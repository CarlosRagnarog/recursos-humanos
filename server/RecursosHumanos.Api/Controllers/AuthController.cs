using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Data;
using RecursosHumanos.Api.DTOs;
using RecursosHumanos.Api.Services;

namespace RecursosHumanos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.UsuarioRoles)
            .ThenInclude(ur => ur.Rol)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null)
        {
            return Unauthorized(new { message = "Credenciales incorrectas" });
        }

        if (!usuario.Activo)
        {
            return Unauthorized(new { message = "Usuario inactivo" });
        }

        var passwordValido = BCrypt.Net.BCrypt.Verify(
            request.Password,
            usuario.PasswordHash
        );

        if (!passwordValido)
        {
            return Unauthorized(new { message = "Credenciales incorrectas" });
        }

        var roles = usuario.UsuarioRoles
            .Where(ur => ur.Rol != null)
            .Select(ur => ur.Rol!.Nombre ?? "")
            .Where(nombre => !string.IsNullOrWhiteSpace(nombre))
            .ToList();

        var token = _jwtService.GenerateToken(usuario, roles);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Username = usuario.Username ?? "",
            Email = usuario.Email ?? "",
            Roles = roles
        });
    }
}