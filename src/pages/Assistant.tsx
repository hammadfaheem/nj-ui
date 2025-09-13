import React, { useState, useEffect } from "react";
import AssistantList from "./AssistantList";
import AssistantForm from "./AssistantForm";
import { apiService } from "../services/api";
import { Assistant } from "../types/api";
import { Bot, PhoneCall } from "lucide-react";
import { Button } from "../components/UI/Button";
import { RoomInterface } from "../components/RoomInterface";

const AssistantPage = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [isCalling, setIsCalling] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [roomInterface, setRoomInterface] = useState<any>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        console.log("🔍 Fetching assistants...");
        const data = await apiService.getAssistants();
        console.log("📋 Assistants received:", data);

        setAssistants(data || []);

        // Don't auto-select any assistant - let user choose manually
        if (!data || data.length === 0) {
          console.log("⚠️ No assistants found");
        }
      } catch (error) {
        console.error("❌ Error fetching assistants:", error);
        setAssistants([]);
        // Show user-friendly error message
        alert(
          "Failed to load assistants. Please check your authentication and try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAssistants();
  }, []);

  const handleSelectAssistant = async (assistant: Assistant) => {
    // Toggle selection: if clicking the same assistant, deselect it
    if (selectedAssistant?.assistant_id === assistant.assistant_id) {
      setSelectedAssistant(null);
    } else {
      try {
        const fullAssistant = await apiService.getAssistant(assistant.assistant_id!);
        // Some backend responses don't include assistant_id in the payload.
        // Ensure we keep the id from the list item so the UI stays selected.
        setSelectedAssistant({ ...(fullAssistant as Assistant), assistant_id: assistant.assistant_id });
      } catch (error) {
        console.error("Failed to fetch assistant details", error);
        alert("Failed to fetch assistant details.");
      }
    }
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    try {
      await apiService.deleteAssistant(assistantId);
      // Remove the deleted assistant from the local state
      setAssistants((prev) =>
        prev.filter((a) => a.assistant_id !== assistantId)
      );
      // If the deleted assistant was selected, clear the selection
      if (selectedAssistant?.assistant_id === assistantId) {
        setSelectedAssistant(null);
      }
      alert("Assistant deleted successfully!");
    } catch (error) {
      console.error("Error deleting assistant:", error);
      alert("Failed to delete assistant. Please try again.");
    }
  };

  const handleEditAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
  };

  const handleTalk = async () => {
    // 🚀 This equals "Call AI Assistant" (like vapi.ai)
    if (!selectedAssistant || !selectedAssistant.name) {
      alert("Please select an assistant first!");
      return;
    }

    if (isCalling) {
      // End the call
      try {
        console.log("📞 Ending call...");
        await apiService.endSession(currentSession!.session_id);
        setIsCalling(false);
        setCurrentSession(null);
        setRoomInterface(null);
        console.log("✅ Call ended successfully");
        alert(`📞 Call ended with ${selectedAssistant.name}`);
      } catch (error) {
        console.error("❌ Error ending session:", error);
        alert("Failed to end call properly");
        // Still reset the UI state
        setIsCalling(false);
        setCurrentSession(null);
        setRoomInterface(null);
      }
    } else {
      // Start the call
      try {
        console.log("📞 Starting call with assistant:", selectedAssistant.name);
        setIsCalling(true);

        const sessionData = await apiService.startSession(
          selectedAssistant.assistant_id!
        );
        console.log("🎯 Session data received:", sessionData);

        setCurrentSession(sessionData);

        // Create room interface
        setRoomInterface({
          room: sessionData.room,
          token: sessionData.token,
          wss: sessionData.wss,
          sessionId: sessionData.session_id,
        });

        console.log("✅ Call started successfully");
        alert(
          `📞 Connected to ${selectedAssistant.name}! Room: ${sessionData.room}`
        );
      } catch (error) {
        console.error("❌ Error starting session:", error);
        setIsCalling(false);
        alert(
          "Failed to start call. Please check your LiveKit configuration and try again."
        );
      }
    }
  };

  const handleCloseRoom = () => {
    setRoomInterface(null);
    setIsCalling(false);
    setCurrentSession(null);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 lg:pl-[var(--sidebar-width,18rem)] ${
        roomInterface ? "lg:pr-80" : ""
      }`}
    >
      {/* Room Interface - Right Side */}
      {roomInterface && (
        <div className="fixed right-0 top-0 h-full w-80 z-50">
          <RoomInterface roomData={roomInterface} onClose={handleCloseRoom} />
        </div>
      )}
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="py-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bot className="w-6 h-6 text-red-500" />
                  Your AI Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your AI assistants
                </p>
              </div>
            </div>

            {/* Selected Assistant Display */}
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-base">🤖</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAssistant?.name || "No assistant selected"}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {selectedAssistant
                        ? "Ready to call"
                        : "Select an assistant from the list"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleTalk}
                  disabled={!selectedAssistant}
                  variant={isCalling ? "primary" : "outline"}
                  className={`flex items-center gap-2 px-4 py-2 text-sm ${
                    isCalling
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : selectedAssistant
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  {isCalling ? "End Call" : "Test Assistant"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading assistants...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Left side - List */}
            <div className="xl:col-span-1">
              {assistants.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Assistant
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create your first assistant using the form
                  </p>
                </div>
              ) : (
                <AssistantList
                  assistants={assistants}
                  loading={loading}
                  selectedAssistant={selectedAssistant}
                  onSelect={handleSelectAssistant}
                  onDelete={handleDeleteAssistant}
                  onEdit={handleEditAssistant}
                />
              )}
            </div>

            {/* Right side - Form */}
            <div className="xl:col-span-3">
              <AssistantForm
                selectedAssistant={selectedAssistant}
                refreshAssistants={() => {
                  setLoading(true);
                  apiService
                    .getAssistants()
                    .then((data) => {
                      setAssistants(data || []);
                      // Clear selection if current assistant no longer exists
                      if (
                        selectedAssistant &&
                        !data?.find(
                          (a) =>
                            a.assistant_id === selectedAssistant.assistant_id
                        )
                      ) {
                        setSelectedAssistant(null);
                      }
                    })
                    .catch((error) => {
                      console.error("Error refreshing assistants:", error);
                      setAssistants([]);
                    })
                    .finally(() => setLoading(false));
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantPage;
