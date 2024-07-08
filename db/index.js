import postgres from 'postgres';//Postgres.js

  const sql = postgres({
    host: 'localhost',
    port: 5432,
    database:'qna'
  })



  export default sql;

