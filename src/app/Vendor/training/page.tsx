// app/vendor/training/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TrainingModule {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  content: string[];
}

export default function VendorTraining() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('trainingProgress');
    if (savedProgress) {
      setModules(JSON.parse(savedProgress));
    }
  }, []);

  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: 1,
      title: 'Creating Effective Ads',
      duration: '15 min',
      completed: false,
      content: [
        'Use high-quality images',
        'Write clear call-to-actions',
        'Highlight unique selling points',
      ],
    },
    {
      id: 2,
      title: 'Targeting Your Audience',
      duration: '10 min',
      completed: false,
      content: [
        'Define your ideal customer',
        'Select appropriate locations',
        'Choose optimal times',
      ],
    },
  ]);

  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  //Add progress calculation
  const progress = Math.round(
    modules.filter((m) => m.completed).length / modules.length
  );

  const completeModule = (id: number) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
    const updatedModules = modules.map((m) =>
      m.id === id ? { ...m, completed: true } : m
    );
    setModules(updatedModules);
    localStorage.setItem('trainingProgress', JSON.stringify(updatedModules));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Vendor Training</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Vendor Training</h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full p-2 border rounded-lg mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Module list with filter */}
          {modules
            .filter((module) =>
              module.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((module) => (
              <div
                key={module.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  module.completed ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveModule(module)}
              >
                <h3 className="font-semibold">{module.title}</h3>
                <p className="text-sm text-gray-500">{module.duration}</p>
                {module.completed && (
                  <span className="text-green-500 text-sm">✓ Completed</span>
                )}
              </div>
            ))}
        </div>

        <div className="md:col-span-2">
          {activeModule ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {activeModule.title}
              </h2>
              <ul className="space-y-3 mb-6">
                {activeModule.content.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span> {item}
                  </li>
                ))}
              </ul>
              {!activeModule.completed && (
                <button
                  onClick={() => completeModule(activeModule.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 text-center rounded-lg">
              <p>Select a training module to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
