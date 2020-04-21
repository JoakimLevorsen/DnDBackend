using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace D_D_Backend.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CharacterClass",
                columns: table => new
                {
                    name = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterClass", x => x.name);
                });

            migrationBuilder.CreateTable(
                name: "CharacterRace",
                columns: table => new
                {
                    name = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterRace", x => x.name);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Campaign",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(nullable: false),
                    log = table.Column<string>(nullable: false),
                    turnIndex = table.Column<int>(nullable: false),
                    joinable = table.Column<bool>(nullable: false),
                    maxPlayers = table.Column<int>(nullable: false),
                    password = table.Column<string>(nullable: true),
                    modificationDate = table.Column<DateTime>(nullable: false),
                    dungeonMasterID = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Campaign", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Campaign_User_dungeonMasterID",
                        column: x => x.dungeonMasterID,
                        principalTable: "User",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Character",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(nullable: false),
                    health = table.Column<int>(nullable: false),
                    xp = table.Column<int>(nullable: false),
                    turnIndex = table.Column<int>(nullable: true),
                    ownerID = table.Column<string>(nullable: false),
                    cClassname = table.Column<int>(nullable: false),
                    cRacename = table.Column<int>(nullable: false),
                    campaignID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Character", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Character_CharacterClass_cClassname",
                        column: x => x.cClassname,
                        principalTable: "CharacterClass",
                        principalColumn: "name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Character_CharacterRace_cRacename",
                        column: x => x.cRacename,
                        principalTable: "CharacterRace",
                        principalColumn: "name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Character_Campaign_campaignID",
                        column: x => x.campaignID,
                        principalTable: "Campaign",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Character_User_ownerID",
                        column: x => x.ownerID,
                        principalTable: "User",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiceRoll",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    diceType = table.Column<int>(nullable: false),
                    roll = table.Column<int>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    campaignID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiceRoll", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DiceRoll_Campaign_campaignID",
                        column: x => x.campaignID,
                        principalTable: "Campaign",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Campaign_dungeonMasterID",
                table: "Campaign",
                column: "dungeonMasterID");

            migrationBuilder.CreateIndex(
                name: "IX_Character_cClassname",
                table: "Character",
                column: "cClassname");

            migrationBuilder.CreateIndex(
                name: "IX_Character_cRacename",
                table: "Character",
                column: "cRacename");

            migrationBuilder.CreateIndex(
                name: "IX_Character_campaignID",
                table: "Character",
                column: "campaignID");

            migrationBuilder.CreateIndex(
                name: "IX_Character_ownerID",
                table: "Character",
                column: "ownerID");

            migrationBuilder.CreateIndex(
                name: "IX_DiceRoll_campaignID",
                table: "DiceRoll",
                column: "campaignID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Character");

            migrationBuilder.DropTable(
                name: "DiceRoll");

            migrationBuilder.DropTable(
                name: "CharacterClass");

            migrationBuilder.DropTable(
                name: "CharacterRace");

            migrationBuilder.DropTable(
                name: "Campaign");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
