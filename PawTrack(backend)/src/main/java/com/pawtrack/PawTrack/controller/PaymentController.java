package com.pawtrack.PawTrack.controller;

import com.pawtrack.PawTrack.model.Donation;
import com.pawtrack.PawTrack.repo.DonationRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    private final DonationRepository donationRepository;

    public PaymentController(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    // ✅ Step 1: Create Razorpay order
    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject options = new JSONObject();
            int amountInPaise = paymentRequest.getAmount() * 100;
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "txn_" + System.currentTimeMillis());
            options.put("payment_capture", 1);

            Order order = razorpay.orders.create(options);
            return ResponseEntity.ok(order.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // ✅ Step 2: Save donation after successful payment
    @PostMapping("/save-donation")
    public ResponseEntity<String> saveDonation(@RequestBody Donation donation) {
        try {
            donationRepository.save(donation);
            return ResponseEntity.ok("{\"message\":\"Donation saved successfully!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\":\"Failed to save donation.\"}");
        }
    }

    // ✅ Inner class for order creation
    public static class PaymentRequest {
        private int amount;
        public int getAmount() { return amount; }
        public void setAmount(int amount) { this.amount = amount; }
    }
}
