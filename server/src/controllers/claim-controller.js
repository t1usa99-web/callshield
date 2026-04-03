import prisma from '../utils/prisma.js';

export async function listClaims(req, res) {
  try {
    const claims = await prisma.claim.findMany({
      where: { userId: req.userId },
      include: { call: true },
    });

    res.status(200).json(claims);
  } catch (error) {
    console.error('List claims error:', error);
    res.status(500).json({ error: 'Failed to list claims' });
  }
}

export async function createClaim(req, res) {
  try {
    const { callId, claimAmount, courtName, notes } = req.body;

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

    const claim = await prisma.claim.create({
      data: {
        userId: req.userId,
        callId,
        claimAmount: claimAmount ? parseFloat(claimAmount) : null,
        courtName,
        notes,
      },
      include: { call: true },
    });

    // Update call status to CLAIM_FILED
    await prisma.call.update({
      where: { id: callId },
      data: { status: 'CLAIM_FILED' },
    });

    res.status(201).json(claim);
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ error: 'Failed to create claim' });
  }
}

export async function getClaim(req, res) {
  try {
    const { id } = req.params;

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { call: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(claim);
  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({ error: 'Failed to get claim' });
  }
}

export async function updateClaim(req, res) {
  try {
    const { id } = req.params;
    const { claimAmount, courtName, filingDate, caseNumber, status, evidenceChecklist, notes } = req.body;

    const claim = await prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        claimAmount: claimAmount !== undefined ? (claimAmount ? parseFloat(claimAmount) : null) : claim.claimAmount,
        courtName: courtName ?? claim.courtName,
        filingDate: filingDate ? new Date(filingDate) : claim.filingDate,
        caseNumber: caseNumber ?? claim.caseNumber,
        status: status ?? claim.status,
        evidenceChecklist: evidenceChecklist ?? claim.evidenceChecklist,
        notes: notes ?? claim.notes,
      },
      include: { call: true },
    });

    res.status(200).json(updatedClaim);
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({ error: 'Failed to update claim' });
  }
}
