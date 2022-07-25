const dbConfig = {
    HOST: "localhost",
    USER: "api",
    PASSWORD: 'N/=Fb5F8g-xPB\<y',
    DB: "mydb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-07:00'
  };

export default dbConfig;
