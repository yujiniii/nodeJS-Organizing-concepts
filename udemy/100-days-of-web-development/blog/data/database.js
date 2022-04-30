const mysql = require('mysql2/promise'); // 쿼리의 결과가 프로미스를 반환하는지 확인
                                         //  async / await 사용 가능해짐

const pool = mysql.createPool({
    host:"localhost",
    database:'blog',     // 스키마 이름
    user:'root',
    password:"1234"
});

module.exports = pool;