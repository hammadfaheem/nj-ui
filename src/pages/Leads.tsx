// import React from "react";

// export const Leads: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
//       <div className="max-w-xl w-full bg-gray-50 dark:bg-dark-800 rounded-xl p-8 border border-gray-200 dark:border-dark-700 shadow">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//           Leads
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mb-6">
//           This is a placeholder for the Leads page. You can update this page
//           with your leads management features.
//         </p>
//       </div>
//     </div>
//   );
// };
import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Star,
  MoreVertical,
  Eye,
  UserPlus,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  score: number;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  notes: string;
}

const dummyLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc",
    status: "qualified",
    source: "Website",
    score: 85,
    value: 15000,
    assignedTo: "Sarah Johnson",
    createdAt: "2025-08-20T10:30:00Z",
    lastContact: "2025-08-22T09:15:00Z",
    notes: "Interested in enterprise solution, budget approved",
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily@startupco.io",
    phone: "+1 (555) 987-6543",
    company: "StartupCo",
    status: "new",
    source: "LinkedIn",
    score: 72,
    value: 8500,
    assignedTo: "Mike Wilson",
    createdAt: "2025-08-22T08:00:00Z",
    lastContact: "2025-08-22T08:00:00Z",
    notes: "Initial inquiry about pricing",
  },
  {
    id: "3",
    name: "Robert Chen",
    email: "r.chen@globaltech.com",
    phone: "+1 (555) 456-7890",
    company: "GlobalTech Solutions",
    status: "contacted",
    source: "Referral",
    score: 91,
    value: 25000,
    assignedTo: "Sarah Johnson",
    createdAt: "2025-08-19T14:20:00Z",
    lastContact: "2025-08-21T16:30:00Z",
    notes: "Follow-up scheduled for next week",
  },
  {
    id: "4",
    name: "Lisa Anderson",
    email: "lisa.anderson@bizflow.com",
    phone: "+1 (555) 321-9876",
    company: "BizFlow",
    status: "converted",
    source: "Google Ads",
    score: 88,
    value: 12000,
    assignedTo: "Mike Wilson",
    createdAt: "2025-08-15T11:45:00Z",
    lastContact: "2025-08-20T13:00:00Z",
    notes: "Signed contract, implementation starting soon",
  },
  {
    id: "5",
    name: "David Kim",
    email: "dkim@innovateplus.com",
    phone: "+1 (555) 654-3210",
    company: "InnovatePlus",
    status: "lost",
    source: "Trade Show",
    score: 45,
    value: 5000,
    assignedTo: "Sarah Johnson",
    createdAt: "2025-08-12T09:30:00Z",
    lastContact: "2025-08-18T11:00:00Z",
    notes: "Decided to go with competitor",
  },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<any>;
  loading?: boolean;
}> = ({ title, value, change, changeType, icon: Icon, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-dark-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <span
              className={`text-sm ${
                changeType === "positive"
                  ? "text-green-600"
                  : changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {change}
            </span>
          )}
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
};

export const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [leads, setLeads] = useState(dummyLeads);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  // Calculate stats
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const qualifiedLeads = leads.filter((l) => l.status === "qualified").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate =
    totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchTerm ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSource = !sourceFilter || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleCreateLead = () => {
    console.log("Create new lead");
  };

  const handleEditLead = (id: string) => {
    console.log("Edit lead:", id);
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCallLead = (phone: string) => {
    console.log("Call lead:", phone);
  };

  const handleEmailLead = (email: string) => {
    console.log("Email lead:", email);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "qualified":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "converted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "lost":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950 min-h-screen">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Leads Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Track and manage your sales leads and prospects
                </p>
              </div>
              <button
                onClick={handleCreateLead}
                className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-brand-red hover:bg-brand-red-secondary rounded-lg text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <StatCard
              title="Total Leads"
              value={totalLeads.toString()}
              change="↑ 8% this week"
              changeType="positive"
              icon={Users}
              loading={loading}
            />
            <StatCard
              title="New Leads"
              value={newLeads.toString()}
              change="↑ 12% today"
              changeType="positive"
              icon={UserPlus}
              loading={loading}
            />
            <StatCard
              title="Qualified"
              value={qualifiedLeads.toString()}
              icon={CheckCircle}
              loading={loading}
            />
            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change="↑ 2.1%"
              changeType="positive"
              icon={TrendingUp}
              loading={loading}
            />
            <StatCard
              title="Total Value"
              value={formatCurrency(totalValue)}
              change="↑ $15k"
              changeType="positive"
              icon={Star}
              loading={loading}
            />
          </div>

          {/* Filters and Controls */}
          <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {/* Source Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Source:</span>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Trade Show">Trade Show</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-brand-red hover:bg-brand-red-secondary rounded-lg text-white transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 dark:hover:bg-dark-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {lead.company}
                          </div>
                          <div className="text-xs text-gray-400">
                            {lead.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-medium ${getScoreColor(
                              lead.score
                            )}`}
                          >
                            {lead.score}
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {lead.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(lead.lastContact)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleCallLead(lead.phone)}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEmailLead(lead.email)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setSelectedLead(
                                  selectedLead === lead.id ? null : lead.id
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {selectedLead === lead.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg shadow-lg z-10">
                                <button
                                  onClick={() => handleEditLead(lead.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center space-x-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center space-x-2">
                                  <Eye className="h-4 w-4" />
                                  <span>View Details</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Schedule Call</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredLeads.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No leads found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter || sourceFilter
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first lead"}
              </p>
              {!searchTerm && !statusFilter && !sourceFilter && (
                <button
                  onClick={handleCreateLead}
                  className="mt-4 flex items-center space-x-2 mx-auto px-4 py-2 bg-brand-red hover:bg-brand-red-secondary rounded-lg text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Lead</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
