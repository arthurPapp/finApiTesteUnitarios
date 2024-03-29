import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AlterTableStatements1675172644451 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('statements', 'type', new TableColumn(
      {
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw', 'transfer']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('statements', 'type', new TableColumn(
      {
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw']
      })
    )
  }

}
