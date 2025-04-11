import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";


@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule{}