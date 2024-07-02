import postgres from 'postgres';

  const sql = postgres({
    host: 'localhost',
    port: 5432,
    database:'qna',
    // username: 'postgres',
    // password: 'qn@D@ta123'
  })



  export default sql;

