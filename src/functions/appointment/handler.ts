import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB, SNS } from 'aws-sdk';
import { AppointmentRequest, validateAppointment } from '../../core/entities/Appointment';
import { getAppointmentsByInsured } from '../../core/use-cases/GetAppointments';

const dynamo = new DynamoDB.DocumentClient();
const sns = new SNS();

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body: AppointmentRequest = JSON.parse(event.body || '{}');
    
    validateAppointment(body);

    // 2. Guardar en DynamoDB con estado 'pending' [cite: 21]
    const paramsDynamo = {
      TableName: process.env.DYNAMODB_TABLE || 'AppointmentsTable',
      Item: {
        ...body,
        status: 'pending', // Requerimiento paso 1 [cite: 21]
        createdAt: new Date().toISOString()
      }
    };
    await dynamo.put(paramsDynamo).promise();

    // 3. Enviar a SNS [cite: 22]
    const paramsSNS = {
      Message: JSON.stringify(body),
      TopicArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: {
        country: { DataType: 'String', StringValue: body.countryISO } // Para el filtro del paso 3 
      }
    };
    await sns.publish(paramsSNS).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Agendamiento en proceso" }) // Mensaje requerido [cite: 5]
    };

  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { insuredId } = event.pathParameters || {};

    if (!insuredId) {
      return { statusCode: 400, body: JSON.stringify({ message: "insuredId es requerido" }) };
    }

    const appointments = await getAppointmentsByInsured(insuredId);

    return {
      statusCode: 200,
      body: JSON.stringify(appointments) // Retorna el listado con el estado 
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Error al listar" }) };
  }
};