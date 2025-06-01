import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1748765181153 implements MigrationInterface {
    name = 'CreateTables1748765181153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`delivery_information\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`street\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`zipCode\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_c0c8f47a702c974a77812169bc2\``);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`categoryId\` \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_c0c8f47a702c974a77812169bc2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_c0c8f47a702c974a77812169bc2\``);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`categoryId\` \`categoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_c0c8f47a702c974a77812169bc2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE \`delivery_information\``);
    }

}
