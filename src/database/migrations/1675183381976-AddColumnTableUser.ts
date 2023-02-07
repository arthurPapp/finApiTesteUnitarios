import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnTableUser1675183381976 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('statements', 'sender_id', new TableColumn(
      {
        name: 'sender_id',
        type: 'varchar',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'sender_id');
  }

}
