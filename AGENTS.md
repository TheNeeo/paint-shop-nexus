## Layout
- AppLayout uses a fluid, full-width content area and a non-shrinking sidebar with matching expanded/collapsed widths; avoid viewport-based container caps so standalone desktop tabs use the available space.
- Mobile navigation overlays the page and reserves space for its trigger; desktop collapse retains an icon rail so navigation remains accessible.
- Share expanded sidebar sizing through a single CSS layout variable, and stretch paired dashboard widgets to matching row heights; this keeps navigation and dashboard proportions coherent without browser zoom or viewport-scaled fonts.