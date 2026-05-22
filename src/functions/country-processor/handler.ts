import { SQSEvent } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { MySQLAppointmentRepository } from '../../infrastructure/persistence/MySQLAppointmentRepository';

const eventBridge = new EventBridge();
// Instancia el repositorio FUERA del handler para reutilizar el pool
const repository = new MySQLAppointmentRepository();

export const processAppointment = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const appointmentData = JSON.parse(record.body);

    // Lógica delegada al repositorio
    await repository.save(appointmentData);

    // Notificación a EventBridge
    await eventBridge.putEvents({
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
    }).promise();
  }
};