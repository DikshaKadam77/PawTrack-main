package com.pawtrack.PawTrack.controller;

import com.pawtrack.PawTrack.model.Donation;
import com.pawtrack.PawTrack.repo.DonationRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Handles all donation and Razorpay-related operations.
 */
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

    /**
     * ✅ Step 1: Create a Razorpay order for the given donation amount.
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            // Validate incoming amount
            if (paymentRequest.getAmount() <= 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Invalid amount provided"));
            }

            // Initialize Razorpay client with test/live keys
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Prepare order options
            JSONObject options = new JSONObject();
            int amountInPaise = paymentRequest.getAmount() * 100; // Convert ₹ to paise
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "txn_" + System.currentTimeMillis());
            options.put("payment_capture", 1);

            // Create order
            Order order = razorpay.orders.create(options);

            // Return JSON response (order details)
            return ResponseEntity.ok(order.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error creating Razorpay order: " + e.getMessage()));
        }
    }

    /**
     * ✅ Step 2: Save donation details after successful payment.
     */
    @PostMapping("/save-donation")
    public ResponseEntity<?> saveDonation(@RequestBody Donation donation) {
        try {
            Donation saved = donationRepository.save(donation);
            return ResponseEntity.ok(new ApiResponse(
                    "Donation saved successfully with ID: " + saved.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to save donation: " + e.getMessage()));
        }
    }

    // ✅ Inner class for payment order creation request
    public static class PaymentRequest {
        private int amount;

        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }
    }

    // ✅ Standard response wrapper
    public static class ApiResponse {
        private String message;

        public ApiResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
