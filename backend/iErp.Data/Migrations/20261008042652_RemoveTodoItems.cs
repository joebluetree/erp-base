using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace iErp.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTodoItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TODO_ITEMS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TODO_ITEMS",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "RAW(16)", nullable: false),
                    DESCRIPTION = table.Column<string>(type: "NVARCHAR2(2000)", maxLength: 2000, nullable: true),
                    IS_COMPLETED = table.Column<bool>(type: "NUMBER(1)", nullable: false),
                    TITLE = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TODO_ITEMS", x => x.ID);
                });
        }
    }
}
