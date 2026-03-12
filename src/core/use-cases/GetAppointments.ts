import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

export const getAppointmentsByInsured = async (insuredId: string) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    KeyConditionExpression: "insuredId = :id",
    ExpressionAttributeValues: {
      ":id": insuredId // El insuredId llega por URL 
    }
  };
  
  const result = await dynamo.query(params).promise();
  return result.Items;
};