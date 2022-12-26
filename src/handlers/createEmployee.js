const uuid = require('uuid');
const AWS = require('aws-sdk');
const middleware = require('@middy/http-error-handler');
const createError = require('@middy/http-error-handler');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createEmployee(event, context) {
  const { age } = event.body;
  const { name } = event.body;
  const { position } = event.body;
  const now = new Date();

  const employee = {
    id: uuid(),
    age,
    name,
    position,
    created: now.toISOString(),
    updated: now.toISOString()
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.ENTERPRISE_TABLE_NAME,
        Item: employee,
      })
      .promise(); // to return a promise instead
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(employee),
  };
}

export const handler = middleware(createEmployee);