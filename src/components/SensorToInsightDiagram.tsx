import { Shield, Lock, Brain, MessageSquare, Cpu, Factory, Gauge, Thermometer, Settings, Radio, Wifi, Cable, Satellite } from "lucide-react";

export const SensorToInsightDiagram = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-background p-4 md:p-8 rounded-lg">
      {/* Top Layer - Paapeli Cloud Platform */}
      <div className="mb-6">
        <div className="flex items-center gap-4 bg-primary/10 border-2 border-primary rounded-2xl px-6 py-5 shadow-lg">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Cpu className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Paapeli AIoT Cloud Platform</h3>
            <p className="text-sm text-muted-foreground">AI-Powered Industrial IoT for SMEs</p>
          </div>
        </div>
      </div>

      {/* Flow Arrow Down */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <div className="h-6 w-0.5 bg-primary/50"></div>
          <div className="text-primary text-lg">▼</div>
        </div>
      </div>

      {/* AI & Security Features - First Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">AI Recommendations</h4>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">AI Co-Pilot</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">DDoS Protection</h4>
          </div>
        </div>
      </div>

      {/* AI & Security Features - Second Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Lock className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">E2E Encryption</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Factory className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">Millions of Devices</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Settings className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">OTA Updates</h4>
          </div>
        </div>
      </div>

      {/* Flow Arrow Down */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <div className="h-6 w-0.5 bg-secondary/50"></div>
          <div className="text-secondary text-lg">▼</div>
        </div>
      </div>

      {/* Connectivity Layer */}
      <div className="mb-6">
        <div className="flex items-center gap-4 bg-secondary/10 border-2 border-secondary rounded-2xl px-6 py-5 shadow-lg">
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Radio className="h-7 w-7 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Industrial IoT Connectivity</h3>
            <p className="text-sm text-muted-foreground">MQTT, HTTP, Modbus, OPC-UA</p>
          </div>
        </div>
      </div>

      {/* Connection Types */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
        <div className="flex flex-col items-center gap-1 p-2 md:p-3 bg-muted/30 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Satellite className="h-5 w-5 text-primary" />
          </div>
          <p className="font-semibold text-xs md:text-sm text-foreground">4G/5G</p>
        </div>
        
        <div className="flex flex-col items-center gap-1 p-2 md:p-3 bg-muted/30 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wifi className="h-5 w-5 text-primary" />
          </div>
          <p className="font-semibold text-xs md:text-sm text-foreground">WiFi</p>
        </div>

        <div className="flex flex-col items-center gap-1 p-2 md:p-3 bg-muted/30 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Cable className="h-5 w-5 text-primary" />
          </div>
          <p className="font-semibold text-xs md:text-sm text-foreground">Ethernet</p>
        </div>

        <div className="flex flex-col items-center gap-1 p-2 md:p-3 bg-muted/30 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Radio className="h-5 w-5 text-primary" />
          </div>
          <p className="font-semibold text-xs md:text-sm text-foreground">LoRaWAN</p>
        </div>
      </div>

      {/* Flow Arrows Up */}
      <div className="flex justify-around mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-muted-foreground text-lg">▲</div>
            <div className="h-4 w-0.5 bg-muted-foreground/50"></div>
          </div>
        ))}
      </div>

      {/* Industrial Sensors & Equipment */}
      <div className="mb-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-4">Industrial Sensors & Equipment</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-foreground">PLCs</p>
              <p className="text-xs text-muted-foreground">Controllers</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Thermometer className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-foreground">Sensors</p>
              <p className="text-xs text-muted-foreground">Temp, Humidity</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Factory className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-foreground">Machinery</p>
              <p className="text-xs text-muted-foreground">Production</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl border border-border">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Settings className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-foreground">Actuators</p>
              <p className="text-xs text-muted-foreground">Control</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
