import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPreferencesTable1729216800000
  implements MigrationInterface
{
  name = 'CreateUserPreferencesTable1729216800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_preferences"
                             (
                               "userId" uuid NOT NULL,
                               "defaultPaymentMethodId" uuid NOT NULL,
                               "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                               "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_user_preferences" PRIMARY KEY ("userId")
                             )`);
    await queryRunner.query(`ALTER TABLE "user_preferences"
      ADD CONSTRAINT "FK_user_preferences_userId" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_preferences"
      ADD CONSTRAINT "FK_user_preferences_defaultPaymentMethodId" FOREIGN KEY ("defaultPaymentMethodId") REFERENCES "payment_methods" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences"
      DROP CONSTRAINT "FK_user_preferences_defaultPaymentMethodId"`);
    await queryRunner.query(`ALTER TABLE "user_preferences"
      DROP CONSTRAINT "FK_user_preferences_userId"`);
    await queryRunner.query(`DROP TABLE "user_preferences"`);
  }
}
