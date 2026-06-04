using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RecursosHumanos.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMovimientosPersonal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "asignaciones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    institucion_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cargo = table.Column<string>(type: "text", nullable: true),
                    unidad = table.Column<string>(type: "text", nullable: true),
                    desde = table.Column<DateOnly>(type: "date", nullable: true),
                    hasta = table.Column<DateOnly>(type: "date", nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_asignaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_asignaciones_instituciones_institucion_id",
                        column: x => x.institucion_id,
                        principalTable: "instituciones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_asignaciones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bajas",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    fecha_baja = table.Column<DateOnly>(type: "date", nullable: true),
                    motivo = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bajas", x => x.id);
                    table.ForeignKey(
                        name: "FK_bajas_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "destinos",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    unidad_anterior = table.Column<string>(type: "text", nullable: true),
                    unidad_actual = table.Column<string>(type: "text", nullable: true),
                    cargo_actual = table.Column<string>(type: "text", nullable: true),
                    memo_nro = table.Column<string>(type: "text", nullable: true),
                    fecha_destino = table.Column<DateOnly>(type: "date", nullable: true),
                    estado_personal = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_destinos", x => x.id);
                    table.ForeignKey(
                        name: "FK_destinos_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reclamaciones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: true),
                    fecha = table.Column<DateOnly>(type: "date", nullable: true),
                    unidad_representada = table.Column<string>(type: "text", nullable: true),
                    nro_memorandum = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reclamaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_reclamaciones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "situaciones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: true),
                    causal = table.Column<string>(type: "text", nullable: true),
                    fecha_inicio = table.Column<DateOnly>(type: "date", nullable: true),
                    fecha_retorno = table.Column<DateOnly>(type: "date", nullable: true),
                    situacion_actual = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_situaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_situaciones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_institucion_id",
                table: "asignaciones",
                column: "institucion_id");

            migrationBuilder.CreateIndex(
                name: "IX_asignaciones_personal_id",
                table: "asignaciones",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_bajas_personal_id",
                table: "bajas",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_destinos_personal_id",
                table: "destinos",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_reclamaciones_personal_id",
                table: "reclamaciones",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_situaciones_personal_id",
                table: "situaciones",
                column: "personal_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "asignaciones");

            migrationBuilder.DropTable(
                name: "bajas");

            migrationBuilder.DropTable(
                name: "destinos");

            migrationBuilder.DropTable(
                name: "reclamaciones");

            migrationBuilder.DropTable(
                name: "situaciones");
        }
    }
}
