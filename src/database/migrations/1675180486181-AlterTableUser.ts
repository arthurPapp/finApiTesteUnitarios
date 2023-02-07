import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableUser1675180486181 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('statements', new TableColumn(
      {
        name: 'sender_id',
        type: 'varchar',
      }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'sender_id');
  }

}
