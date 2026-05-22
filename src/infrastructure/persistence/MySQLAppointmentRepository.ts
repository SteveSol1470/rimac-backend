import mysql from 'mysql2/promise';

export class MySQLAppointmentRepository {
  private pool: mysql.Pool;

  constructor() {
    // El pool se crea una sola vez al instanciar la clase
    this.pool = mysql.createPool({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
      waitForConnections: true,
      connectionLimit: 10
    });
  }

  async save(appointment: any): Promise<void> {
    const query = 'INSERT INTO appointments (insuredId, scheduleId, countryISO, status) VALUES (?, ?, ?, ?)';
    await this.pool.execute(query, [
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO,
      'completed'
    ]);
  }
}