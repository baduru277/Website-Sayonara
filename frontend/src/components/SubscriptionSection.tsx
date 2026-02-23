"use client";

import React, { useEffect, useState } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted to avoid hydration issues with router
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleSubscribe = (plan: typeof plans[0]) => {
    if (!isMounted) return;

    // 1. Validation Logic
    if (subscription?.status === "active") {
      alert("You already have an active subscription.");
      return;
    }
    if (subscription?.status === "pending") {
      alert("Your subscription is pending approval. Please contact support.");
      return;
    }

    // 2. Construct Query Parameters safely
    const params = new URLSearchParams({
      plan: plan.name,
      amount: plan.price.toString(),
      duration: plan.duration,
    });

    // 3. Perform Redirection
    console.log("Redirecting to payment with params:", params.toString());
    router.push(`/payment?${params.toString()}`);
  };

  const subDisplay = getSubscriptionDisplay();

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Plan Name</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{subDisplay.planName}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Status</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: subscription.status === "active" ? "#2d7a2d" : "#d46b08" }}>
                {subDisplay.status}
              </div>
            </div>
            {subscription.status === "active" && (
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>Expires On</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{subDisplay.expiryDate}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Plans Grid */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.planName === plan.name && subscription?.status === "active";
          
          return (
            <div
              key={plan.name}
              style={{
                background: plan.color,
                borderRadius: 12,
                padding: 28,
                flex: "1 1 250px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                border: isCurrentPlan ? "2px solid #924DAC" : "1px solid transparent",
              }}
            >
              {isCurrentPlan && (
                <div style={{ position: "absolute", top: 10, right: 10, background: "#924DAC", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>
                  CURRENT
                </div>
              )}
              <h3 style={{ color: "#924DAC", margin: "0 0 8px 0" }}>{plan.name}</h3>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>₹{plan.price}</div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>{plan.duration}</div>
              
              <ul style={{ paddingLeft: 20, fontSize: 13, color: "#444", flexGrow: 1 }}>
                {plan.benefits.map((b, i) => <li key={i} style={{ marginBottom: 4 }}>{b}</li>)}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isCurrentPlan}
                style={{
                  marginTop: 16,
                  padding: "12px",
                  backgroundColor: isCurrentPlan ? "#ccc" : "#924DAC",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: isCurrentPlan ? "not-allowed" : "pointer",
                  width: "100%"
                }}
              >
                {isCurrentPlan ? "Active Plan" : "Subscribe Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
