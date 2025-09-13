import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Phone,
  Key,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { apiService } from "../services/api";
import type { PhoneNumberCreate, PhoneNumberInDB } from "../types/api";

export const Keys: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberInDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneNumberInDB | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<PhoneNumberCreate>({
    provider: "twilio",
    phone_number: "",
    label: "",
    credentials: {
      account_sid: "",
      auth_token: "",
    },
  });

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getPhoneNumbers();
      setPhoneNumbers(data);
    } catch (error: unknown) {
      console.error("Error fetching phone numbers:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
          ? String(error.response.data.detail)
          : "Failed to fetch phone numbers";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (editingPhone) {
        await apiService.updatePhoneNumber(editingPhone.id!, formData);
        setSuccess("Phone number updated successfully!");
      } else {
        await apiService.createPhoneNumber(formData);
        setSuccess("Phone number created successfully!");
      }

      setShowForm(false);
      setEditingPhone(null);
      resetForm();
      fetchPhoneNumbers();
    } catch (error: unknown) {
      console.error("Error saving phone number:", error);
      let errorMessage = "Failed to save phone number";

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
      ) {
        const detail = String(error.response.data.detail);
        if (detail.includes("not listed in the Twilio account")) {
          errorMessage = `${detail}. Please use a phone number that exists in your Twilio account. Go to Twilio Console → Phone Numbers → Manage to see your available numbers.`;
        } else {
          errorMessage = detail;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (phone: PhoneNumberInDB) => {
    setEditingPhone(phone);
    setFormData({
      provider: phone.provider,
      phone_number: phone.phone_number || "",
      label: phone.label || "",
      credentials: {
        account_sid: phone.credentials.account_sid,
        auth_token: phone.credentials.auth_token,
      },
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (phoneId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this phone number? This action cannot be undone."
      )
    ) {
      try {
        setError(null);
        setSuccess(null);
        await apiService.deletePhoneNumber(phoneId);
        setSuccess("Phone number deleted successfully!");
        fetchPhoneNumbers();
      } catch (error: unknown) {
        console.error("Error deleting phone number:", error);
        const errorMessage =
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "detail" in error.response.data
            ? String(error.response.data.detail)
            : "Failed to delete phone number";
        setError(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      provider: "twilio",
      phone_number: "",
      label: "",
      credentials: {
        account_sid: "",
        auth_token: "",
      },
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPhone(null);
    resetForm();
    setError(null);
    setSuccess(null);
  };

  const handleAddNew = () => {
    setShowForm(true);
    setEditingPhone(null);
    resetForm();
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-950 p-6 lg:pl-[calc(var(--sidebar-width,288px)+1.5rem)]">
      <div className="max-w-7xl mx-auto">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">
              {success}
            </span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Phone Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Phone Numbers
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure Twilio phone numbers and credentials for making
                    calls
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number
              </button>
            </div>
          </div>

          {/* Phone Numbers List */}
          {!showForm && (
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading phone numbers...
                  </p>
                </div>
              ) : phoneNumbers.length === 0 ? (
                <div className="text-center py-12">
                  <Phone className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No phone numbers configured
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add your first phone number to start making calls through
                    the system
                  </p>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Phone Number
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {phoneNumbers.map((phone) => (
                    <div
                      key={phone.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {phone.label || phone.provider}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <Key className="h-4 w-4 mr-1" />
                                {phone.provider}
                              </span>
                              {phone.phone_number && (
                                <span className="font-mono">
                                  {phone.phone_number}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Created:{" "}
                              {new Date(phone.created_at!).toLocaleDateString()}
                              {phone.updated_at &&
                                phone.updated_at !== phone.created_at &&
                                ` • Updated: ${new Date(
                                  phone.updated_at
                                ).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(phone)}
                            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(phone.id!)}
                            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingPhone ? "Edit Phone Number" : "Add New Phone Number"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider
                    </label>
                    <select
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({ ...formData, provider: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="twilio">Twilio</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Currently supporting Twilio integration
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) =>
                        setFormData({ ...formData, label: e.target.value })
                      }
                      placeholder="e.g., Main Business Line, Support Hotline"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Give your phone number a descriptive name
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter a phone number that exists in your Twilio account. Go
                    to Twilio Console → Phone Numbers → Manage to see your
                    available numbers.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                    Twilio Credentials
                  </h4>
                  <p className="text-xs text-red-800 dark:text-red-200 mb-4">
                    These credentials are required to authenticate with Twilio's
                    API. You can find them in your Twilio Console dashboard.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        Account SID
                      </label>
                      <input
                        type="text"
                        value={formData.credentials.account_sid}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials,
                              account_sid: e.target.value,
                            },
                          })
                        }
                        placeholder="AC..."
                        className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-700 text-red-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        Auth Token
                      </label>
                      <input
                        type="password"
                        value={formData.credentials.auth_token}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials,
                              auth_token: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter your auth token"
                        className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-700 text-red-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading
                      ? "Saving..."
                      : editingPhone
                      ? "Update Phone Number"
                      : "Create Phone Number"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            How to Get Your Twilio Phone Numbers
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                1. Sign up for Twilio
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create a free account at{" "}
                <a
                  href="https://www.twilio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  twilio.com
                </a>
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                2. Get Your Credentials
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Go to your Twilio Console → Dashboard to find your Account SID
                and Auth Token
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                3. Find Your Phone Numbers
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Important:</strong> Go to Twilio Console → Phone Numbers
                → Manage to see your existing phone numbers. You must use one of
                these numbers when creating a phone entry in this system.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                4. Purchase a Phone Number (if needed)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you don't have any phone numbers, go to Phone Numbers → Buy a
                number to purchase one first.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              ⚠️ Phone Number Validation
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              The system validates that your phone number exists in your Twilio
              account. Make sure to enter the exact phone number as shown in
              your Twilio Console (including the country code).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
