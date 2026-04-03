import prisma from '../utils/prisma.js';

export async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { phoneNumber, dncRegistered } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        phoneNumber: phoneNumber ?? undefined,
        dncRegistered: dncRegistered !== undefined ? Boolean(dncRegistered) : undefined,
        dncRegistrationDate: dncRegistered === true || dncRegistered === 'true' ? new Date() : undefined,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
