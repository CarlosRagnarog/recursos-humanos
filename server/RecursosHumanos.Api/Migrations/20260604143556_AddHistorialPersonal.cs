using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RecursosHumanos.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHistorialPersonal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bajas_medicas",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    desde = table.Column<DateOnly>(type: "date", nullable: true),
                    hasta = table.Column<DateOnly>(type: "date", nullable: true),
                    institucion_medica = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bajas_medicas", x => x.id);
                    table.ForeignKey(
                        name: "FK_bajas_medicas_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comisiones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    nro_memo = table.Column<string>(type: "text", nullable: true),
                    desde = table.Column<DateOnly>(type: "date", nullable: true),
                    hasta = table.Column<DateOnly>(type: "date", nullable: true),
                    unidad_org = table.Column<string>(type: "text", nullable: true),
                    autoridad_firma = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comisiones", x => x.id);
                    table.ForeignKey(
                        name: "FK_comisiones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "designaciones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    nro_memo = table.Column<string>(type: "text", nullable: true),
                    fecha_entrega = table.Column<DateOnly>(type: "date", nullable: true),
                    designacion = table.Column<string>(type: "text", nullable: true),
                    autoridad_firma = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_designaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_designaciones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "disciplinario",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    nro_memo = table.Column<string>(type: "text", nullable: true),
                    fecha = table.Column<DateOnly>(type: "date", nullable: true),
                    causal = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    autoridad_firma = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_disciplinario", x => x.id);
                    table.ForeignKey(
                        name: "FK_disciplinario_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "felicitaciones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    nro_memo = table.Column<string>(type: "text", nullable: true),
                    fecha_entrega = table.Column<DateOnly>(type: "date", nullable: true),
                    motivo = table.Column<string>(type: "text", nullable: true),
                    autoridad_firma = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_felicitaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_felicitaciones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "llamadas_atencion",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    nro_memo = table.Column<string>(type: "text", nullable: true),
                    fecha_entrega = table.Column<DateOnly>(type: "date", nullable: true),
                    motivo = table.Column<string>(type: "text", nullable: true),
                    autoridad_firma = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_llamadas_atencion", x => x.id);
                    table.ForeignKey(
                        name: "FK_llamadas_atencion_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pasaportes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro_folio = table.Column<string>(type: "text", nullable: true),
                    nro_pasaporte = table.Column<string>(type: "text", nullable: true),
                    dias = table.Column<int>(type: "integer", nullable: true),
                    fecha_salida = table.Column<DateOnly>(type: "date", nullable: true),
                    fecha_llegada = table.Column<DateOnly>(type: "date", nullable: true),
                    destino = table.Column<string>(type: "text", nullable: true),
                    motivo = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pasaportes", x => x.id);
                    table.ForeignKey(
                        name: "FK_pasaportes_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "vacaciones",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nro = table.Column<string>(type: "text", nullable: true),
                    nro_memo = table.Column<string>(type: "text", nullable: true),
                    desde = table.Column<DateOnly>(type: "date", nullable: true),
                    hasta = table.Column<DateOnly>(type: "date", nullable: true),
                    dias = table.Column<int>(type: "integer", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    autoridad_firma = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vacaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_vacaciones_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_bajas_medicas_personal_id",
                table: "bajas_medicas",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_comisiones_personal_id",
                table: "comisiones",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_designaciones_personal_id",
                table: "designaciones",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_disciplinario_personal_id",
                table: "disciplinario",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_felicitaciones_personal_id",
                table: "felicitaciones",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_llamadas_atencion_personal_id",
                table: "llamadas_atencion",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_pasaportes_personal_id",
                table: "pasaportes",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_vacaciones_personal_id",
                table: "vacaciones",
                column: "personal_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bajas_medicas");

            migrationBuilder.DropTable(
                name: "comisiones");

            migrationBuilder.DropTable(
                name: "designaciones");

            migrationBuilder.DropTable(
                name: "disciplinario");

            migrationBuilder.DropTable(
                name: "felicitaciones");

            migrationBuilder.DropTable(
                name: "llamadas_atencion");

            migrationBuilder.DropTable(
                name: "pasaportes");

            migrationBuilder.DropTable(
                name: "vacaciones");
        }
    }
}
