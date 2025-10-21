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
  UserCheck,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const API_URL = "http://localhost:8080/api/reports";

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

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCaseToAssign, setSelectedCaseToAssign] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");

  const [rescueTeams, setRescueTeams] = useState([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

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
            id: r.id,
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
  }, []);

  // ------------------ TEAMS (MOCKED) ------------------
  useEffect(() => {
    if (user && user.ngo_id) {
      setIsLoadingTeams(true);
      setTimeout(() => {
        let teamsForThisNGO = [];
        if (user.ngo_id === "ngo_12345") {
          teamsForThisNGO = [
            { id: "team_a", name: "Alpha Rescuers - Unit 1" },
            { id: "team_b", name: "Alpha Rescuers - Unit 2" },
          ];
        } else if (user.ngo_id === "ngo_67890") {
          teamsForThisNGO = [
            { id: "team_c", name: "Karjat Animal Helpers" },
            { id: "team_d", name: "Navi Mumbai Vets" },
          ];
        } else {
          teamsForThisNGO = [{ id: "default_team", name: "Default Rescue Team" }];
        }
        setRescueTeams(teamsForThisNGO);
        if (teamsForThisNGO.length > 0) setSelectedTeam(teamsForThisNGO[0].id);
        setIsLoadingTeams(false);
      }, 400);
    } else {
      setIsLoadingTeams(false);
      setRescueTeams([]);
    }
  }, [user]);

  // ------------------ FILTERS ------------------
  const filteredCases = useMemo(() => {
    const out = cases.filter((c) => {
      const statusOk = statusFilter === "all" || c.statusNorm === normalize(statusFilter);
      const urgencyOk = urgencyFilter === "all" || c.urgencyNorm === normalize(urgencyFilter);
      return statusOk && urgencyOk;
    });
    console.log("[NGO] filteredCases length:", out.length);
    return out;
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
    const link = `${window.location.origin}/case/${idOrCode}`;
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

  const handleOpenAssignModal = (caseItem) => {
    setSelectedCaseToAssign(caseItem);
    setIsAssignModalOpen(true);
    if (rescueTeams.length > 0) setSelectedTeam(rescueTeams[0].id);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedCaseToAssign(null);
  };

  const handleAssignTeam = (e) => {
    e.preventDefault();
    if (!selectedTeam || !selectedCaseToAssign) return;

    const teamName = rescueTeams.find((t) => t.id === selectedTeam)?.name || "Selected Team";
    toast.success(`Team "${teamName}" assigned to case ${selectedCaseToAssign.reportCode || selectedCaseToAssign.id}`);

    // Optimistic local update
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseToAssign.id ? { ...c, status: "in-progress", statusNorm: "in-progress" } : c
      )
    );

    handleCloseAssignModal();
  };

  const handleDownloadReport = () => {
    if (filteredCases.length === 0) {
      toast.error("No data to download!");
      return;
    }

    const headers = [
      "Report Code",
      "Date",
      "Animal",
      "Condition",
      "Urgency",
      "Status",
      "Description",
      "Location",
      "Reporter",
      "Phone",
    ];
    const escapeCSV = (str) => `"${String(str ?? "").replace(/"/g, '""')}"`;
    const rows = [headers.join(",")];

    filteredCases.forEach((c) => {
      rows.push(
        [
          c.reportCode ?? c.id,
          c.date,
          c.animal,
          c.condition,
          c.urgency,
          c.status,
          c.description,
          c.location,
          c.reporter,
          c.phone,
        ]
          .map(escapeCSV)
          .join(",")
      );
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
  const getUrgencyColor = (urgency) => {
    const u = normalize(urgency);
    if (u === "critical") return "urgency-critical";
    if (u === "high") return "urgency-high";
    if (u === "medium") return "urgency-medium";
    if (u === "low") return "urgency-low";
    return "urgency-medium";
  };

  const getStatusColor = (status) => {
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

            {/* Cases List — FORCED VISIBLE + DEBUG */}
            <div
              className="cases-list"
              style={{
                padding: 16,
                background: "rgba(0,0,0,0.02)",
                borderRadius: 8,
                minHeight: 120,
              }}
            >
              <div style={{ marginBottom: 12, fontWeight: 600 }}>
                DEBUG: filteredCases.length = {filteredCases.length}
              </div>

              {filteredCases.length > 0 ? (
                <>
                  {filteredCases.map((c, i) => (
                    <div
                      key={c.id ?? i}
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e2e2",
                        borderRadius: 10,
                        padding: 16,
                        marginBottom: 12,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      {/* Minimal visible card to avoid any CSS conflicts */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background:
                                normalize(c.status) === "pending"
                                  ? "#f39c12"
                                  : normalize(c.status) === "in-progress"
                                  ? "#3498db"
                                  : "#2ecc71",
                            }}
                          />
                          <strong>{c.reportCode ?? c.id}</strong>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 999,
                              fontSize: 12,
                              border: "1px solid #ddd",
                              background:
                                normalize(c.urgency) === "high"
                                  ? "#fdecea"
                                  : normalize(c.urgency) === "medium"
                                  ? "#fff8e5"
                                  : "#eef8ff",
                            }}
                          >
                            {c.urgency || "-"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", opacity: 0.8 }}>
                          <Calendar size={16} />
                          <span>{c.date}</span>
                        </div>
                      </div>

                      <div style={{ fontWeight: 600, marginBottom: 6 }}>
                        {c.condition} {c.animal}
                      </div>
                      <div style={{ marginBottom: 6 }}>{c.description}</div>

                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <MapPin size={16} />
                          <span>{c.location}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <Phone size={16} />
                          <span>
                            {c.reporter} • {c.phone}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={() => handleCopyQRLink(c.reportCode ?? c.id)}>Copy Link</button>
                        <button onClick={() => handleViewOnMap(c)}>View on Map</button>
                        <button onClick={() => handleOpenAssignModal(c)}>Assign Team</button>
                      </div>
                    </div>
                  ))}

                  {/* Show raw JSON so we know exactly what's in state */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>DEBUG: filteredCases JSON</div>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: 12,
                        background: "#f7f7f7",
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid #eee",
                        maxHeight: 260,
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(filteredCases, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                <p>No cases found.</p>
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

          {/* Assign Team Modal */}
          {isAssignModalOpen && selectedCaseToAssign && (
            <div className="modal-overlay" onClick={handleCloseAssignModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "#fff" }}>
                <form onSubmit={handleAssignTeam}>
                  <div className="modal-header">
                    <h3 className="modal-title">Assign Team to Case</h3>
                    <button
                      type="button"
                      onClick={handleCloseAssignModal}
                      className="modal-close-btn"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="modal-body">
                    <p className="modal-location">
                      Case ID: <strong>{selectedCaseToAssign.reportCode ?? selectedCaseToAssign.id}</strong>
                    </p>
                    <div className="modal-form-group">
                      <label htmlFor="teamSelect" className="modal-label">
                        Select a Rescue Team:
                      </label>
                      <select
                        id="teamSelect"
                        className="modal-select"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        disabled={isLoadingTeams}
                        required
                      >
                        {isLoadingTeams ? (
                          <option value="" disabled>
                            Loading teams...
                          </option>
                        ) : rescueTeams.length > 0 ? (
                          rescueTeams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No teams found.
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="modal-btn" onClick={handleCloseAssignModal}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="modal-btn primary"
                      disabled={isLoadingTeams || rescueTeams.length === 0}
                    >
                      <UserCheck className="w-4 h-4" />
                      Assign Team
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NGODashboard;
