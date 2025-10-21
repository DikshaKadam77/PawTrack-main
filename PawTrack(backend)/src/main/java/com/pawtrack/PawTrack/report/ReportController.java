package com.pawtrack.PawTrack.report;

import com.pawtrack.PawTrack.report.dto.ReportRequest;
import com.pawtrack.PawTrack.report.dto.StatusUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ✅ Create new report
    @PostMapping
    public ResponseEntity<Report> createReport(@Valid @RequestBody ReportRequest request) {
        Report report = reportService.createReport(request);
        return ResponseEntity.ok(report);
    }

    // ✅ Get all reports
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // ✅ Get report by ID
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    // ✅ Update ONLY status
    @PutMapping("/{id}/status")
    public ResponseEntity<Report> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return ResponseEntity.ok(reportService.updateStatus(id, request));
    }
}
