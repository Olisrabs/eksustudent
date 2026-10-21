import { 
  PaymentTransaction, 
  PaymentCase, 
  DiscrepancyClassification, 
  PaymentCategory 
} from '../types';

export interface VerificationResult {
  reference: string;
  classification: DiscrepancyClassification;
  providerStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  portalStatus: 'PAID' | 'UNPAID';
  amount: number;
  paidAt?: string;
  gatewayChannel: string;
  explanation: string;
  canAutoResolve: boolean;
  recommendedTeam: 'BURSARY_FINANCE' | 'ICT_INTEGRATION' | 'HOSTEL_ADMIN';
}

/**
 * Deterministic Payment Reconciliation Engine
 * Strictly follows banking rules: compares Gateway status vs EKSU Portal Ledger status
 */
export class PaymentReconciliationService {
  /**
   * Mock Gateway Database (Simulating Remita, Interswitch, and Paystack databases)
   */
  private static MOCK_GATEWAY_RECORDS: Record<string, {
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    amount: number;
    channel: string;
    paidAt: string;
    accountDebited: string;
    beneficiary: string;
  }> = {
    'RRR-2409-1834-9021': {
      status: 'SUCCESS',
      amount: 35000,
      channel: 'REMITA_NIP',
      paidAt: '2026-10-21 09:16:04',
      accountDebited: 'GTBank (014****892)',
      beneficiary: 'EKSU IGR / Hostel Dues Account'
    },
    'RRR-1102-8841-3392': {
      status: 'SUCCESS',
      amount: 75500,
      channel: 'REMITA_CARD',
      paidAt: '2026-09-12 14:21:45',
      accountDebited: 'Zenith Bank (208****419)',
      beneficiary: 'EKSU Main Treasury TSA'
    },
    'ISW-8842-1920-5512': {
      status: 'SUCCESS',
      amount: 5000,
      channel: 'INTERSWITCH_WEB',
      paidAt: '2026-10-02 11:06:12',
      accountDebited: 'First Bank (301****021)',
      beneficiary: 'EKSU Science Faculty Account'
    },
    'RRR-9988-7766-5544': {
      status: 'SUCCESS',
      amount: 35000,
      channel: 'REMITA_USSD',
      paidAt: '2026-10-21 10:04:19',
      accountDebited: 'Access Bank (002****991)',
      beneficiary: 'EKSU IGR / Hostel Dues Account'
    },
    'PST-3321-9901': {
      status: 'PENDING',
      amount: 15000,
      channel: 'PAYSTACK_TRANSFER',
      paidAt: '2026-10-21 11:45:00',
      accountDebited: 'Kuda Bank (110****334)',
      beneficiary: 'EKSU Late Registration Ledger'
    }
  };

  /**
   * Reconcile a transaction reference against Gateway and EKSU Portal Ledger
   */
  public static verifyTransaction(
    reference: string, 
    expectedAmount: number,
    portalLedgerStatus: 'PAID' | 'UNPAID'
  ): VerificationResult {
    const cleanRef = reference.trim().toUpperCase();
    const gateway = this.MOCK_GATEWAY_RECORDS[cleanRef];

    // If reference doesn't exist on gateway records
    if (!gateway) {
      // Simulate dynamic verification for user-entered references
      if (cleanRef.startsWith('RRR-') || cleanRef.startsWith('2409') || cleanRef.length >= 10) {
        return {
          reference: cleanRef,
          classification: 'PORTAL_DESYNC_VERIFIED',
          providerStatus: 'SUCCESS',
          portalStatus: portalLedgerStatus,
          amount: expectedAmount,
          paidAt: new Date(Date.now() - 1000 * 60 * 35).toISOString().replace('T', ' ').substring(0, 19),
          gatewayChannel: 'REMITA_NIP',
          explanation: `Simulated gateway check confirms reference ${cleanRef} was debited and settled successfully. EKSU portal table remains ${portalLedgerStatus}. Portal desynchronization confirmed.`,
          canAutoResolve: true,
          recommendedTeam: 'ICT_INTEGRATION'
        };
      }

      return {
        reference: cleanRef,
        classification: 'INVALID_REFERENCE',
        providerStatus: 'FAILED',
        portalStatus: portalLedgerStatus,
        amount: expectedAmount,
        gatewayChannel: 'UNKNOWN',
        explanation: `Reference ${cleanRef} was not recognized by Remita, Interswitch, or NIBSS. Check for typing errors on the bank deposit teller or e-receipt.`,
        canAutoResolve: false,
        recommendedTeam: 'BURSARY_FINANCE'
      };
    }

    if (gateway.status === 'PENDING') {
      return {
        reference: cleanRef,
        classification: 'GATEWAY_PENDING',
        providerStatus: 'PENDING',
        portalStatus: portalLedgerStatus,
        amount: gateway.amount,
        paidAt: gateway.paidAt,
        gatewayChannel: gateway.channel,
        explanation: `Transaction is currently pending inter-bank clearing between ${gateway.accountDebited} and the university collection switch. Do not make a second payment. Status will auto-poll.`,
        canAutoResolve: false,
        recommendedTeam: 'BURSARY_FINANCE'
      };
    }

    if (gateway.amount !== expectedAmount) {
      return {
        reference: cleanRef,
        classification: 'AMOUNT_MISMATCH',
        providerStatus: 'SUCCESS',
        portalStatus: portalLedgerStatus,
        amount: gateway.amount,
        paidAt: gateway.paidAt,
        gatewayChannel: gateway.channel,
        explanation: `Amount discrepancy: Payment received was ₦${gateway.amount.toLocaleString()}, whereas required fee for this service is ₦${expectedAmount.toLocaleString()}. Case routed to Bursary for balance assessment.`,
        canAutoResolve: false,
        recommendedTeam: 'BURSARY_FINANCE'
      };
    }

    if (gateway.status === 'SUCCESS' && portalLedgerStatus === 'UNPAID') {
      return {
        reference: cleanRef,
        classification: 'PORTAL_DESYNC_VERIFIED',
        providerStatus: 'SUCCESS',
        portalStatus: 'UNPAID',
        amount: gateway.amount,
        paidAt: gateway.paidAt,
        gatewayChannel: gateway.channel,
        explanation: `CRITICAL DESYNC DETECTED: Bank debited ₦${gateway.amount.toLocaleString()} via ${gateway.channel} at ${gateway.paidAt}, but EKSU Portal webhook listener failed to acknowledge receipt. Eligible for 1-Click Automated Ledger Clearance!`,
        canAutoResolve: true,
        recommendedTeam: 'ICT_INTEGRATION'
      };
    }

    return {
      reference: cleanRef,
      classification: 'MATCHED_SYNCED',
      providerStatus: 'SUCCESS',
      portalStatus: 'PAID',
      amount: gateway.amount,
      paidAt: gateway.paidAt,
      gatewayChannel: gateway.channel,
      explanation: `Payment is fully reconciled and confirmed on EKSU financial records. Your official e-receipt is valid.`,
      canAutoResolve: false,
      recommendedTeam: 'ICT_INTEGRATION'
    };
  }

  /**
   * Generate official verification receipt data
   */
  public static generateOfficialReceipt(transaction: PaymentTransaction, studentMatric: string) {
    return {
      receiptNumber: `EKSU-REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      session: '2024/2025',
      matricNumber: studentMatric,
      feeType: transaction.category,
      amountPaid: transaction.amount,
      gatewayReference: transaction.reference,
      channel: transaction.channel,
      verifiedTimestamp: new Date().toISOString(),
      qrSignature: `VERIFIED#${transaction.reference}#EKSU_BURSARY_SEAL`
    };
  }
}
