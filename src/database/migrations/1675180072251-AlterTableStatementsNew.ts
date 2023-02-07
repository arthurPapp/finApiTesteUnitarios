import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableStatementsNew1675180072251 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('statements', 'type', new TableColumn(
      {
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw', 'transfer_receive', 'transfer_send']
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
