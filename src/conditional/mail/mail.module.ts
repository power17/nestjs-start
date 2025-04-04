import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(process.env.NODE_ENV, configService.get('MAIL_TRANSPORT'));

        return {
          transport: configService.get('MAIL_TRANSPORT'),
          defaults: {
            from: `"${configService.get('MAIL_FROM')}" <${configService.get('MAIL_FROM_ADDRESS')}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class MailModule {}
