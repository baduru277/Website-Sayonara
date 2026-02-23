"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SubscriptionSectionProps {
  subscription: any;
}

const plans = [
  {
    name: "Starter",
    price: 99,
    duration: "1 Month",
    benefits: ["Post up to 5 items", "Exchange items", "Resell options", "Bid on items"],
    color: "#f3eaff",
  },
  {
    name: "Standard",
    price: 199,
    duration: "3 Months",
    benefits: ["Post up to 15 items", "Exchange items", "Resell options", "Bid on items", "Priority support"],
    color: "#eafff3",
  },
  {
    name: "Pro",
    price: 399,
    duration: "6 Months",
    benefits: ["Post up to 50 items", "Exchange items", "Resell options", "Bid on items", "Analytics & Insights"],
    color: "#fff3ea",
  },
  {
    name: "Premium",
    price: 699,
    duration: "12 Months",
    benefits: ["Unlimited posts", "Exchange items", "Resell options", "Bid on items", "Priority support", "Analytics & Insights", "Feature priority"],
    color: "#f0e7ff",
  },
];

export default function SubscriptionSection({ subscription }: SubscriptionSectionProps) {
  const router = useRouter();

  const getSubscriptionDisplay = () => {
    if (!subscription) return { text: "Free", color: "#f0e7ff", status: "No active plan", planName: "Free Plan" };

    if (subscription.status === "pending") {
      return {
        text: "Pending",
        color: "#fff7e6",
        status: "Pending Approval",
        planName: subscription.planName || "Basic Plan",
        expiryDate: "N/A",
        daysRemaining: 0,
      };
    }

    const isExpired =
      subscription.isExpired ||
      (subscription.expiryDate && new Date() > new Date(subscription.expiryDate));

    if (isExpired) {
      return { text: "Expired", color: "#ffe7e7", status: "Plan expired", planName: subscription.planName };
    }

    return {
      text: `₹${subscription.amount}`,
      color: "#e7ffe7",
      status: subscription.status === "active" ? "Active" : subscription.status,
      planName: subscription.planName || "Basic Plan",
      expiryDate: subscription.expiryDate
        ? new Date(subscription.expiryDate).toLocaleDateString()
        : "N/A",
      daysRemaining: subscription.daysRemaining || 0,
    };
  };

  const subDisplay = getSubscriptionDisplay();

  return (
    <div style={{ padding: 32, position: "relative", zIndex: 1 }}>
      <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
        Subscription Plans
      </h2>

      {/* Current Subscription Status */}
      {subscription && (
        <div
          style={{
            background: subDisplay.color,
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 2px 12px rgba(146,77,172,0.08)",
            border: subscription.status === "pending" ? "2px solid #ffd666" : "none",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 12 }}>
            Your Current Plan
          </h3>

          {subscription.status === "pending" && (
            <div style={{ background: "rgba(255,214,102,0.3)", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14, color: "#ad6800" }}>
              ⏳ Your subscription is pending admin approval.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Plan Name</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#222" }}>{subDisplay.planName}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Status</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: subscription.status === "active" ? "#2d7a2d" : "#d46b08" }}>
                {subDisplay.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 16 }}>
        Available Plans
      </h3>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.planName === plan.name && subscription?.status === "active";
          return (
            <div
              key={plan.name}
              style={{
                background: plan.color,
                borderRadius: 12,
                boxShadow: isCurrentPlan
                  ? "0 0 0 2px #924DAC, 0 2px 8px rgba(146,77,172,0.1)"
                  : "0 2px 8px rgba(146,77,172,0.04)",
                padding: 28,
                minWidth: 220,
                flex: "1 1 220px",
                position: "relative",
                // 🛠️ FIX 1: Ensure card is clickable
                zIndex: 2 
              }}
            >
              {isCurrentPlan && (
                <div style={{ position: "absolute", top: -10, right: 16, background: "#924DAC", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                  CURRENT
                </div>
              )}
              <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ color: "#444", marginBottom: 12 }}>{plan.duration}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 12 }}>₹{plan.price}</div>
              
              <ul style={{ fontSize: 14, color: "#666", marginBottom: 16, paddingLeft: 16 }}>
                {plan.benefits.map((b) => <li key={b} style={{ marginBottom: 4 }}>{b}</li>)}
              </ul>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // 1. Check Status
                  if (subscription?.status === "active") {
                    alert("You already have an active subscription.");
                    return;
                  }
                  if (subscription?.status === "pending") {
                    alert("Your subscription is pending approval.");
                    return;
                  }
                  
                  // 2. Build URL
                  const url = `/payment?plan=${encodeURIComponent(plan.name)}&amount=${plan.price}&duration=${encodeURIComponent(plan.duration)}`;
                  
                  // 3. Force Redirect (Works even if router fails)
                  window.location.assign(url);
                }}
                disabled={isCurrentPlan}
                style={{
                  fontSize: 14,
                  padding: "10px 20px",
                  background: isCurrentPlan ? "#ccc" : "#924DAC",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: isCurrentPlan ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  width: "100%",
                  // 🛠️ FIX 2: Raise button above everything in LayoutWrapper
                  position: "relative",
                  zIndex: 50,
                  // 🛠️ FIX 3: Ensure it captures the click
                  pointerEvents: "auto" 
                }}
              >
                {isCurrentPlan ? "Active Plan" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
