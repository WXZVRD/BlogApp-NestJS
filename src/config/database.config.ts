import {TypeOrmModuleOptions} from "@nestjs/typeorm";


export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'y1y2fnct',
    database: process.env.DB_NAME || 'postgres', 
    synchronize: true,
    autoLoadEntities: true,
}