import bcrypt from 'bcrypt';

export const bcryptHash = async (plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, +process.env.SALT_ROUND);
  return hashedPassword;
};

export const comparePassword = async (plainPassword, hash) => bcrypt.compare(plainPassword, hash);
