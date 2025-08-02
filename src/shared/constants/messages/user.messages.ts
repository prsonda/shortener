export const UserMessages = {
  idDescripton: 'User ID',
  nameDescription: 'User name',
  emailDescription: 'User email',
  userDescription: 'User object',
  create: {
    summary: 'Register a new user',
    description:
      'Creates a new user with email and password. Returns user info without sensitive data.',
    success: 'User registered successfully',
  },
  get: {
    summary: 'Get user by ID',
    description: "Fetches a user's public profile data by their unique ID.",
    success: 'User data retrieved successfully',
  },
};
