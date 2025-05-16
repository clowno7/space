import { useState, useEffect } from "react";
import {
  Satellite,
  AlertTriangle,
  Info,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStore } from "./store";
import { Auth } from "./components/Auth";
import { AIChat } from "./components/AIChat";
import { DebrisMap } from "./components/DebrisMap";
import { getAstronomyPictureOfDay, getSpaceImages } from "./services/api";
import { AstronomyPicture } from "./types";
import { ErrorBoundary } from "react-error-boundary";

const Fallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apod, setApod] = useState<AstronomyPicture | null>(null);
  const [spaceImages, setSpaceImages] = useState<AstronomyPicture[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user, isAuthenticated, setUser } = useStore();

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const data = await getAstronomyPictureOfDay();
        setApod(data);
      } catch (error) {
        console.error("Error fetching APOD:", error);
      }
    };

    const fetchSpaceImages = async () => {
      try {
        const data = await getSpaceImages(10);
        setSpaceImages(data);
      } catch (error) {
        console.error("Error fetching space images:", error);
      }
    };

    fetchAPOD();
    fetchSpaceImages();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % spaceImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? spaceImages.length - 1 : prev - 1
    );
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <div className="min-h-screen bg-slate-900 text-white flex overflow-hidden">
        {/* TODO: Store the background image locally or use a CDN in a production environment */}
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />

        {/* Sidebar */}
        <div
          className={`bg-slate-800/80 backdrop-blur-sm fixed md:relative h-full z-20 transition-all duration-300 ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-20 -translate-x-full md:translate-x-0"
          }`}
          style={{
            background: `linear-gradient(to right, #1e293b, #2d3748)`,
            animation: `gradientAnimation 10s ease infinite`,
          }}
        >
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <div
              className={`flex items-center ${
                isSidebarOpen ? "gap-3" : "gap-0"
              }`}
            >
              <Satellite className="text-white" size={36} />
              <span
                className={`text-white text-2xl font-bold whitespace-nowrap transition-opacity duration-300 ${
                  isSidebarOpen
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                SpaceAware
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors md:hidden"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 p-4">
            {[
              { icon: BarChart3, label: "Dashboard" },
              { icon: AlertTriangle, label: "Alerts" },
              { icon: Info, label: "Information" },
              { icon: Users, label: "Community" },
              { icon: MessageSquare, label: "Forum" },
              { icon: Settings, label: "Settings" },
            ].map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-all hover:translate-x-1 text-white font-medium"
              >
                <item.icon size={28} className="text-white" />
                <span
                  className={`text-white whitespace-nowrap transition-opacity duration-300 ${
                    isSidebarOpen
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <div
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-all hover:translate-x-1 cursor-pointer"
              onClick={() => setUser(null)}
            >
              <LogOut size={28} className="text-white" />
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isSidebarOpen
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                Sign Out
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-slate-800/50 backdrop-blur-sm p-4 md:p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden mr-4 text-gray-400 hover:text-white"
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold">
                  Space Debris Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 hidden md:inline">
                  Welcome, {user?.name}
                </span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  label: "Active Debris",
                  value: "27,000+",
                  color: "bg-blue-500",
                },
                {
                  label: "High-Risk Objects",
                  value: "142",
                  color: "bg-red-500",
                },
                {
                  label: "Tracked Satellites",
                  value: "5,000+",
                  color: "bg-green-500",
                },
                {
                  label: "Potential Collisions",
                  value: "23",
                  color: "bg-yellow-500",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-slate-700 hover:translate-y-[-2px] transition-transform"
                >
                  <div
                    className={`${stat.color} w-12 h-12 md:w-20 md:h-20 rounded-lg flex items-center justify-center mb-8`}
                  >
                    <Satellite size={20} className="text-white" />
                  </div>
                  <h3 className="text-gray-400 text-xs md:text-sm">
                    {stat.label}
                  </h3>
                  <p className="text-lg md:text-2xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-slate-700">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Global Debris Map
              </h2>
              <DebrisMap />
            </div>

            {/* Space Gallery */}
            {spaceImages.length > 0 && (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-slate-700">
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  Space Gallery
                </h2>
                <div className="relative">
                  <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                    <img
                      src={spaceImages[currentImageIndex].url}
                      alt={spaceImages[currentImageIndex].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">
                      {spaceImages[currentImageIndex].title}
                    </h3>
                    <p className="text-gray-300 mt-2">
                      {spaceImages[currentImageIndex].explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* APOD Section */}
            {apod ? (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-slate-700">
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  Astronomy Picture of the Day
                </h2>
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4">
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{apod.title}</h3>
                <p className="text-gray-300">{apod.explanation}</p>
              </div>
            ) : null}

            {/* Recent Alerts */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-slate-700">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Recent Alerts
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "High-Risk Collision Detected",
                    time: "2 minutes ago",
                    severity: "high",
                  },
                  {
                    title: "New Debris Field Identified",
                    time: "15 minutes ago",
                    severity: "medium",
                  },
                  {
                    title: "Satellite Path Adjustment Required",
                    time: "1 hour ago",
                    severity: "low",
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:translate-x-1 transition-transform"
                  >
                    <div className="flex items-center space-x-4">
                      <AlertTriangle
                        className={
                          alert.severity === "high"
                            ? "text-red-500"
                            : alert.severity === "medium"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }
                      />
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-400">{alert.time}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
        {/* AI Chat Widget */}
        <AIChat />
      </div>
    </ErrorBoundary>
  );
}
export default App;
