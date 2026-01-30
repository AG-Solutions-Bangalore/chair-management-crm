import { useTheme } from "@/lib/theme-context";
import { useSelector } from "react-redux";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-2  mx-auto ">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Appearance
          </h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Theme Color
            </p>
            <div className="flex gap-3 flex-wrap">
              {["default", "yellow", "green", "purple", "teal", "gray"].map(
                (color) => {
                  const colorsMap = {
                    default: "bg-green-900",
                    yellow: "bg-yellow-500",
                    green: "bg-green-600",
                    purple: "bg-purple-600",
                    teal: "bg-teal-600",
                    gray: "bg-gray-600",
                  };
                  const isActive = theme === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setTheme(color)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                                            ${colorsMap[color]} 
                                            ${
                                              isActive
                                                ? "shadow-lg ring-2 ring-offset-2 ring-primary scale-110"
                                                : "opacity-80 hover:opacity-100 hover:scale-105"
                                            }`}
                      title={`Set ${color} theme`}
                    >
                      {isActive && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                },
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Current theme:{" "}
              <span className="font-medium capitalize">{theme}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
