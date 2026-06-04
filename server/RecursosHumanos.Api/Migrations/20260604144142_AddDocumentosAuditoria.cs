using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RecursosHumanos.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentosAuditoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "adjuntos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    filename = table.Column<string>(type: "text", nullable: true),
                    mime = table.Column<string>(type: "text", nullable: true),
                    size = table.Column<int>(type: "integer", nullable: true),
                    url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_adjuntos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "archivos",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tipo = table.Column<string>(type: "text", nullable: true),
                    codigo = table.Column<string>(type: "text", nullable: true),
                    fecha = table.Column<DateOnly>(type: "date", nullable: true),
                    nombre = table.Column<string>(type: "text", nullable: true),
                    inicio = table.Column<DateOnly>(type: "date", nullable: true),
                    fin = table.Column<DateOnly>(type: "date", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_archivos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    actor_id = table.Column<Guid>(type: "uuid", nullable: true),
                    entidad = table.Column<string>(type: "text", nullable: true),
                    entidad_id = table.Column<string>(type: "text", nullable: true),
                    accion = table.Column<string>(type: "text", nullable: true),
                    payload = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_audit_logs_usuarios_actor_id",
                        column: x => x.actor_id,
                        principalTable: "usuarios",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "correspondencia",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tipo = table.Column<string>(type: "text", nullable: true),
                    codigo_registro = table.Column<string>(type: "text", nullable: true),
                    origen = table.Column<string>(type: "text", nullable: true),
                    nro_oficio = table.Column<string>(type: "text", nullable: true),
                    referencia = table.Column<string>(type: "text", nullable: true),
                    remitente = table.Column<string>(type: "text", nullable: true),
                    seccion = table.Column<string>(type: "text", nullable: true),
                    fecha_hora = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    firma = table.Column<string>(type: "text", nullable: true),
                    tiempo_respuesta = table.Column<string>(type: "text", nullable: true),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_correspondencia", x => x.id);
                    table.ForeignKey(
                        name: "FK_correspondencia_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "revision_juridica",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tipo = table.Column<string>(type: "text", nullable: true),
                    codigo = table.Column<string>(type: "text", nullable: true),
                    destino = table.Column<string>(type: "text", nullable: true),
                    origen = table.Column<string>(type: "text", nullable: true),
                    fecha = table.Column<DateOnly>(type: "date", nullable: true),
                    motivo = table.Column<string>(type: "text", nullable: true),
                    recepcion = table.Column<string>(type: "text", nullable: true),
                    fecha_hora = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    firma = table.Column<string>(type: "text", nullable: true),
                    entrega = table.Column<string>(type: "text", nullable: true),
                    personal_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_revision_juridica", x => x.id);
                    table.ForeignKey(
                        name: "FK_revision_juridica_personal_personal_id",
                        column: x => x.personal_id,
                        principalTable: "personal",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "archivos_rel",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    entity_type = table.Column<string>(type: "text", nullable: true),
                    entity_id = table.Column<string>(type: "text", nullable: true),
                    archivo_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_archivos_rel", x => x.id);
                    table.ForeignKey(
                        name: "FK_archivos_rel_archivos_archivo_id",
                        column: x => x.archivo_id,
                        principalTable: "archivos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_archivos_rel_archivo_id",
                table: "archivos_rel",
                column: "archivo_id");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_actor_id",
                table: "audit_logs",
                column: "actor_id");

            migrationBuilder.CreateIndex(
                name: "IX_correspondencia_personal_id",
                table: "correspondencia",
                column: "personal_id");

            migrationBuilder.CreateIndex(
                name: "IX_revision_juridica_personal_id",
                table: "revision_juridica",
                column: "personal_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "adjuntos");

            migrationBuilder.DropTable(
                name: "archivos_rel");

            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "correspondencia");

            migrationBuilder.DropTable(
                name: "revision_juridica");

            migrationBuilder.DropTable(
                name: "archivos");
        }
    }
}
