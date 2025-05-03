interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

interface Config {
  port: string;
  mysql: MySQLConfig;  
  xClientId: string;
}

const config: Config = {
  port: process.env.PORT || '8080',
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: parseInt(process.env.DB_PORT || '3306'),
  },  
  xClientId: process.env.X_CLIENT_ID || 'client',
};

export default config; 