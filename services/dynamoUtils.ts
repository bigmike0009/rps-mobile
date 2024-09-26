import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const createUserProfile = async (userId: string) => {
  const params = {
    TableName: 'UserProfiles',
    Item: {
      userId: userId,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    console.log('User profile created successfully.');
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};
