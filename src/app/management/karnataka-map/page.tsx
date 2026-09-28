"use client";

import React, { useState, useMemo } from "react";
import { ManagementService } from "@/services/management.service";
import { DistrictStatistics } from "@/types";
import {
  MapPin,
  Building2,
  Users,
  Award,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Layers,
  ChevronRight,
  Sparkles,
  PieChart as PieIcon,
  Search,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

// Geographic grid positions for Karnataka 31 districts representation
interface DistrictGeoNode {
  id: string;
  name: string;
  col: number; // 1 to 6
  row: number; // 1 to 10
  zone: string;
}

const KARNATAKA_GEO_GRID: DistrictGeoNode[] = [
  // North Zone (Row 1-3)
  { id: "dist-bdr", name: "Bidar", col: 4, row: 1, zone: "North" },
  { id: "dist-klb", name: "Kalaburagi", col: 4, row: 2, zone: "North" },
  { id: "dist-vjp", name: "Vijayapura", col: 2, row: 2, zone: "North" },
  { id: "dist-bgm", name: "Belagavi", col: 1, row: 3, zone: "North" },
  { id: "dist-bgk", name: "Bagalkote", col: 2, row: 3, zone: "North" },
  { id: "dist-rcr", name: "Raichur", col: 4, row: 3, zone: "North" },
  { id: "dist-ydg", name: "Yadgir", col: 5, row: 3, zone: "North" },

  // Central & Coastal North (Row 4-5)
  { id: "dist-uk", name: "Uttara Kannada", col: 1, row: 4, zone: "Coastal" },
  { id: "dist-dwd", name: "Dharwad", col: 2, row: 4, zone: "North" },
  { id: "dist-gdg", name: "Gadag", col: 3, row: 4, zone: "North" },
  { id: "dist-kpl", name: "Koppal", col: 4, row: 4, zone: "North" },
  { id: "dist-blr", name: "Ballari", col: 5, row: 4, zone: "North" },
  { id: "dist-hvr", name: "Haveri", col: 2, row: 5, zone: "Central" },
  { id: "dist-vjr", name: "Vijayanagara", col: 4, row: 5, zone: "North" },

  // Central Zone (Row 6)
  { id: "dist-udp", name: "Udupi", col: 1, row: 6, zone: "Coastal" },
  { id: "dist-smg", name: "Shivamogga", col: 2, row: 6, zone: "Central" },
  { id: "dist-dvg", name: "Davanagere", col: 3, row: 6, zone: "Central" },
  { id: "dist-cta", name: "Chitradurga", col: 4, row: 6, zone: "Central" },

  // South & Bengaluru Metro (Row 7-8)
  { id: "dist-dk", name: "Dakshina Kannada", col: 1, row: 7, zone: "Coastal" },
  { id: "dist-ckm", name: "Chikkamagaluru", col: 2, row: 7, zone: "Central" },
  { id: "dist-tmk", name: "Tumakuru", col: 3, row: 7, zone: "South" },
  { id: "dist-cbp", name: "Chikkaballapura", col: 4, row: 7, zone: "Bengaluru Metro" },
  { id: "dist-klr", name: "Kolar", col: 5, row: 7, zone: "South" },

  // South Core (Row 8-9)
  { id: "dist-hsn", name: "Hassan", col: 2, row: 8, zone: "South" },
  { id: "dist-blr-r", name: "Bengaluru Rural", col: 4, row: 8, zone: "Bengaluru Metro" },
  { id: "dist-blr-u", name: "Bengaluru Urban", col: 4, row: 9, zone: "Bengaluru Metro" },
  { id: "dist-rmn", name: "Ramanagara", col: 3, row: 8, zone: "Bengaluru Metro" },
  { id: "dist-kdg", name: "Kodagu", col: 1, row: 9, zone: "South" },
  { id: "dist-mnd", name: "Mandya", col: 3, row: 9, zone: "South" },

  // South Tip (Row 10)
  { id: "dist-mys", name: "Mysuru", col: 2, row: 10, zone: "South" },
  { id: "dist-cmr", name: "Chamarajanagar", col: 3, row: 10, zone: "South" },
];

export default function KarnatakaMapPage() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("dist-blr-u");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [heatmapMetric, setHeatmapMetric] = useState<"registered" | "selected" | "conversion">("registered");
  const [searchQuery, setSearchQuery] = useState("");

  const allDistricts = useMemo(() => ManagementService.getDistricts(), []);

  const selectedDistrict = useMemo(() => {
    return allDistricts.find((d) => d.id === selectedDistrictId) || allDistricts[0];
  }, [allDistricts, selectedDistrictId]);

  const filteredDistricts = useMemo(() => {
    return allDistricts.filter((d) => {
      const matchZone = zoneFilter === "all" || d.zone === zoneFilter;
      const matchSearch =
        !searchQuery ||
        d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.zone.toLowerCase().includes(searchQuery.toLowerCase());
      return matchZone && matchSearch;
    });
  }, [allDistricts, zoneFilter, searchQuery]);

  // Heatmap intensity calculation
  const maxRegistered = Math.max(...allDistricts.map((d) => d.studentsRegistered));
  const maxSelected = Math.max(...allDistricts.map((d) => d.studentsSelected));

  const getHeatmapColor = (district: DistrictStatistics) => {
    if (heatmapMetric === "registered") {
      const ratio = district.studentsRegistered / maxRegistered;
      if (ratio > 0.6) return "bg-[#001B4D] text-white border-cyan-400";
      if (ratio > 0.3) return "bg-[#004080] text-white border-blue-400";
      if (ratio > 0.15) return "bg-[#005BBB] text-white border-sky-400";
      return "bg-blue-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700";
    } else if (heatmapMetric === "selected") {
      const ratio = district.studentsSelected / maxSelected;
      if (ratio > 0.6) return "bg-emerald-700 text-white border-emerald-400";
      if (ratio > 0.3) return "bg-emerald-600 text-white border-emerald-300";
      if (ratio > 0.15) return "bg-emerald-500 text-white border-emerald-200";
      return "bg-emerald-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700";
    } else {
      // Conversion rate
      if (district.selectionRate >= 25) return "bg-purple-700 text-white border-purple-400";
      if (district.selectionRate >= 20) return "bg-purple-600 text-white border-purple-300";
      if (district.selectionRate >= 16) return "bg-purple-500 text-white border-purple-200";
      return "bg-purple-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700";
    }
  };

  const handleExportDistrictReport = () => {
    ManagementService.exportToCSV(`GQT_Karnataka_${selectedDistrict.district}_CSR_Report`, [
      {
        District: selectedDistrict.district,
        Zone: selectedDistrict.zone,
        Colleges: selectedDistrict.collegesCount,
        Drives: selectedDistrict.drivesCount,
        Registered: selectedDistrict.studentsRegistered,
        ExamAppeared: selectedDistrict.studentsExamAppeared,
        Qualified: selectedDistrict.studentsQualified,
        Selected: selectedDistrict.studentsSelected,
        OffersAccepted: selectedDistrict.offersAccepted,
        JoiningConfirmed: selectedDistrict.joiningConfirmed,
        SelectionRate: `${selectedDistrict.selectionRate}%`,
        AcceptanceRate: `${selectedDistrict.offerAcceptanceRate}%`,
        ActiveHR: selectedDistrict.activeHRExecutives,
        TopColleges: selectedDistrict.topColleges.join("; "),
      },
    ]);
    toast.success(`Exported ${selectedDistrict.district} CSR report`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Karnataka CSR Geo-Intelligence
            </span>
            <span className="text-xs text-blue-200">31 Districts Covered</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Karnataka State-wide CSR Placement Map
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Interactive district-level telemetry tracking institutional outreach, candidate examinations, recruitment yields, and offer acceptance across Karnataka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportDistrictReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm"
          >
            <Download className="w-4 h-4" />
            Export District Sheet
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search district, college, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Zone Filter */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            aria-label="Filter by Karnataka Zone"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Karnataka Zones (31 Districts)</option>
            <option value="Bengaluru Metro">Bengaluru Metro Cluster</option>
            <option value="South">South Karnataka (Mysuru, Mandya, Hassan...)</option>
            <option value="North">North Karnataka (Belagavi, Hubballi, Kalaburagi...)</option>
            <option value="Central">Central Karnataka (Shivamogga, Davanagere...)</option>
            <option value="Coastal">Coastal Karnataka (Mangaluru, Udupi, Karwar)</option>
          </select>
        </div>

        {/* Heatmap Metric Selector */}
        <div className="md:col-span-4 flex items-center justify-end gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg">
          <button
            onClick={() => setHeatmapMetric("registered")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              heatmapMetric === "registered"
                ? "bg-white dark:bg-slate-700 text-[#005BBB] dark:text-cyan-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Registrations
          </button>
          <button
            onClick={() => setHeatmapMetric("selected")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              heatmapMetric === "selected"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Selected
          </button>
          <button
            onClick={() => setHeatmapMetric("conversion")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              heatmapMetric === "conversion"
                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Selection %
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Selected District Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Karnataka Geo Grid Visualization (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Karnataka District Geo-Heatmap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any district card to load comprehensive recruitment telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-slate-600 dark:text-slate-400">High Density</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-2"></span>
              <span className="text-slate-600 dark:text-slate-400">Emerging</span>
            </div>
          </div>

          {/* Spatial Grid representation */}
          <div className="grid grid-cols-5 gap-2.5 p-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200/60 dark:border-slate-800/80 min-h-[480px]">
            {KARNATAKA_GEO_GRID.map((geo) => {
              const districtData = allDistricts.find((d) => d.id === geo.id);
              if (!districtData) return null;

              const isSelected = selectedDistrictId === geo.id;
              const matchesFilter =
                (zoneFilter === "all" || districtData.zone === zoneFilter) &&
                (!searchQuery ||
                  districtData.district.toLowerCase().includes(searchQuery.toLowerCase()));

              const heatmapClass = getHeatmapColor(districtData);

              return (
                <button
                  key={geo.id}
                  onClick={() => setSelectedDistrictId(geo.id)}
                  style={{
                    gridColumn: geo.col,
                    gridRow: geo.row,
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                    isSelected
                      ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10 shadow-lg"
                      : "hover:scale-[1.02] hover:shadow"
                  } ${matchesFilter ? heatmapClass : "opacity-30 bg-slate-100 dark:bg-slate-800 border-slate-200"}`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-[11px] font-bold tracking-tight truncate">
                      {districtData.district}
                    </span>
                    <span className="text-[9px] opacity-75 uppercase font-mono">
                      {districtData.zone.slice(0, 3)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between text-[10px]">
                    <span className="font-semibold">
                      {heatmapMetric === "registered" && `${districtData.studentsRegistered} reg`}
                      {heatmapMetric === "selected" && `${districtData.studentsSelected} sel`}
                      {heatmapMetric === "conversion" && `${districtData.selectionRate}%`}
                    </span>
                    <span className="opacity-75 text-[9px]">
                      {districtData.collegesCount} coll
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick List for fast district jumping */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Quick District Jump (31 Total):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrictId(d.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-all border ${
                    selectedDistrictId === d.id
                      ? "bg-[#001B4D] text-white border-[#001B4D] font-bold shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {d.district}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected District Deep Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                  {selectedDistrict.zone} Zone • Karnataka
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedDistrict.district}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Annual YoY Upliftment Growth:{" "}
                  <span className="font-semibold text-emerald-600">
                    +{selectedDistrict.growthYoY}%
                  </span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400">
                  {selectedDistrict.selectionRate}%
                </span>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  Selection Yield
                </span>
              </div>
            </div>

            {/* 6 Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  Colleges
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDistrict.collegesCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  CSR Drives
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDistrict.drivesCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  Registered
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {selectedDistrict.studentsRegistered.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  Qualified
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDistrict.studentsQualified.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase block">
                  Selected
                </span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {selectedDistrict.studentsSelected.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl border border-cyan-200 dark:border-cyan-800/40">
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase block">
                  Offer Accepted
                </span>
                <span className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                  {selectedDistrict.offerAcceptanceRate}%
                </span>
              </div>
            </div>

            {/* Monthly Trend Mini Chart */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                4-Month Recruitment Cadence
              </span>
              <div className="h-36 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2 border border-slate-100 dark:border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedDistrict.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#001B4D",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="registered" fill="#005BBB" radius={[4, 4, 0, 0]} name="Registered" />
                    <Bar dataKey="selected" fill="#10B981" radius={[4, 4, 0, 0]} name="Selected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Partner Colleges */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Premier Institutions in {selectedDistrict.district}:
              </span>
              <ul className="space-y-2">
                {selectedDistrict.topColleges.map((college, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between text-xs p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                      {college}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 rounded-md">
                      Active MoU
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active HR Leads */}
            <div className="pt-2 flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800/80 rounded-xl border border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Assigned HR Executives
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedDistrict.activeHRExecutives} Leads on Ground
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
