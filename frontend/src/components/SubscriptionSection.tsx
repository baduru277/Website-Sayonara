"use client";

import React from "react";

interface SubscriptionSectionProps {
  subscription: any;
}

const plans = [
  { name: "Starter", price: 99, duration: "1 Month", color: "#f3eaff", benefits: ["Post up to 5 items", "Exchange items", "Resell options", "Bid on items"] },
  { name: "Standard", price: 199, duration: "3 Months", color: "#eafff3", benefits: ["Post up to 15 items", "Exchange items", "Resell options", "Bid on items", "Priority support"] },
  { name: "Pro", price: 399, duration: "6 Months", color: "#fff3ea", benefits: ["Post up to 50 items", "Exchange items", "Resell options", "Bid on items", "Analytics & Insights"] },
  { name: "Premium", price: 699, duration: "12 Months", color: "#f0e7ff", benefits: ["Unlimited posts", "Exchange items", "Resell options", "Bid on items", "Priority support", "Analytics & Insights", "Feature priority"] },
];

export default function SubscriptionSection({ subscription }: SubscriptionSectionProps) {
  
  const isPending = subscription?.status === "pending";
  const isActive = subscription?.status === "active";

  return (
    <div style={{ padding: "32px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#924DAC", marginBottom: "20px" }}>Subscription Plans</h2>

      {/* Status Banner */}
      {subscription && (
        <div style={{ padding: "20px", borderRadius: "12px", background: isPending ? "#fff7e6" : "#e7ffe7", marginBottom: "30px", border: "1px solid #ddd" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Current Status: {subscription.status?.toUpperCase()}</h3>
          <p>Plan: {subscription.planName || "N/A"} | Amount: ₹{subscription.amount}</p>
          {isPending && <p style={{ color: "#d46b08" }}>⚠️ Waiting for admin approval. You cannot subscribe to another plan yet.</p>}
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.planName === plan.name && isActive;
          
          // Construct the URL for the payment page
          const paymentUrl = `/payment?plan=${encodeURIComponent(plan.name)}&amount=${plan.price}&duration=${encodeURIComponent(plan.duration)}`;

          return (
            <div key={plan.name} style={{ 
              background: plan.color, 
              padding: "24px", 
              borderRadius: "16px", 
              flex: "1 1 200px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column"
            }}>
              <h3 style={{ color: "#924DAC", marginBottom: "10px" }}>{plan.name}</h3>
              <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}>₹{plan.price}</div>
              <div style={{ color: "#666", marginBottom: "15px" }}>{plan.duration}</div>
              
              <ul style={{ paddingLeft: "20px", fontSize: "14px", flexGrow: 1 }}>
                {plan.benefits.map(b => <li key={b} style={{ marginBottom: "5px" }}>{b}</li>)}
              </ul>

              {/* FAIL-SAFE REDIRECT: Using <a> tag instead of <button> */}
              {isCurrentPlan || isPending ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "12px", 
                  background: "#ccc", 
                  borderRadius: "8px", 
                  color: "#666", 
                  fontWeight: "bold",
                  marginTop: "15px"
                }}>
                  {isCurrentPlan ? "Current Plan" : "Pending Approval"}
                </div>
              ) : (
                <a 
                  href={paymentUrl}
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    background: "#924DAC",
                    color: "white",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    marginTop: "15px",
                    transition: "opacity 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Subscribe Now
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
