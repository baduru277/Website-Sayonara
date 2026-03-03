"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import apiService from "@/services/api";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [plan, setPlan] = useState({
    name: searchParams.get('plan') || 'Basic Plan',
    amount: parseFloat(searchParams.get('amount') || '99'),
    duration: searchParams.get('duration') || '1 Year'
  });

  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [transactionId, setTransactionId] = useState('');
  const [dynamicQR, setDynamicQR] = useState('');

  const upiId = 'auduru.sarikarao11-2@okaxis';

  useEffect(() => {
    generateDynamicQR();
  }, [plan.amount]);

  const generateDynamicQR = async () => {
    try {
      const upiString = `upi://pay?pa=${upiId}&pn=Sayonara&am=${plan.amount}&cu=INR&tn=Subscription-${plan.name.replace(/\s/g, '')}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}&color=924DAC`;
      setDynamicQR(qrUrl);
    } catch (error) {
      console.error('Failed to generate QR:', error);
    }
  };

  const handlePaymentComplete = () => {
    if (!transactionId.trim()) {
      alert('Please enter your transaction ID');
      return;
    }
    setStep('confirmation');
  };

  const handleGoToDashboard = () => {
    router.push('/profile?tab=subscription');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', padding: '40px 20px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #924DAC 0%, #d97ef6 100%)',
          borderRadius: 16, padding: 24, color: '#fff',
          textAlign: 'center', marginBottom: 32
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Complete Payment</h1>
          <p style={{ fontSize: 16, opacity: 0.9 }}>{plan.name} - {plan.duration}</p>
        </div>

        {step === 'payment' ? (
          <div style={{
            background: '#fff', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(146,77,172,0.08)', overflow: 'hidden'
          }}>
            {/* Amount Card */}
            <div style={{
              background: '#f3eaff', padding: 24, textAlign: 'center',
              borderBottom: '2px solid #e0e0e0'
            }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Amount to Pay</div>
              <div style={{ fontSize: 42, fontWeight: 700, color: '#924DAC' }}>₹{plan.amount}</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
                One-time payment for {plan.duration}
              </div>
            </div>

            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#924DAC', marginBottom: 20 }}>
                📷 Scan QR Code to Pay
              </h3>

              {/* QR Section */}
              <div style={{
                background: '#faf8fd', borderRadius: 12, padding: 24,
                marginBottom: 24, textAlign: 'center'
              }}>
                {/* Official Static QR */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 12 }}>
                    Official QR Code (Recommended)
                  </div>
                  <div style={{
                    background: '#fff', padding: 16, borderRadius: 12,
                    display: 'inline-block', boxShadow: '0 2px 8px rgba(146,77,172,0.1)'
                  }}>
                    <Image
                      src="/qr-code-payment.png"
                      alt="Sayonara Payment QR Code"
                      width={250}
                      height={250}
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                  {/* Blurred/hidden UPI ID below QR */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#924DAC' }}>
                      Sayonara
                    </div>
                    <div style={{
                      fontSize: 12, color: '#999', marginTop: 4,
                      filter: 'blur(4px)', userSelect: 'none'
                    }}>
                      {upiId}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: '#e0e0e0', margin: '0 0 24px 0' }} />

                {/* Dynamic QR with amount pre-filled */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 12 }}>
                    Dynamic QR — Amount Pre-filled: ₹{plan.amount}
                  </div>
                  <div style={{
                    background: '#fff', padding: 16, borderRadius: 12,
                    display: 'inline-block', boxShadow: '0 2px 8px rgba(146,77,172,0.1)'
                  }}>
                    {dynamicQR && (
                      <Image
                        src={dynamicQR}
                        alt="Dynamic Payment QR"
                        width={200}
                        height={200}
                        style={{ borderRadius: 8 }}
                      />
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#666', marginTop: 16, lineHeight: 1.8 }}>
                  Scan with any UPI app:<br />
                  <strong>Google Pay • PhonePe • Paytm • BHIM</strong>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#666', marginBottom: 8 }}>
                  Transaction ID / Reference Number *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID after payment"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #f3eaff', borderRadius: 8,
                    fontSize: 16, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Important Note */}
              <div style={{
                background: '#fff7e6', border: '2px solid #ffd666',
                borderRadius: 12, padding: 16, marginBottom: 24
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#d46b08', marginBottom: 8 }}>
                  ⚠️ Important Instructions
                </div>
                <div style={{ fontSize: 13, color: '#ad6800', lineHeight: 1.8 }}>
                  • Complete the payment by scanning the QR code above<br />
                  • Screenshot your payment confirmation<br />
                  • Enter the transaction ID below<br />
                  • Your subscription will be activated within 24 hours<br />
                  • Contact support for any payment issues
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handlePaymentComplete}
                disabled={!transactionId.trim()}
                style={{
                  width: '100%',
                  background: transactionId.trim() ? '#2d7a2d' : '#ccc',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '14px 20px', fontSize: 16, fontWeight: 600,
                  cursor: transactionId.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => { if (transactionId.trim()) e.currentTarget.style.background = '#1f5c1f'; }}
                onMouseOut={(e) => { if (transactionId.trim()) e.currentTarget.style.background = '#2d7a2d'; }}
              >
                ✓ I've Completed the Payment
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#fff', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(146,77,172,0.08)',
            padding: 40, textAlign: 'center'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#2d7a2d', marginBottom: 12 }}>
              Payment Submitted Successfully!
            </h2>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>Thank you for your payment!</p>
            <div style={{
              background: '#f3eaff', padding: 12, borderRadius: 8,
              marginBottom: 24, fontSize: 14
            }}>
              Transaction ID: <strong style={{ color: '#924DAC' }}>{transactionId}</strong>
            </div>

            <div style={{
              background: '#e7ffe7', borderRadius: 12, padding: 20,
              marginBottom: 24, textAlign: 'left'
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2d7a2d', marginBottom: 12 }}>
                What happens next?
              </h4>
              <div style={{ fontSize: 14, color: '#1f5c1f', lineHeight: 2 }}>
                1️⃣ Admin will verify your payment (within 24 hours)<br />
                2️⃣ You'll receive a confirmation notification<br />
                3️⃣ Your subscription will be activated<br />
                4️⃣ Start using all premium features!
              </div>
            </div>

            <div style={{
              fontSize: 13, color: '#999', marginBottom: 24,
              padding: 12, background: '#f9f9f9', borderRadius: 8
            }}>
              💡 You can check your subscription status in your profile dashboard
            </div>

            <button
              onClick={handleGoToDashboard}
              style={{
                width: '100%', background: '#924DAC', color: '#fff',
                border: 'none', borderRadius: 8, padding: '14px 20px',
                fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#7a3a8a'}
              onMouseOut={(e) => e.currentTarget.style.background = '#924DAC'}
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 32, textAlign: 'center', color: '#924DAC', fontSize: 18 }}>
        Loading payment details...
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
