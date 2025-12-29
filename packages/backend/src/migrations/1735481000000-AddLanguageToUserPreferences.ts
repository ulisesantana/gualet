import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLanguageToUserPreferences1735481000000
  implements MigrationInterface
{
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_preferences', 'language');
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_preferences',
      new TableColumn({
        name: 'language',
        type: 'varchar',
        length: '2',
        default: "'en'",
        isNullable: false,
      }),
    );
  }
}
