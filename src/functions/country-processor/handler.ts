import { SQSEvent } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { createConnection } from 'mysql2/promise';

const eventBridge = new EventBridge();

export const processAppointment = async (event: SQSEvent) => {
  const dbConfig = {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE
  };

  for (const record of event.Records) {
    const appointmentData = JSON.parse(record.body);

    const connection = await createConnection(dbConfig);
    const query = 'INSERT INTO appointments (insuredId, scheduleId, countryISO, status) VALUES (?, ?, ?, ?)';
    await connection.execute(query, [
      appointmentData.insuredId, 
      appointmentData.scheduleId, 
      appointmentData.countryISO, 
      'completed'
    ]);
    await connection.end();

    const params = {
      Entries: [{
        Source: `rimac.appointment.${appointmentData.countryISO.toLowerCase()}`,
        DetailType: 'AppointmentProcessed',
        Detail: JSON.stringify({
          insuredId: appointmentData.insuredId,
          scheduleId: appointmentData.scheduleId,
          status: 'completed'
        }),
        EventBusName: 'default'
      }]
    };
    await eventBridge.putEvents(params).promise();
  }
};