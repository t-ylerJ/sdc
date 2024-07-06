import postgres from 'postgres';

  const sql = postgres({
    host: 'localhost',
    port: 5432,
    database:'qna'
  })



  export default sql;

