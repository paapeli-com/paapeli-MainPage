# TODO

This file tracks all TODO items for the Paapeli IoT Platform codebase.

## Active TODOs

### OTA Updates Implementation
- [ ] Implement device status endpoint for OTA updates
  - Location: src/pages/panel/OTA.tsx:119
  - Details: Currently using placeholder, need proper API endpoint to get all device firmware statuses
  - Effort: 2-3 hours

- [ ] Add stages configuration for OTA campaigns
  - Location: src/pages/panel/OTA.tsx:322
  - Details: UI placeholder exists, need to implement the stages configuration form
  - Effort: 4-5 hours

### Alerts API Implementation
- [ ] Implement alerts API for dashboard
  - Location: src/pages/panel/PanelHome.tsx:57
  - Details: Currently hardcoded to 0, need to implement proper alerts count API
  - Effort: 2-3 hours

## Completed TODOs

- [x] Implement DevCenter page with API health, endpoints, and documentation links (2026-01-10)
- [x] Implement DeviceGroup management with CRUD operations (2026-01-10)
- [x] Implement Members management with project-based access (2026-01-10)
- [x] Implement OTA updates management interface (2026-01-10)
- [x] Update API calls from collectors to gateways (2026-01-10)
- [x] Add comprehensive tests for new components (2026-01-10)
- [x] Copy and adapt AI assistant instructions (2026-01-10)
- [x] Perform comprehensive codebase cleanup following Paapeli guidelines (2026-01-10)