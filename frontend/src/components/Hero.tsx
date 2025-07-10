"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import 'animate.css';

export default function Hero() {
  const [search, setSearch] = useState('');

  return (
    <section
      style={{
        background: '#fff',
        fontFamily: 'Quicksand, Montserrat, sans-serif',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 16px',
        position: 'relative',
      }}
    >
      {/* Centered Hero Content */}
      <div style={{
        width: '100%',
        maxWidth: 700,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 28,
        paddingTop: 64,
        paddingBottom: 64,
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 826, margin: '0 auto' }}>
          {/* SVG background shapes, only show on md+ screens */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: '100%',
              height: '100%',
              maxWidth: 826,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 0,
              display: 'none',
            }}
            className="md:block hidden"
            aria-hidden="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 13" style={{ position: 'absolute', left: 0, top: 0, opacity: 0.34 }}><path fill="#fff" d="m5.69.067.72 1.86a6 6 0 0 0 3.354 3.4l1.685.678-1.669.718a6 6 0 0 0-3.273 3.478l-.676 1.876-.72-1.86a6 6 0 0 0-3.355-3.4L.07 6.14l1.668-.718a6 6 0 0 0 3.274-3.478z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 12 13" style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-22.74px, -6.81px)' }}><path fill="#fff" d="m5.69.067.72 1.86a6 6 0 0 0 3.354 3.4l1.685.678-1.669.718a6 6 0 0 0-3.273 3.478l-.676 1.876-.72-1.86a6 6 0 0 0-3.355-3.4L.07 6.14l1.668-.718a6 6 0 0 0 3.274-3.478z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 12 13" style={{ position: 'absolute', right: 0, top: 0, transform: 'translate(47px, -6px)' }}><path fill="#fff" d="m5.69.067.72 1.86a6 6 0 0 0 3.354 3.4l1.685.678-1.669.718a6 6 0 0 0-3.273 3.478l-.676 1.876-.72-1.86a6 6 0 0 0-3.355-3.4L.07 6.14l1.668-.718a6 6 0 0 0 3.274-3.478z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 12 13" style={{ position: 'absolute', right: 0, top: 0, transform: 'translate(71px, -23px)', opacity: 0.5 }}><path fill="#fff" d="m5.69.067.72 1.86a6 6 0 0 0 3.354 3.4l1.685.678-1.669.718a6 6 0 0 0-3.273 3.478l-.676 1.876-.72-1.86a6 6 0 0 0-3.355-3.4L.07 6.14l1.668-.718a6 6 0 0 0 3.274-3.478z"></path></svg>
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#924DAC',
            marginBottom: 0,
            letterSpacing: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            Welcome to Sayonara
          </h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: '#444',
          margin: 0,
        }}>
          Your ultimate destination for trading, exchanging, and bidding on items!
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items like 'phone', 'chair', or 'pen'"
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '16px 24px',
            border: '2px solid #924DAC',
            borderRadius: 999,
            fontSize: 18,
            color: '#924DAC',
            fontWeight: 500,
            margin: '0 auto',
            textAlign: 'center',
            outline: 'none',
            marginBottom: 0,
          }}
        />
        <div style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          marginTop: 8,
        }}>
          <Link href="/bidding" className="sayonara-btn">Bidding</Link>
          <Link href="/exchange" className="sayonara-btn">Exchange</Link>
          <Link href="/resell" className="sayonara-btn">Resell</Link>
        </div>
        <Link
          href="/add-item"
          className="sayonara-btn"
          style={{
            fontSize: 20,
            marginTop: 12,
            padding: '12px 36px'
          }}
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}