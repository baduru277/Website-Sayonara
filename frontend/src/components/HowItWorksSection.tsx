"use client";

import React from 'react';
import Link from 'next/link';

export default function HowItWorksSection() {
  return (
    <section style={{
      background: '#f8f9fa',
      padding: '80px 20px',
      fontFamily: 'Quicksand, Montserrat, sans-serif',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Section Header */}
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#924DAC',
          marginBottom: '16px',
        }}>
          How Sayonara Works
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: '#666',
          marginBottom: '60px',
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Discover the three main ways to trade, exchange, and find great deals on our platform
        </p>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
        }}>
          {/* Bidding Feature */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid #e9ecef',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(146, 77, 172, 0.2)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}>
            {/* Arrow indicator at top */}
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
              fontSize: '24px',
              color: '#924DAC',
              opacity: 0.7,
            }}>
              ↑
            </div>
            {/* Bidding Icon/Model */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #924DAC, #6d2fa6)',
              borderRadius: '50%',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#fff',
              fontWeight: 'bold',
            }}>
              🏷️
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '16px',
            }}>
              Bidding
            </h3>
            
            <p style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              Place competitive bids on items you want. Watch auctions in real-time and outbid others to win amazing deals.
            </p>

            {/* Bidding Process Model */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0',
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '8px',
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>1</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Browse Items</div>
              </div>
              <div style={{ fontSize: '20px', color: '#ccc' }}>→</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>2</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Place Bid</div>
              </div>
              <div style={{ fontSize: '20px', color: '#ccc' }}>→</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>3</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Win & Pay</div>
              </div>
            </div>
          </div>

          {/* Exchange Feature */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid #e9ecef',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(146, 77, 172, 0.2)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}>
            {/* Arrow indicator at top */}
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
              fontSize: '24px',
              color: '#924DAC',
              opacity: 0.7,
            }}>
              ↑
            </div>
            {/* Exchange Icon/Model */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #924DAC, #6d2fa6)',
              borderRadius: '50%',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#fff',
              fontWeight: 'bold',
            }}>
              🔄
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '16px',
            }}>
              Exchange
            </h3>
            
            <p style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              Trade items directly with other users. Find perfect matches and exchange goods without spending money.
            </p>

            {/* Exchange Process Model */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0',
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '8px',
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>1</div>
                <div style={{ fontSize: '12px', color: '#666' }}>List Item</div>
              </div>
              <div style={{ fontSize: '20px', color: '#ccc' }}>↔</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>2</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Find Match</div>
              </div>
              <div style={{ fontSize: '20px', color: '#ccc' }}>↔</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>3</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Trade</div>
              </div>
            </div>
          </div>

          {/* Resell Feature */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid #e9ecef',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(146, 77, 172, 0.2)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}>
            {/* Arrow indicator at top */}
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
              fontSize: '24px',
              color: '#924DAC',
              opacity: 0.7,
            }}>
              ↑
            </div>
            {/* Resell Icon/Model */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #924DAC, #6d2fa6)',
              borderRadius: '50%',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#fff',
              fontWeight: 'bold',
            }}>
              💰
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '16px',
            }}>
              Resell
            </h3>
            
            <p style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              Sell your items directly to buyers. Set your price, upload photos, and connect with interested buyers quickly.
            </p>

            {/* Resell Process Model */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0',
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '8px',
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>1</div>
                <div style={{ fontSize: '12px', color: '#666' }}>List Item</div>
              </div>
              <div style={{ fontSize: '20px', color: '#ccc' }}>→</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>2</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Get Offers</div>
              </div>
              <div style={{ fontSize: '20px', color: '#ccc' }}>→</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#924DAC',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>3</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Sell & Earn</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, #924DAC, #6d2fa6)',
          borderRadius: '16px',
          padding: '40px',
          color: '#fff',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 600,
            marginBottom: '16px',
          }}>
            Ready to Get Started?
          </h3>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '32px',
            opacity: 0.9,
          }}>
            Join thousands of users who are already trading, bidding, and selling on Sayonara
          </p>
          <Link href="/add-item" className="sayonara-btn" style={{
            background: '#fff',
            color: '#924DAC',
            borderColor: '#fff',
            fontSize: '1.1rem',
            padding: '16px 32px',
            display: 'inline-block',
          }}>
            List Your First Item
          </Link>
        </div>
      </div>
    </section>
  );
} 