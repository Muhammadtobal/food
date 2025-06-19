import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1750232411254 implements MigrationInterface {
    name = 'CreateTables1750232411254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_fe3963d525b2ee03ba471953a7c\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_ec67a0143b254c3577087b20d3a\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`cartId\` \`cartId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`deliveryId\` \`deliveryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_756f53ab9466eb52a52619ee019\``);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_c0c8f47a702c974a77812169bc2\``);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`categoryId\` \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_29e590514f9941296f3a2440d39\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_0b41349481bfe9247b97b40d874\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` CHANGE \`cartId\` \`cartId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` CHANGE \`itemId\` \`itemId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_fe3963d525b2ee03ba471953a7c\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_ec67a0143b254c3577087b20d3a\` FOREIGN KEY (\`deliveryId\`) REFERENCES \`delivery_information\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_756f53ab9466eb52a52619ee019\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_c0c8f47a702c974a77812169bc2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_29e590514f9941296f3a2440d39\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_0b41349481bfe9247b97b40d874\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_0b41349481bfe9247b97b40d874\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_29e590514f9941296f3a2440d39\``);
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_c0c8f47a702c974a77812169bc2\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_756f53ab9466eb52a52619ee019\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_ec67a0143b254c3577087b20d3a\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_fe3963d525b2ee03ba471953a7c\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` CHANGE \`itemId\` \`itemId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` CHANGE \`cartId\` \`cartId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_0b41349481bfe9247b97b40d874\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_29e590514f9941296f3a2440d39\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`categoryId\` \`categoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_c0c8f47a702c974a77812169bc2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_756f53ab9466eb52a52619ee019\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`deliveryId\` \`deliveryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`cartId\` \`cartId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_ec67a0143b254c3577087b20d3a\` FOREIGN KEY (\`deliveryId\`) REFERENCES \`delivery_information\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_fe3963d525b2ee03ba471953a7c\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP COLUMN \`deleted\``);
    }

}
