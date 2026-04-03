import prisma from '../utils/prisma.js';

export async function listComplaints(req, res) {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: req.userId },
      include: { call: true },
    });

    res.status(200).json(complaints);
  } catch (error) {
    console.error('List complaints error:', error);
    res.status(500).json({ error: 'Failed to list complaints' });
  }
}

export async function createComplaint(req, res) {
  try {
    const { callId, agency, confirmationNumber, notes } = req.body;

    // Verify call exists and belongs to user
    const call = await prisma.call.findUnique({
      where: { id: callId },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.userId,
        callId,
        agency,
        confirmationNumber,
        notes,
      },
      include: { call: true },
    });

    // Update call status to COMPLAINT_FILED
    await prisma.call.update({
      where: { id: callId },
      data: { status: 'COMPLAINT_FILED' },
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
}

export async function getComplaint(req, res) {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { call: true },
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (complaint.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ error: 'Failed to get complaint' });
  }
}
