"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from '@/services/api';
import LocationMap from '@/components/LocationMap';
import LocationDisplay from '@/components/LocationDisplay';

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "my-post-items", label: "My Post Items" },
  { key: "location", label: "📍 Location" },
  { key: "order-history", label: "Order History" },
  { key: "notification", label: "Notification" },
  { key: "subscription", label: "Subscription" },
  { key: "setting", label: "Setting" },
  { key: "logout", label: "Log-out" },
];

export default function DashboardPage() {
  const [selected, setSelected] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const user = await apiService.getCurrentUser();
        console.log('User profile received:', user);
        setUserProfile(user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // If token is invalid, redirect to login
        if (error.message.includes('Invalid token') || error.message.includes('401')) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Helper functions
  const getUserDisplayName = () => {
    console.log('getUserDisplayName called with userProfile:', userProfile);
    if (!userProfile) return 'User';
    
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    } else if (userProfile.name) {
      return userProfile.name;
    } else if (userProfile.firstName) {
      return userProfile.firstName;
    } else if (userProfile.email) {
      return userProfile.email.split('@')[0];
    }
    
    return 'User';
  };

  const getUserInitials = () => {
    if (!userProfile) return 'U';
    
    const displayName = getUserDisplayName();
    return displayName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    apiService.removeAuthToken();
    router.push("/");
    window.location.reload();
  };

  // Sidebar
  const Sidebar = () => (
    <nav style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
      padding: 0,
      minWidth: 180,
      marginRight: 32,
      marginTop: 24,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      {sidebarItems.map((item) => (
        <button
          key={item.key}
          onClick={() => {
            if (item.key === "logout") handleLogout();
            else setSelected(item.key);
          }}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "16px 24px",
            background: selected === item.key ? "#f3eaff" : "#fff",
            color: selected === item.key ? "#924DAC" : "#444",
            fontWeight: selected === item.key ? 700 : 500,
            border: "none",
            borderLeft: selected === item.key ? "4px solid #924DAC" : "4px solid transparent",
            fontSize: 16,
            cursor: "pointer",
            outline: "none",
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  // Main content for each section
  const renderContent = () => {
    switch (selected) {
             case "dashboard":
         return (
           <div style={{ padding: 32 }}>
             <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome to your Dashboard!</h2>
             <p style={{ color: "#444", marginTop: 12 }}>Here you can manage your orders, notifications, subscriptions, and settings.</p>
             
             {/* Motivational Section */}
             <div style={{ 
               background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)", 
               borderRadius: 16, 
               padding: 32, 
               marginTop: 32,
               border: "2px solid #e0e7ff"
             }}>
               <div style={{ textAlign: "center", marginBottom: 24 }}>
                 <span style={{ fontSize: 48, marginBottom: 16, display: "block" }}>🌟</span>
                 <h3 style={{ color: "#924DAC", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                   Ready to Share Your Treasures?
                 </h3>
                 <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                   "One person's unused item is another person's treasure. Start your journey of giving items a second life!"
                 </p>
               </div>
               
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                 <div style={{ 
                   background: "white", 
                   padding: 20, 
                   borderRadius: 12, 
                   textAlign: "center",
                   boxShadow: "0 4px 12px rgba(146,77,172,0.1)"
                 }}>
                   <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>📦</span>
                   <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>Declutter & Earn</h4>
                   <p style={{ color: "#666", fontSize: 14 }}>Turn your unused items into cash while helping others find what they need</p>
                 </div>
                 
                 <div style={{ 
                   background: "white", 
                   padding: 20, 
                   borderRadius: 12, 
                   textAlign: "center",
                   boxShadow: "0 4px 12px rgba(146,77,172,0.1)"
                 }}>
                   <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>🤝</span>
                   <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>Build Community</h4>
                   <p style={{ color: "#666", fontSize: 14 }}>Connect with like-minded people who value sustainability and smart shopping</p>
                 </div>
                 
                 <div style={{ 
                   background: "white", 
                   padding: 20, 
                   borderRadius: 12, 
                   textAlign: "center",
                   boxShadow: "0 4px 12px rgba(146,77,172,0.1)"
                 }}>
                   <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>🌱</span>
                   <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>Go Green</h4>
                   <p style={{ color: "#666", fontSize: 14 }}>Reduce waste and contribute to a more sustainable future for everyone</p>
                 </div>
               </div>
               
                               <div style={{ textAlign: "center" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: 12,
                    marginBottom: 16
                  }}>
                    <span style={{ fontSize: 20, color: "#924DAC" }}>Click the</span>
                    <span style={{ fontSize: 24, color: "#924DAC", fontWeight: "bold" }}>↑</span>
                    <span style={{ fontSize: 20, color: "#924DAC" }}>Post button to upload your first item!</span>
                  </div>
                 
                 <p style={{ color: "#888", fontSize: 14, fontStyle: "italic" }}>
                   "The best time to start was yesterday. The second best time is now!"
                 </p>
               </div>
             </div>
             
             {/* Quick Stats */}
             <div style={{ 
               display: "grid", 
               gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
               gap: 20, 
               marginTop: 32 
             }}>
               <div style={{ 
                 background: "white", 
                 padding: 24, 
                 borderRadius: 12, 
                 textAlign: "center",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
               }}>
                 <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                 <div style={{ color: "#666", fontSize: 14 }}>Items Posted</div>
               </div>
               
               <div style={{ 
                 background: "white", 
                 padding: 24, 
                 borderRadius: 12, 
                 textAlign: "center",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
               }}>
                 <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                 <div style={{ color: "#666", fontSize: 14 }}>Total Views</div>
               </div>
               
               <div style={{ 
                 background: "white", 
                 padding: 24, 
                 borderRadius: 12, 
                 textAlign: "center",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
               }}>
                 <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                 <div style={{ color: "#666", fontSize: 14 }}>Total Likes</div>
               </div>
               
               <div style={{ 
                 background: "white", 
                 padding: 24, 
                 borderRadius: 12, 
                 textAlign: "center",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
               }}>
                 <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                 <div style={{ color: "#666", fontSize: 14 }}>Successful Trades</div>
               </div>
             </div>
           </div>
                  );
       case "location":
         return (
           <div style={{ padding: 32 }}>
             <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>📍 Location Settings</h2>
             <p style={{ color: "#444", marginBottom: 24 }}>Set your location to help buyers find items near you</p>
             
             <div style={{ 
               background: "white", 
               borderRadius: 12, 
               padding: 24, 
               boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
               marginBottom: 24
             }}>
               <h3 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 16 }}>Select Your Location</h3>
               <LocationMap 
                 onLocationSelect={setSelectedLocation}
                 height="400px"
               />
             </div>
             
             {selectedLocation && (
               <div style={{ 
                 background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)", 
                 borderRadius: 12, 
                 padding: 20,
                 border: "2px solid #e0e7ff"
               }}>
                 <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 12 }}>📍 Selected Location</h4>
                 <div style={{ color: "#666", marginBottom: 8 }}>
                   <strong>Address:</strong> {selectedLocation.address}
                 </div>
                 <div style={{ color: "#666", marginBottom: 8 }}>
                   <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                 </div>
                 <button 
                   className="sayonara-btn" 
                   style={{ 
                     fontSize: 14, 
                     padding: "8px 16px",
                     marginTop: 8
                   }}
                   onClick={() => {
                     // Here you would typically save the location to your backend
                     console.log('Saving location:', selectedLocation);
                     alert('Location saved successfully!');
                   }}
                 >
                   💾 Save Location
                 </button>
               </div>
             )}
             
             <div style={{ 
               background: "#fff7e6", 
               borderRadius: 8, 
               padding: 16, 
               marginTop: 24,
               border: "1px solid #ffeaa7"
             }}>
               <div style={{ color: "#b26a00", fontWeight: 600, marginBottom: 8 }}>💡 Location Tips</div>
               <ul style={{ color: "#b26a00", fontSize: 14, margin: 0, paddingLeft: 20 }}>
                 <li>Setting your location helps buyers find items near you</li>
                 <li>You can update your location anytime</li>
                 <li>Your exact address is never shared publicly</li>
                 <li>Only your city/area is shown to other users</li>
               </ul>
             </div>
           </div>
         );
       case "my-post-items":
         return (
           <div style={{ padding: 32 }}>
             <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>My Post Items</h2>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
               <p style={{ color: "#444" }}>Manage your posted items and track their performance</p>
               <div style={{ 
                 display: "flex", 
                 alignItems: "center", 
                 gap: 8,
                 color: "#924DAC",
                 fontSize: 14
               }}>
                 <span>Click the</span>
                 <span style={{ fontSize: 18, fontWeight: "bold" }}>↑</span>
                 <span>Post button to add new items</span>
               </div>
             </div>
            <table style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#f3eaff", color: "#924DAC" }}>
                  <th style={{ padding: 12 }}>ITEM</th>
                  <th style={{ padding: 12 }}>STATUS</th>
                  <th style={{ padding: 12 }}>VIEWS</th>
                  <th style={{ padding: 12 }}>LIKES</th>
                  <th style={{ padding: 12 }}>POSTED DATE</th>
                  <th style={{ padding: 12 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, title: "iPhone 13 Pro", status: "Active", views: 127, likes: 23, date: "Dec 28, 2024" },
                  { id: 2, title: "Nike Air Jordan 1", status: "Pending", views: 89, likes: 15, date: "Dec 25, 2024" },
                  { id: 3, title: "MacBook Air M1", status: "Sold", views: 156, likes: 31, date: "Dec 20, 2024" },
                  { id: 4, title: "Sony WH-1000XM4", status: "Active", views: 78, likes: 12, date: "Dec 18, 2024" },
                  { id: 5, title: "Gaming Chair", status: "Active", views: 45, likes: 8, date: "Dec 15, 2024" }
                ].map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12, fontWeight: 500 }}>{item.title}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: item.status === "Active" ? "#27ae60" : item.status === "Pending" ? "#f39c12" : "#e74c3c",
                        backgroundColor: item.status === "Active" ? "#d4edda" : item.status === "Pending" ? "#fff3cd" : "#f8d7da"
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, color: "#666" }}>{item.views}</td>
                    <td style={{ padding: 12, color: "#666" }}>{item.likes}</td>
                    <td style={{ padding: 12, color: "#666" }}>{item.date}</td>
                                         <td style={{ padding: 12 }}>
                       <div style={{ display: 'flex', gap: 8 }}>
                         <button className="sayonara-btn" style={{ fontSize: 12, padding: "4px 8px" }}>Edit</button>
                         <button className="sayonara-btn" style={{ fontSize: 12, padding: "4px 8px" }}>Delete</button>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order History</h2>
            <table style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#f3eaff", color: "#924DAC" }}>
                  <th style={{ padding: 12 }}>ORDER ID</th>
                  <th style={{ padding: 12 }}>STATUS</th>
                  <th style={{ padding: 12 }}>DATE</th>
                  <th style={{ padding: 12 }}>TOTAL</th>
                  <th style={{ padding: 12 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>#9654{i}761</td>
                    <td style={{ padding: 12, color: i%3===0 ? "#e74c3c" : i%2===0 ? "#27ae60" : "#f39c12" }}>
                      {i%3===0 ? "CANCELED" : i%2===0 ? "COMPLETED" : "IN PROGRESS"}
                    </td>
                    <td style={{ padding: 12 }}>Dec 30, 2024 07:52</td>
                    <td style={{ padding: 12 }}>₹{i*80} ({i+4} Products)</td>
                    <td style={{ padding: 12 }}><button className="sayonara-btn" style={{ fontSize: 14, padding: "6px 18px" }}>View Details →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notification</h2>
            {[1,2,3].map((i) => (
              <div key={i} style={{ background: "#fff7e6", borderRadius: 8, padding: 18, marginBottom: 14, color: "#b26a00", fontWeight: 500 }}>
                <span style={{ marginRight: 8 }}>🔔</span> New listing submitted by [User Name] – MacBook Pro 2020. Awaiting review.
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Requested 30 minutes ago</div>
              </div>
            ))}
          </div>
        );
      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Set Subscription Plans</h2>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { name: "Basic Plan", price: 99, desc: "Basic features for casual users.", color: "#f3eaff" },
                { name: "Standard Plan", price: 299, desc: "Standard features for regular users.", color: "#eafff3" },
                { name: "Premium Plan", price: 499, desc: "All features for power users.", color: "#fff3ea" },
              ].map((plan) => (
                <div key={plan.name} style={{ background: plan.color, borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, minWidth: 220 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{plan.desc}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>₹{plan.price}</div>
                  <div style={{ color: "#888", fontSize: 14 }}>per month</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Setting</h2>
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, minWidth: 320 }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: "#444" }}>Language</div>
                <select style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #eee", marginTop: 6 }}>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: "#444" }}>Message Notification</div>
                <input type="checkbox" checked readOnly style={{ marginLeft: 8 }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#444" }}>Email Notifications</div>
                <input type="checkbox" checked readOnly style={{ marginLeft: 8 }} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
             {/* Header */}
       <div style={{ background: "#924DAC", padding: "24px 0 16px 0", color: "#fff" }}>
         <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32, marginRight: 8 }}>🌟</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>Welcome back!</div>
                <div style={{ fontSize: 14, color: "#e0e7ff", marginTop: 2 }}>Ready to discover amazing deals?</div>
                <div style={{ marginTop: 8 }}>
                  <LocationDisplay showUpdateButton={false} />
                </div>
              </div>
            </div>
                       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 600 }}>{loading ? 'Loading...' : getUserDisplayName()}</div>
              <div style={{ fontSize: 13, color: "#eee" }}>{loading ? 'loading@email.com' : userProfile?.email || 'user@example.com'}</div>
              <div style={{ width: 36, height: 36, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#924DAC", fontWeight: 700, fontSize: 18 }}>{loading ? 'L' : getUserInitials()}</div>
            </div>
         </div>
       </div>
      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, marginTop: 24, marginBottom: 24 }}>{renderContent()}</div>
      </div>
    </div>
  );
} 