import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  FileText,
  Bot,
  Settings,
  Mic,
  Volume2,
  Zap,
  FolderOpen,
} from "lucide-react";
import { Assistant } from "../types/api";
import FileUpload from "./FileUpload";
import { apiService } from "../services/api";

interface AssistantFormProps {
  selectedAssistant: Assistant | null;
  refreshAssistants: () => void;
}

const AssistantForm: React.FC<AssistantFormProps> = ({
  selectedAssistant,
  refreshAssistants,
}) => {
  const [formData, setFormData] = useState<Assistant>(
    selectedAssistant
      ? {
          ...selectedAssistant,
          assistant_id: selectedAssistant.assistant_id, // ensure id is present on formData
          transcriber: selectedAssistant.transcriber || {
            provider: "whisper",
            language: "en",
            model: "",
            noise_cancellation: false,
          },
          advanced: selectedAssistant.advanced || {
            silence_timeout: {
              followup_time_on: 25,
              call_end_time_on_silence: 45,
            },
            function: {
              endCall: false,
              currentDatetime: false,
            },
          },
        }
      : {
          name: "",
          llm: {
            first_message: "",
            system_prompt: "",
            file_ids: [],
            provider: "openai",
            model: "gpt-4",
            temperature: 0.5,
            max_token: 250,
            closing: "",
          },
          voice: {
            provider: "cartesia",
            model: "sonic-english",
            voice_id: "sonic-english",
            speed: 1,
          },
          transcriber: {
            provider: "deepgram",
            language: "en",
            model: "nova-2",
            noise_cancellation: false,
          },
          advanced: {
            silence_timeout: {
              followup_time_on: 25,
              call_end_time_on_silence: 45,
            },
            function: {
              endCall: false,
              currentDatetime: false,
            },
          },
        }
  );

  useEffect(() => {
    if (selectedAssistant) {
      // Merge selectedAssistant with default structure to ensure all properties exist
      setFormData({
        ...selectedAssistant,
        assistant_id: selectedAssistant.assistant_id, // ensure id is present on formData
        llm: {
          first_message: "",
          system_prompt: "",
          file_ids: [],
          provider: "openai",
          model: "gpt-4",
          temperature: 0.5,
          max_token: 250,
          closing: "",
          ...selectedAssistant.llm,
        },
        voice: {
          provider: "cartesia",
          model: "",
          voice_id: "",
          speed: 1,
          ...selectedAssistant.voice,
        },
        transcriber: {
          provider: "deepgram",
          language: "en",
          model: "",
          noise_cancellation: false,
          ...selectedAssistant.transcriber,
        },
        advanced: {
          silence_timeout: {
            followup_time_on: 25,
            call_end_time_on_silence: 45,
          },
          function: {
            endCall: false,
            currentDatetime: false,
          },
          ...selectedAssistant.advanced,
        },
      });
    }
  }, [selectedAssistant]);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState("general");
  const tabs = [
    { id: "general", label: "General", icon: Bot },
    { id: "llm", label: "LLM", icon: Settings },
    { id: "voice", label: "Voice", icon: Volume2 },
    { id: "transcriber", label: "Transcriber", icon: Mic },
    { id: "advanced", label: "Advanced", icon: Zap },
    { id: "files", label: "Files", icon: FolderOpen },
  ];

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await apiService.listUserFiles();
        setUserFiles(res.files || []);
      } catch (error) {
        console.error("Error fetching files:", error);
        setUserFiles([]);
      }
    }
    fetchFiles();
  }, []);

  const handleFileSelect = (file_id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(file_id)
        ? prev.filter((id) => id !== file_id)
        : [...prev, file_id]
    );
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (
    section: string,
    subsection: string,
    field: string,
    value: any
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleFileUpload = (files: any[]) => {
    try {
      setUploadedFiles((prev) => [...prev, ...files]);
      // Don't modify formData here - files will be uploaded separately during save
    } catch (error) {
      console.error("Error handling file upload:", error);
      alert("Error uploading files. Please try again.");
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    // No need to modify formData here since files are handled separately
  };

  const handleSave = async () => {
    try {
      // First, upload any new files
      const uploadedFileIds: string[] = [];

      for (const file of uploadedFiles) {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file.file);
          });

          const uploadData = {
            filename: file.filename,
            base64: base64,
          };

          const uploadResponse = await apiService.uploadFile(uploadData);
          uploadedFileIds.push(uploadResponse.file_id);
        } catch (uploadError) {
          console.error("Error uploading file:", file.filename, uploadError);
          alert(`Failed to upload file: ${file.filename}`);
          return; // Stop the process if file upload fails
        }
      }

      // Combine selected existing files with newly uploaded files
      const allFileIds = [...selectedFileIds, ...uploadedFileIds];

      // Ensure all required fields are present and of correct type
      const safeVoiceModel =
        formData.voice.model && formData.voice.model !== ""
          ? formData.voice.model
          : voiceModels && voiceModels.length > 0
          ? voiceModels[0]
          : formData.voice.provider === "openai"
          ? "gpt-4o-mini-tts"
          : formData.voice.provider === "cartesia"
          ? "sonic-english"
          : "default-model";
      const safeVoiceId =
        formData.voice.voice_id && formData.voice.voice_id !== ""
          ? formData.voice.voice_id
          : voiceIds && voiceIds.length > 0
          ? voiceIds[0]
          : "default-voice";

      const payload = {
        name: formData.name || "Assistant",
        llm: {
          first_message: formData.llm.first_message || "",
          system_prompt: formData.llm.system_prompt || "",
          file_ids: Array.isArray(allFileIds) ? allFileIds : [],
          provider: formData.llm.provider || "openai",
          model: formData.llm.model || (llmModels && llmModels[0]) || "gpt-4",
          temperature:
            typeof formData.llm.temperature === "number"
              ? formData.llm.temperature
              : 0.5,
          max_token:
            typeof formData.llm.max_token === "number"
              ? formData.llm.max_token
              : 250,
          closing: formData.llm.closing || "",
        },
        voice: {
          provider: formData.voice.provider || "cartesia",
          model: safeVoiceModel,
          voice_id: safeVoiceId,
          speed:
            typeof formData.voice.speed === "number"
              ? formData.voice.speed
              : 1,
        },
        transcriber: {
          provider: formData.transcriber?.provider || "deepgram",
          language: formData.transcriber?.language || "en",
          model:
            formData.transcriber?.model || (sttModels && sttModels[0]) || "nova-2",
          noise_cancellation:
            typeof formData.transcriber?.noise_cancellation === "boolean"
              ? formData.transcriber.noise_cancellation
              : false,
        },
        advanced: {
          silence_timeout: {
            followup_time_on:
              typeof formData.advanced?.silence_timeout?.followup_time_on ===
              "number"
                ? formData.advanced.silence_timeout.followup_time_on
                : 25,
            call_end_time_on_silence:
              typeof formData.advanced?.silence_timeout?.call_end_time_on_silence ===
              "number"
                ? formData.advanced.silence_timeout.call_end_time_on_silence
                : 45,
          },
          function: {
            endCall:
              typeof formData.advanced?.function?.endCall === "boolean"
                ? formData.advanced.function.endCall
                : false,
            currentDatetime:
              typeof formData.advanced?.function?.currentDatetime === "boolean"
                ? formData.advanced.function.currentDatetime
                : false,
          },
        },
      };

      console.log("Assistant save payload:", payload);

      // Robustly determine assistant id: prefer formData.assistant_id, fallback to selectedAssistant prop
      const assistantId = (formData as any)?.assistant_id || selectedAssistant?.assistant_id;

      if (assistantId) {
        // Include assistant_id in payload in case backend expects it in body
        (payload as any).assistant_id = assistantId;
        await apiService.updateAssistant(assistantId, payload);
        alert("Assistant updated successfully!");
      } else {
        const assistantIdCreated = await apiService.createAssistant(payload);
        alert("Assistant created successfully! ID: " + assistantIdCreated);
      }
      refreshAssistants();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save assistant. Please try again.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // LOV State
  const [llmProviders, setLlmProviders] = useState<string[]>([]);
  const [llmModels, setLlmModels] = useState<string[]>([]);
  const [voiceProviders, setVoiceProviders] = useState<string[]>([]);
  const [voiceModels, setVoiceModels] = useState<string[]>([]);
  const [voiceIds, setVoiceIds] = useState<string[]>([]);
  const [sttProviders, setSttProviders] = useState<string[]>([]);
  const [sttModels, setSttModels] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLOV() {
      try {
        const llmProv = await apiService.getLLMProviders();
        setLlmProviders(llmProv);
        if (formData.llm && formData.llm.provider) {
          const llmMod = await apiService.getLLMModels(formData.llm.provider);
          setLlmModels(llmMod);
        }
        const sttProv = await apiService.getSTTProviders();
        setSttProviders(sttProv);
        if (formData.transcriber && formData.transcriber.provider) {
          const sttMod = await apiService.getSTTModels(
            formData.transcriber.provider
          );
          setSttModels(sttMod);
        }
        const voiceProv = await apiService.getTTSProviders();
        setVoiceProviders(voiceProv);
        if (formData.voice && formData.voice.provider) {
          const voiceMod = await apiService.getTTSModels(
            formData.voice.provider
          );
          setVoiceModels(voiceMod);
          const voiceIds = await apiService.getTTSVoices(
            formData.voice.provider
          );
          setVoiceIds(voiceIds);
        }
      } catch (error) {
        console.error("Error fetching LOV data:", error);
      }
    }
    fetchLOV();
  }, [
    formData.llm?.provider,
    formData.transcriber?.provider,
    formData.voice?.provider,
  ]);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="p-6 h-full overflow-y-auto">
        <div className="max-w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-brand-red" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedAssistant
                      ? "Edit AI Assistant"
                      : "Create AI Assistant"}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {selectedAssistant
                      ? "Update your AI assistant settings and behavior."
                      : "Configure your AI voice assistant settings and behavior."}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    // Reset form to default values for creating new assistant
                    setFormData({
                      name: "",
                      llm: {
                        first_message: "",
                        system_prompt: "",
                        file_ids: [],
                        provider: "openai",
                        model: "gpt-4",
                        temperature: 0.5,
                        max_token: 250,
                        closing: "",
                      },
                      voice: {
                        provider: "cartesia",
                        model: "sonic-english",
                        voice_id: "sonic-english",
                        speed: 1,
                      },
                      transcriber: {
                        provider: "deepgram",
                        language: "en",
                        model: "nova-2",
                        noise_cancellation: false,
                      },
                      advanced: {
                        silence_timeout: {
                          followup_time_on: 25,
                          call_end_time_on_silence: 45,
                        },
                        function: {
                          endCall: false,
                          currentDatetime: false,
                        },
                      },
                    });
                    // Reset to first tab
                    setActiveTab("general");
                    // Clear uploaded files
                    setUploadedFiles([]);
                    setSelectedFileIds([]);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-red hover:bg-brand-red-secondary rounded-lg text-white transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {selectedAssistant ? "Update Assistant" : "Save Assistant"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-brand-red text-brand-red"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
            <div className="p-6">
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assistant Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      placeholder="Enter assistant name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Message
                    </label>
                    <textarea
                      value={formData.llm.first_message}
                      onChange={(e) =>
                        handleInputChange(
                          "llm",
                          "first_message",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      placeholder="Enter the first message the assistant will say"
                    />
                  </div>
                </div>
              )}

              {activeTab === "llm" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LLM Provider
                      </label>
                      <select
                        value={formData.llm.provider}
                        onChange={(e) =>
                          handleInputChange("llm", "provider", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {llmProviders.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LLM Model
                      </label>
                      <select
                        value={formData.llm.model}
                        onChange={(e) =>
                          handleInputChange("llm", "model", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {llmModels.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      System Prompt
                    </label>
                    <textarea
                      value={formData.llm.system_prompt}
                      onChange={(e) =>
                        handleInputChange(
                          "llm",
                          "system_prompt",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      placeholder="Enter system prompt for the assistant"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Temperature
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={formData.llm.temperature}
                        onChange={(e) =>
                          handleInputChange(
                            "llm",
                            "temperature",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        value={formData.llm.max_token}
                        onChange={(e) =>
                          handleInputChange(
                            "llm",
                            "max_token",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "voice" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Voice Provider
                      </label>
                      <select
                        value={formData.voice.provider}
                        onChange={(e) =>
                          handleInputChange("voice", "provider", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {voiceProviders.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Voice Model
                      </label>
                      <select
                        value={formData.voice.model}
                        onChange={(e) =>
                          handleInputChange("voice", "model", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {voiceModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Voice ID
                      </label>
                      <select
                        value={formData.voice.voice_id}
                        onChange={(e) =>
                          handleInputChange("voice", "voice_id", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {voiceIds.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Speed
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="2"
                        value={formData.voice.speed}
                        onChange={(e) =>
                          handleInputChange(
                            "voice",
                            "speed",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transcriber" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transcriber Provider
                      </label>
                      <select
                        value={formData.transcriber!.provider}
                        onChange={(e) =>
                          handleInputChange(
                            "transcriber",
                            "provider",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {sttProviders.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transcriber Model
                      </label>
                      <select
                        value={formData.transcriber!.model}
                        onChange={(e) =>
                          handleInputChange(
                            "transcriber",
                            "model",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {sttModels.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <input
                        type="text"
                        value={formData.transcriber!.language}
                        onChange={(e) =>
                          handleInputChange(
                            "transcriber",
                            "language",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="noise_cancellation"
                        checked={formData.transcriber!.noise_cancellation}
                        onChange={(e) =>
                          handleInputChange(
                            "transcriber",
                            "noise_cancellation",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                      />
                      <label
                        htmlFor="noise_cancellation"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Noise Cancellation
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Silence Timeout
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Follow-up Time (seconds)
                        </label>
                        <input
                          type="number"
                          value={
                            formData.advanced!.silence_timeout!.followup_time_on
                          }
                          onChange={(e) =>
                            handleNestedInputChange(
                              "advanced",
                              "silence_timeout",
                              "followup_time_on",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Call End Time (seconds)
                        </label>
                        <input
                          type="number"
                          value={
                            formData.advanced!.silence_timeout!
                              .call_end_time_on_silence
                          }
                          onChange={(e) =>
                            handleNestedInputChange(
                              "advanced",
                              "silence_timeout",
                              "call_end_time_on_silence",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Functions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="endCall"
                          checked={formData.advanced!.function!.endCall}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "advanced",
                              "function",
                              "endCall",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                        />
                        <label
                          htmlFor="endCall"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          End Call Function
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="currentDatetime"
                          checked={formData.advanced!.function!.currentDatetime}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "advanced",
                              "function",
                              "currentDatetime",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                        />
                        <label
                          htmlFor="currentDatetime"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Current DateTime Function
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-6">
                  <FileUpload
                    uploadedFiles={uploadedFiles}
                    onUpload={handleFileUpload}
                    onRemove={removeFile}
                    formatFileSize={formatFileSize}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Attach Existing Files
                    </h3>
                    <div className="space-y-2">
                      {userFiles.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400">
                          No files available.
                        </div>
                      ) : (
                        userFiles.map((file: any) => (
                          <label
                            key={file.file_id}
                            className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFileIds.includes(file.file_id)}
                              onChange={() => handleFileSelect(file.file_id)}
                              className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                            />
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {file.filename}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                              ({formatFileSize(file.file_size)})
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantForm;
