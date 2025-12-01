import { Shield, Lock, Brain, MessageSquare, Cpu } from "lucide-react";

export const SensorToInsightDiagram = () => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-background p-8 rounded-lg">
      {/* Top Layer - IoT Services */}
      <div className="mb-8">
        <div className="flex items-center gap-4 bg-primary/10 border-2 border-primary rounded-full px-8 py-6 shadow-lg">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Cpu className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">IoT Services Enablement</h3>
            <p className="text-muted-foreground">(APIs, SDKs)</p>
          </div>
        </div>
      </div>

      {/* Middle Layer - Management Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center gap-3 bg-card border-2 border-border rounded-3xl px-6 py-4 shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">DDoS Protection</h4>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-card border-2 border-border rounded-3xl px-6 py-4 shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">E2E Encryption</h4>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card border-2 border-border rounded-3xl px-6 py-4 shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Cpu className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Manage Millions</h4>
            <p className="text-xs text-muted-foreground">of Devices</p>
          </div>
        </div>
      </div>

      {/* Second Row of Management Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 bg-card border-2 border-border rounded-3xl px-6 py-4 shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">AI Recommendation</h4>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-card border-2 border-border rounded-3xl px-6 py-4 shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">AI Co-Pilot</h4>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card border-2 border-border rounded-3xl px-6 py-4 shadow-md hover:shadow-lg transition-all opacity-0">
          {/* Placeholder for alignment */}
        </div>
      </div>

      {/* Bottom Layer - IoT Connectivity */}
      <div className="mb-4">
        <div className="flex items-center gap-4 bg-secondary/10 border-2 border-secondary rounded-full px-8 py-6 shadow-lg">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <svg className="h-8 w-8 text-secondary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M6 12H1m11 0h6"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">IoT Connectivity</h3>
            <p className="text-muted-foreground">(Standard - IoT Gateway)</p>
          </div>
        </div>
      </div>

      {/* Connection Methods */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">📱</div>
          <div className="text-center">
            <p className="font-bold text-foreground">4G</p>
            <p className="text-sm text-muted-foreground">Cellular</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">📶</div>
          <div className="text-center">
            <p className="font-bold text-foreground">WLAN</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">🔌</div>
          <div className="text-center">
            <p className="font-bold text-foreground">Ethernet</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">📡</div>
          <div className="text-center">
            <p className="font-bold text-foreground">WPAN</p>
          </div>
        </div>
      </div>

      {/* Connecting Arrows */}
      <div className="flex justify-around mt-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-8 w-0.5 bg-border"></div>
            <div className="text-primary text-xl">↑</div>
          </div>
        ))}
      </div>
    </div>
  );
};
