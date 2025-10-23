package com.pawtrack.PawTrack.report;

import com.pawtrack.PawTrack.report.dto.ReportRequest;
import com.pawtrack.PawTrack.report.dto.StatusUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow React frontend
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ✅ Create new report
    @PostMapping
    public ResponseEntity<Report> createReport(@Valid @RequestBody ReportRequest request) {
        System.out.println("▶️ Creating new report: " + request);
        Report savedReport = reportService.createReport(request);
        System.out.println("✅ Report created successfully with code: " + savedReport.getReportCode());
        return ResponseEntity.ok(savedReport);
    }

    // ✅ Get all reports
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        System.out.println("▶️ Fetching all reports");
        List<Report> reports = reportService.getAllReports();
        System.out.println("✅ Total reports fetched: " + reports.size());
        return ResponseEntity.ok(reports);
    }

    // ✅ Get report by ID
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        System.out.println("▶️ Fetching report by ID: " + id);
        Report report = reportService.getReportById(id);
        System.out.println("✅ Found report with code: " + report.getReportCode());
        return ResponseEntity.ok(report);
    }

    // ✅ Update ONLY status (used for "Mark as Treated")
    @PutMapping("/{id}/status")
    public ResponseEntity<Report> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        System.out.println("▶️ Updating status for report ID: " + id + " to: " + request.getStatus());
        Report updatedReport = reportService.updateStatus(id, request);
        System.out.println("✅ Status updated successfully to: " + updatedReport.getStatus());
        return ResponseEntity.ok(updatedReport);
    }

    // ✅ Get report by unique report code (for QR scan)
    @GetMapping("/code/{reportCode}")
    public ResponseEntity<Report> getReportByReportCode(@PathVariable String reportCode) {
        System.out.println("▶️ Received GET request for report code: " + reportCode);
        Report report = reportService.getReportByReportCode(reportCode);
        System.out.println("✅ Found report for QR code: " + reportCode);
        return ResponseEntity.ok(report);
    }
}
