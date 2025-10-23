// src/pages/NGODashboard.js

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Filter,
  Copy,
  MapPin,
  Phone,
  Calendar,
  X,
  // UserCheck, // Removed UserCheck icon
  CheckCircle,
  PlayCircle, // Added icon for "Take Case"
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { updateReportStatus } from "../api/reportApi"; // Make sure this is imported correctly
import './NGODashboard.css'; // Ensure CSS is imported

const API_URL = "http://localhost:8080/api/reports"; // For initial fetch

const NGODashboard = () => {
  const { user } = useAuth();

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  // ------------------ STATE ------------------
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");

  // Removed state related to team assignment
  // const [rescueTeams, setRescueTeams] = useState([]); // Removed if not fetching real teams
  // const [isLoadingTeams, setIsLoadingTeams] = useState(true); // Removed if not fetching real teams

  // ------------------ HELPERS ------------------
  const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

  const parseLocation = (loc) => {
    if (!loc || typeof loc !== "string" || !loc.includes(",")) return null;
    const [latRaw, lngRaw] = loc.split(",");
    const lat = Number(String(latRaw).trim());
    const lng = Number(String(lngRaw).trim());
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  };

  // ------------------ FETCH REPORTS (BACKEND) ------------------
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("[NGO] Raw backend data:", data);

        const mapped = (Array.isArray(data) ? data : []).map((r) => {
          const urgency = r.urgencyLevel ?? "";
          const status = r.status ?? "";

          return {
            id: r.id, // Keep backend ID
            reportCode: r.reportCode,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
            animal: r.animalType,
            condition: r.animalCondition,
            urgency,
            status,
            description: r.description,
            location: r.location,
            reporter: r.reporterName,
            phone: r.phoneNumber,
            position: parseLocation(r.location),
            urgencyNorm: normalize(urgency),
            statusNorm: normalize(status),
          };
        });

        console.log("[NGO] Mapped cases:", mapped);
        setCases(mapped);
      } catch (err) {
        console.error("[NGO] Error fetching reports:", err);
        toast.error("Failed to load reports");
      }
    };

    fetchReports();
  }, []); // Empty dependency array means this runs once on mount


  // ------------------ FILTERS ------------------
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const statusOk = statusFilter === "all" || c.statusNorm === normalize(statusFilter);
      const urgencyOk = urgencyFilter === "all" || c.urgencyNorm === normalize(urgencyFilter);
      return statusOk && urgencyOk;
    });
  }, [cases, statusFilter, urgencyFilter]);

  // ------------------ STATS ------------------
  const stats = useMemo(() => {
    const count = (key) => filteredCases.filter((c) => c.statusNorm === key).length;
    return {
      total: filteredCases.length,
      pending: count("pending"),
      inProgress: count("in-progress"),
      treated: count("treated"),
    };
  }, [filteredCases]);

  // ------------------ ACTIONS ------------------
  const handleCopyQRLink = (idOrCode) => {
    const link = `${window.location.origin}/case/${idOrCode}`; // Adjust route if needed
    navigator.clipboard.writeText(link).then(
      () => toast.success("Case link copied!"),
      () => toast.error("Failed to copy.")
    );
  };

  const handleViewOnMap = (caseItem) => {
    if (!caseItem.position) {
      toast.error("No valid coordinates for this report.");
      return;
    }
    setSelectedLocation(caseItem.position);
    setSelectedLocationName(caseItem.location || "");
    setIsMapModalOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapModalOpen(false);
    setSelectedLocation(null);
    setSelectedLocationName("");
  };

  // Handler Function for Taking Case
  const handleTakeCase = async (caseItem) => {
    if (!caseItem || !caseItem.id || caseItem.statusNorm !== 'pending') return;

    const caseIdToUpdate = caseItem.id;
    const originalStatus = caseItem.status;
    const originalStatusNorm = caseItem.statusNorm;
    const reportCode = caseItem.reportCode || caseIdToUpdate;

    // Optimistic Update
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseIdToUpdate ? { ...c, status: "in-progress", statusNorm: "in-progress" } : c
      )
    );

    try {
        await updateReportStatus(caseIdToUpdate, 'in-progress'); // API call
        toast.success(`Case ${reportCode} is now in progress.`);
    } catch (error) {
        console.error("Error taking case (updating status):", error);
        toast.error(`Failed to update status for case ${reportCode}. Reverting.`);
        // Revert local state on error
        setCases((prev) =>
            prev.map((c) =>
                c.id === caseIdToUpdate ? { ...c, status: originalStatus, statusNorm: originalStatusNorm } : c
            )
        );
    }
  };

  // Handler Function for Marking as Treated
  const handleMarkTreated = async (caseItem) => {
    if (!caseItem || !caseItem.id) return;

    const caseIdToUpdate = caseItem.id;
    const originalStatus = caseItem.status;
    const originalStatusNorm = caseItem.statusNorm;
    const reportCode = caseItem.reportCode || caseIdToUpdate;

    // Optimistic Update
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseIdToUpdate ? { ...c, status: "treated", statusNorm: "treated" } : c
      )
    );

    try {
        await updateReportStatus(caseIdToUpdate, 'treated'); // API call
        toast.success(`Case ${reportCode} marked as treated.`);
    } catch (error) {
        console.error("Error marking case as treated:", error);
        toast.error(`Failed to mark case ${reportCode} as treated. Reverting.`);
        // Revert local state on error
        setCases((prev) =>
            prev.map((c) =>
                c.id === caseIdToUpdate ? { ...c, status: originalStatus, statusNorm: originalStatusNorm } : c
            )
        );
    }
  };

  const handleDownloadReport = () => {
    // Download logic
    if (filteredCases.length === 0) {
      toast.error("No data to download!");
      return;
    }
    const headers = ["Report Code", "Date", "Animal", "Condition", "Urgency", "Status", "Description", "Location", "Reporter", "Phone"];
    const escapeCSV = (str) => `"${String(str ?? "").replace(/"/g, '""')}"`;
    const rows = [headers.join(",")];
    filteredCases.forEach((c) => {
      rows.push([c.reportCode ?? c.id, c.date, c.animal, c.condition, c.urgency, c.status, c.description, c.location, c.reporter, c.phone].map(escapeCSV).join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.join("\n"));
    const a = document.createElement("a");
    a.href = csvContent;
    a.download = "paw_track_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Report downloaded!");
  };

  // ------------------ STYLE HELPERS ------------------
  const getUrgencyClass = (urgency) => { // Returns CSS class name
    const u = normalize(urgency);
    if (u === "critical") return "urgency-critical";
    if (u === "high") return "urgency-high";
    if (u === "medium") return "urgency-medium";
    if (u === "low") return "urgency-low";
    return "urgency-medium";
  };

  const getStatusClass = (status) => { // Returns CSS class name
    const s = normalize(status);
    if (s === "pending") return "status-pending";
    if (s === "in-progress") return "status-progress";
    if (s === "treated") return "status-treated";
    return "status-pending";
  };

  // Google Map options
  const mapContainerStyle = { height: "400px", width: "100%", borderRadius: "8px" };
  const mapOptions = { disableDefaultUI: true, zoomControl: true };

  // ------------------ RENDER ------------------
  return (
    <div className="ngo-dashboard">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div className="dashboard-title-section">
              <h1 className="dashboard-title">NGO Dashboard</h1>
              <p className="dashboard-subtitle">Manage and track animal rescue cases</p>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Cases</div>
              <div className="stat-number total">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-number pending">{stats.pending}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">In Progress</div>
              <div className="stat-number progress">{stats.inProgress}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Treated</div>
              <div className="stat-number treated">{stats.treated}</div>
            </div>
          </div>

          {/* Cases Container */}
          <div className="cases-container">
            {/* Toolbar */}
            <div className="cases-toolbar">
              <div className="toolbar-left">
                <h2 className="cases-title">Active Cases ({stats.total})</h2>
              </div>
              <div className="toolbar-right">
                <div className="filter-group">
                  <Filter className="filter-icon" />
                  <label className="filter-label">Status</label>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="treated">Treated</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Urgency</label>
                  <select
                    className="filter-select"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <button className="download-btn" onClick={handleDownloadReport}>
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Cases List */}
            <div className="cases-list">
              {filteredCases.length > 0 ? (
                filteredCases.map((c, i) => ( // Added index 'i' for fallback key
                  <div key={c.id ?? `case-${i}`} className="case-card animate-slide-up">
                    <div className="case-header">
                       <div className="case-id-section">
                        <span className={`case-status-indicator ${getStatusClass(c.status)}`}></span>
                        <span className="case-id">{c.reportCode ?? c.id ?? 'Unknown ID'}</span>
                        <span className={`urgency-badge ${getUrgencyClass(c.urgency)}`}>{c.urgency || '-'}</span>
                      </div>
                      <div className="case-date">
                        <Calendar className="w-4 h-4" />
                        <span>{c.date || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="case-content">
                      <h3 className="animal-title">{(c.condition || 'Unknown Condition')} {(c.animal || 'Unknown Animal')}</h3>
                      <p className="case-description">{c.description || 'No description provided.'}</p>
                      <div className="case-details">
                        <div className="detail-item">
                          <MapPin className="w-4 h-4" />
                          <span>{c.location || 'Location not provided.'}</span>
                        </div>
                        <div className="detail-item">
                          <Phone className="w-4 h-4" />
                          <span>{c.reporter || 'Unknown Reporter'} • {c.phone || 'No Phone'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="case-footer">
                      <button
                        onClick={() => handleCopyQRLink(c.reportCode ?? c.id)}
                        className="case-action-btn primary"
                        disabled={!(c.reportCode ?? c.id)}
                      >
                        <Copy className="w-4 h-4" /> Copy Link
                      </button>
                      <button
                        onClick={() => handleViewOnMap(c)}
                        disabled={!c.position}
                        className="case-action-btn primary"
                      >
                        <MapPin className="w-4 h-4" /> View Map
                      </button>
                      {/* Show "Take Case" only if status is 'pending' */}
                      {c.statusNorm === 'pending' && (
                        <button
                          onClick={() => handleTakeCase(c)}
                          className="case-action-btn primary"
                        >
                          <PlayCircle className="w-4 h-4" /> Take Case
                        </button>
                      )}
                      {/* Show "Mark as Treated" only if status is NOT 'treated' */}
                      {c.statusNorm !== 'treated' && (
                        <button
                          onClick={() => handleMarkTreated(c)}
                          className="case-action-btn primary"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark as Treated
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-cases-found">No cases found matching the current filters.</p>
              )}
            </div>
          </div>

          {/* Map Modal */}
          {isMapModalOpen && selectedLocation && (
             <div className="modal-overlay" onClick={handleCloseMap}>
               <div
                 className="modal-content modal-content-map"
                 onClick={(e) => e.stopPropagation()}
                 style={{ background: "#fff" }}
               >
                 <div className="modal-header">
                   <h3 className="modal-title">Case Location</h3>
                   <button onClick={handleCloseMap} className="modal-close-btn">
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 <div className="modal-body">
                   <p className="modal-location">
                     Showing map for: <strong>{selectedLocationName}</strong>
                   </p>
                   {!isLoaded ? (
                     <div className="map-placeholder">Loading Map...</div>
                   ) : (
                     <GoogleMap
                       mapContainerStyle={mapContainerStyle}
                       center={selectedLocation}
                       zoom={15}
                       options={mapOptions}
                     >
                       <Marker position={selectedLocation} />
                     </GoogleMap>
                   )}
                 </div>
               </div>
             </div>
           )}

          {/* Assign Team Modal Removed */}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NGODashboard;
