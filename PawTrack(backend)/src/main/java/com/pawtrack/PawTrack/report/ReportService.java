package com.pawtrack.PawTrack.report;

import com.pawtrack.PawTrack.report.dto.ReportRequest;
import com.pawtrack.PawTrack.report.dto.StatusUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    // ✅ Create a new report
    public Report createReport(ReportRequest request) {
        Report report = Report.builder()
                .location(request.getLocation())
                .animalType(request.getAnimalType())
                .animalCondition(request.getAnimalCondition())
                .urgencyLevel(request.getUrgencyLevel())
                .description(request.getDescription())
                .photoUrl(request.getPhotoUrl())
                .reporterName(request.getReporterName())
                .phoneNumber(request.getPhoneNumber())
                .status("pending")
                .build();

        return reportRepository.save(report);
    }

    // ✅ Get all reports
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // ✅ Get report by ID
    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + id));
    }

    // ✅ Update ONLY status
    public Report updateStatus(Long id, StatusUpdateRequest request) {
        Report report = getReportById(id);
        report.setStatus(request.getStatus());
        return reportRepository.save(report);
    }

    // 🆕 ✅ Get report by unique report code (for QR search)
    public Report getReportByReportCode(String reportCode) {
        System.out.println("🔍 Looking for reportCode: " + reportCode);
        return reportRepository.findByReportCode(reportCode)
                .map(r -> {
                    System.out.println("✅ FOUND REPORT: " + r.getReportCode());
                    return r;
                })
                .orElseThrow(() -> {
                    System.out.println("❌ REPORT NOT FOUND in DB");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "No report found with code: " + reportCode);
                });
    }
}
