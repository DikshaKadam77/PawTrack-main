
import { useState, useMemo, useEffect, useRef } from "react";
import { Heart, DollarSign, Zap, Star, ShieldCheck, FileText, Users, Target, Activity, IndianRupeeIcon, Loader2 } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import PaymentSuccess from "../Components/PaymentSuccess";
import { BASE_URL } from "../api/config";
import { toast } from "react-hot-toast";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const DonatePage = () => {
  const [donationType, setDonationType] = useState("one-time");
  const [activeSelection, setActiveSelection] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle', 'processing', 'success', 'error'
  const statsRef = useRef(null);

  const donationAmounts = [
    { amount: 250, icon: Heart, description: "Feeds 5 animals" },
    { amount: 500, icon: IndianRupeeIcon, description: "Medical checkup" },
    { amount: 1000, icon: Zap, description: "Emergency treatment" },
    { amount: 2500, icon: ShieldCheck, description: "Sponsor a rescue" },
  ];

  // ✅ Dynamic impact message
  const impactText = useMemo(() => {
    if (activeSelection === "custom") {
      const amount = Number(customAmount) || 0;
      if (amount > 0)
        return `₹${amount} will directly support rescue and treatment operations.`;
      return "Your custom donation makes a huge difference.";
    }
    const selected = donationAmounts.find((d) => d.amount === activeSelection);
    return selected
      ? `₹${selected.amount} allows us to provide a ${selected.description.toLowerCase()}.`
      : "Select an amount to see your impact.";
  }, [activeSelection, customAmount, donationAmounts]);

  const displayAmount = useMemo(() => {
    const amount = activeSelection === 'custom' ? (Number(customAmount) || 0) : activeSelection;
    return Math.round(amount); // Ensure it's an integer
  }, [activeSelection, customAmount]);

  useEffect(() => { /* ... counter animation logic ... */ });

  const handlePayment = async () => {
    if (displayAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    setPaymentStatus("processing");

    const sdkLoaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setPaymentStatus("idle");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: displayAmount }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create order");
      }

      const order = await response.json();
      console.log("✅ Razorpay order created:", order);

    // ✅ Step 2: Open Razorpay Checkout
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // ✅ !! REPLACE THIS with your Razorpay Key ID !!
      amount: order.amount_due, // Amount in paise (comes from backend)
      currency: "INR",
      name: "Paw Track Foundation",
      description: "Donation for Animal Welfare in Karjat",
      image: "/logo.png", //
      order_id: order.id, // ✅ Use the REAL order_id from your backend
      handler: function (response) {
        console.log("Payment Successful", response);
        // You should ideally verify this payment on your backend here
        setPaymentStatus("success");
      },
      prefill: { name: "Valued Supporter", email: "supporter@example.com", contact: "9999999999" },
      theme: { color: "#7c3aed" }, // Match your primary color
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      console.error("Payment Failed", response.error);
      toast.error(`Payment Failed: ${response.error.description}`);
      setPaymentStatus("idle");
    });
    paymentObject.open();
  };

  if (paymentStatus === "success") {
    return (
      <div className="bg-background">
        <Header />
        <main className="donate-page-section">
          <PaymentSuccess />
        </main>
        <Footer />
      </div>
    );
  }

  // ✅ Main Donation UI
  return (
    <div className="bg-background">
      <Header />
      <main>
        <section className="donate-page-section">
          <div className="container">
            {/* ---------- HERO SECTION ---------- */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-sm font-bold text-primary uppercase mb-2">
                  Make A Difference Today
                </h3>
                <h1 className="text-5xl font-bold text-foreground leading-tight mb-4 gradient-headline">
                  Every Donation Saves Lives
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Your contribution creates a ripple of kindness, funding rescue operations in Karjat and ensuring every animal gets the care they need.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary" /> 100% Secure
                    Donations
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <FileText className="w-5 h-5 text-primary" /> Tax Deductible
                  </div>
                </div>
              </div>
              {/* ... (right side ripple) ... */}
              <div className="ripple-container">
                <div className="central-ripple-icon">
                  <Heart fill="currentColor" className="w-8 h-8" />
                </div>
                <div className="ripple ripple-1"></div>
                <div className="ripple ripple-2"></div>
                <div className="ripple ripple-3"></div>
              </div>
            </div>

            {/* ---------- DONATION CARD ---------- */}
            <div className="donation-card">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground">Choose Your Impact</h2>
                <p className="text-muted-foreground">Select an amount to see the direct impact on animal lives.</p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="donation-type-toggle">
                  <button
                    className={`donation-type-btn ${
                      donationType === "one-time" ? "active" : ""
                    }`}
                    onClick={() => setDonationType("one-time")}
                  >
                    One-Time
                  </button>
                  <button
                    className={`donation-type-btn ${
                      donationType === "monthly" ? "active" : ""
                    }`}
                    onClick={() => setDonationType("monthly")}
                  >
                    Monthly
                  </button>
                </div>

                <h3 className="font-semibold mt-6 mb-2">Donation Amount</h3>

                <div className="amount-grid">
                  {donationAmounts.map(({ amount, icon: Icon, description }) => (
                    <button
                      key={amount}
                      onClick={() => setActiveSelection(amount)}
                      className={`amount-option ${
                        activeSelection === amount ? "active" : ""
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span className="amount-value">₹{amount}</span>
                      <span className="amount-desc">{description}</span>
                    </button>
                  ))}

                  <button
                    onClick={() => setActiveSelection("custom")}
                    className={`amount-option custom-option ${
                      activeSelection === "custom" ? "active" : ""
                    }`}
                  >
                    <Star className="w-6 h-6 mb-1" />
                    <span className="amount-value">Custom</span>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="custom-amount-input"
                      value={customAmount}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </button>
                </div>

                {/* ---------- IMPACT BOX ---------- */}
                <div className="impact-box">
                  <h4 className="font-semibold">Your Impact</h4>
                  <p key={impactText} className="impact-text-animate">
                    {impactText}
                  </p>
                </div>

                {/* ---------- DONATE BUTTON ---------- */}
                <button
                  className="donate-now-btn"
                  onClick={handlePayment}
                  disabled={paymentStatus === "processing"}
                >
                  {paymentStatus === "processing" ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Heart className="w-5 h-5 mr-2" />
                  )}
                  {paymentStatus === "processing"
                    ? "Processing..."
                    : `Donate ₹${displayAmount} Now`}
                </button>

                <p className="text-center text-xs text-muted-foreground mt-2">
                  Payments are securely processed by Razorpay.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DonatePage;
