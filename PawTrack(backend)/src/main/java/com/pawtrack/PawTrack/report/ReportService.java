package com.pawtrack.PawTrack.report;

import com.pawtrack.PawTrack.report.dto.ReportRequest;
import com.pawtrack.PawTrack.report.dto.StatusUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
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

    // ✅ Get a single report by ID
    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    // ✅ Update only status
    public Report updateStatus(Long id, StatusUpdateRequest request) {
        Report report = getReportById(id);
        report.setStatus(request.getStatus());
        return reportRepository.save(report);
    }
}
