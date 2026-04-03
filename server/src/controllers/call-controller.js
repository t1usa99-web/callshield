import prisma from '../utils/prisma.js';

export async function listCalls(req, res) {
  try {
    const calls = await prisma.call.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });

    res.status(200).json(calls);
  } catch (error) {
    console.error('List calls error:', error);
    res.status(500).json({ error: 'Failed to list calls' });
  }
}

export async function createCall(req, res) {
  try {
    const { callerNumber, date, callerName, callerCompany, callerID, callType, time, state, registeredOnDNC, consentGiven, existingRelationship, notes } = req.body;

    const call = await prisma.call.create({
      data: {
        userId: req.userId,
        callerNumber,
        date: new Date(date),
        callerName,
        callerCompany,
        callerID,
        callType: callType || 'ROBOCALL',
        time,
        state,
        registeredOnDNC: registeredOnDNC || 'yes',
        consentGiven: consentGiven || 'no',
        existingRelationship: existingRelationship || 'no',
        notes,
      },
    });

    res.status(201).json(call);
  } catch (error) {
    console.error('Create call error:', error);
    res.status(500).json({ error: 'Failed to create call' });
  }
}

export async function getCall(req, res) {
  try {
    const { id } = req.params;

    const call = await prisma.call.findUnique({
      where: { id },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(call);
  } catch (error) {
    console.error('Get call error:', error);
    res.status(500).json({ error: 'Failed to get call' });
  }
}

export async function updateCall(req, res) {
  try {
    const { id } = req.params;
    const { callerNumber, date, callerName, callerCompany, callerID, callType, time, state, registeredOnDNC, consentGiven, existingRelationship, notes } = req.body;

    const call = await prisma.call.findUnique({
      where: { id },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedCall = await prisma.call.update({
      where: { id },
      data: {
        callerNumber: callerNumber ?? call.callerNumber,
        date: date ? new Date(date) : call.date,
        callerName: callerName ?? call.callerName,
        callerCompany: callerCompany ?? call.callerCompany,
        callerID: callerID ?? call.callerID,
        callType: callType ?? call.callType,
        time: time ?? call.time,
        state: state ?? call.state,
        registeredOnDNC: registeredOnDNC ?? call.registeredOnDNC,
        consentGiven: consentGiven ?? call.consentGiven,
        existingRelationship: existingRelationship ?? call.existingRelationship,
        notes: notes ?? call.notes,
      },
    });

    res.status(200).json(updatedCall);
  } catch (error) {
    console.error('Update call error:', error);
    res.status(500).json({ error: 'Failed to update call' });
  }
}

export async function deleteCall(req, res) {
  try {
    const { id } = req.params;

    const call = await prisma.call.findUnique({
      where: { id },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.call.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Call deleted successfully' });
  } catch (error) {
    console.error('Delete call error:', error);
    res.status(500).json({ error: 'Failed to delete call' });
  }
}

export async function updateCallStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const call = await prisma.call.findUnique({
      where: { id },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedCall = await prisma.call.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(updatedCall);
  } catch (error) {
    console.error('Update call status error:', error);
    res.status(500).json({ error: 'Failed to update call status' });
  }
}
