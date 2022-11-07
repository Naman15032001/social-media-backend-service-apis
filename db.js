import mysql from 'mysql';

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: "instagram"
})

connection.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log('Database connected');
})

export default connection;