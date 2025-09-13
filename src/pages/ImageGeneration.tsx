import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Download,
  RefreshCw,
  Sparkles,
  Coins,
  Zap,
  Copy,
  ExternalLink,
  History,
  Trash2,
  Settings,
} from "lucide-react";
import { apiService } from "../services/api";
import { useApiData } from "../hooks/useApiData";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  size: string;
  quality: string;
  createdAt: string;
  creditsUsed: number;
}

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

export const ImageGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("dall-e-3");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch available models
  const { data: availableModels, loading: modelsLoading } = useApiData(() =>
    apiService.getImageModels()
  );

  // Fetch pricing information
  const { data: pricingInfo, loading: pricingLoading } = useApiData(() =>
    apiService.getImagePricing()
  );

  // Fetch image history
  const {
    data: imageHistory,
    loading: historyLoading,
    refetch: refetchHistory,
  } = useApiData(() => apiService.getImageHistory());

  // Get user spending info
  const { data: userSpending, refetch: refetchSpending } = useApiData(() =>
    apiService.getUserImageSpending()
  );

  // Calculate available credits
  const availableCredits =
    userSpending?.remaining_credits || userSpending?.total_credits || 250;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await apiService.generateImage({
        prompt,
        model,
        size,
        quality,
        n: 1,
      });

      if (result && result.image_url) {
        const newImage: GeneratedImage = {
          id: result.id || Date.now().toString(),
          prompt,
          imageUrl: result.image_url,
          model,
          size,
          quality,
          createdAt: result.created_at || new Date().toISOString(),
          creditsUsed: result.credits_used || getCreditsForGeneration(),
        };

        setCurrentImage(newImage);
        // Clear the prompt after successful generation
        setPrompt("");
        // Refresh history and spending data
        refetchHistory();
        refetchSpending();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    try {
      const blob = await apiService.downloadImage(image.imageUrl);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${image.id}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback to direct download
      const link = document.createElement("a");
      link.href = image.imageUrl;
      link.download = `generated-image-${image.id}.png`;
      link.click();
    }
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const getCreditsForGeneration = () => {
    // Try to get pricing from API first
    if (pricingInfo && Array.isArray(pricingInfo)) {
      const modelPricing = pricingInfo.find(
        (p: any) =>
          p.model === model &&
          p.size === size &&
          (p.quality === quality || (quality === "standard" && !p.quality))
      );
      if (modelPricing) {
        return modelPricing.credits || modelPricing.cost || 10;
      }
    }

    // Fallback to hardcoded values
    if (model === "dall-e-3") {
      return quality === "hd" ? 15 : 10;
    }
    return 8;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Image Generator
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Generate images using OpenAI's DALL-E models
            </p>
          </div>

          {/* Credits and Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100 mb-1">
                    Available Credits
                  </p>
                  <p className="text-3xl font-bold">{availableCredits}</p>
                  <p className="text-xs text-purple-200 mt-1">Resets monthly</p>
                </div>
                <Coins className="h-8 w-8 text-purple-100" />
              </div>
            </div>

            <StatCard
              title="Images Generated"
              value={imageHistory?.length?.toString() || "0"}
              change="↑ 12 this week"
              changeType="positive"
              icon={ImageIcon}
              loading={historyLoading}
            />

            <StatCard
              title="Credits Used"
              value={userSpending?.total_credits_used?.toString() || "0"}
              change="This month"
              changeType="neutral"
              icon={Zap}
            />

            <StatCard
              title="Success Rate"
              value="98.5%"
              change="↑ 1.2%"
              changeType="positive"
              icon={Sparkles}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
              <div className="text-red-600 dark:text-red-400">⚠️</div>
              <span className="text-red-800 dark:text-red-200">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generation Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Generate New Image
                </h2>

                <div className="space-y-6">
                  {/* Prompt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prompt:
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter your image description..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model:
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      disabled={modelsLoading}
                    >
                      {availableModels?.models?.map((modelOption: any) => (
                        <option key={modelOption.id} value={modelOption.id}>
                          {modelOption.name || modelOption.id}
                        </option>
                      )) || (
                        <>
                          <option value="dall-e-3">DALL-E 3</option>
                          <option value="dall-e-2">DALL-E 2</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Size:
                    </label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    >
                      {availableModels?.models
                        ?.find((m: any) => m.id === model)
                        ?.sizes?.map((sizeOption: string) => (
                          <option key={sizeOption} value={sizeOption}>
                            {sizeOption}
                          </option>
                        )) || (
                        <>
                          <option value="1024x1024">1024x1024</option>
                          <option value="1792x1024">1792x1024</option>
                          <option value="1024x1792">1024x1792</option>
                          {model === "dall-e-2" && (
                            <option value="512x512">512x512</option>
                          )}
                        </>
                      )}
                    </select>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quality:
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    >
                      {availableModels?.models
                        ?.find((m: any) => m.id === model)
                        ?.qualities?.map((qualityOption: string) => (
                          <option key={qualityOption} value={qualityOption}>
                            {qualityOption}
                          </option>
                        )) || (
                        <>
                          <option value="standard">Standard</option>
                          {model === "dall-e-3" && (
                            <option value="hd">HD</option>
                          )}
                        </>
                      )}
                    </select>
                  </div>

                  {/* Credits Info */}
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        This generation will cost:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getCreditsForGeneration()} credits
                      </span>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={
                      !prompt.trim() ||
                      isGenerating ||
                      availableCredits < getCreditsForGeneration()
                    }
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-brand-red hover:bg-brand-red-secondary rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Generating... (may take 30-60 seconds)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Current Generated Image */}
              {currentImage && (
                <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Generated Image
                  </h3>
                  <div className="space-y-4">
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.prompt}
                      className="w-full rounded-lg shadow-lg"
                    />
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleDownloadImage(currentImage)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleCopyPrompt(currentImage.prompt)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy Prompt</span>
                      </button>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Prompt:</strong> {currentImage.prompt}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {currentImage.model} • {currentImage.size} •{" "}
                          {currentImage.quality}
                        </span>
                        <span>{currentImage.creditsUsed} credits used</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* History Sidebar */}
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Images
                </h3>
                <History className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading history...
                    </p>
                  </div>
                ) : imageHistory && imageHistory.length > 0 ? (
                  imageHistory.map((image: any) => (
                    <div
                      key={image.id}
                      className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.image_url || image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          setCurrentImage({
                            id: image.id,
                            prompt: image.prompt,
                            imageUrl: image.image_url || image.imageUrl,
                            model: image.model,
                            size: image.size,
                            quality: image.quality,
                            createdAt: image.created_at || image.createdAt,
                            creditsUsed:
                              image.credits_used || image.creditsUsed,
                          })
                        }
                      />
                      <div className="p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {image.prompt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {formatDate(image.created_at || image.createdAt)}
                          </span>
                          <span>
                            {image.credits_used || image.creditsUsed} credits
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleDownloadImage(image)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleCopyPrompt(image.prompt)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No images generated yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Generate your first image to see it here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
