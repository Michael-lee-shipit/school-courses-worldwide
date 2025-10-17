// generate a deterministic gradient color from a string (country name)
function countryColor(name) {
  const s = (name || 'unknown').toString();
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360; // hue
  const h2 = (h + 50) % 360;
  return `linear-gradient(90deg, hsl(${h} 65% 45%), hsl(${h2} 70% 55%))`;
}
// Initial sample dataset (expanded). You can replace/extend it by uploading a JSON or CSV using the UI.
let SCHOOLS = [
  { id: 's1', name: 'Greenfield University', location: 'Lagos, Nigeria', courses: [ { code: 'CS101', title: 'Introduction to Computer Science', outline: 'Programming basics, algorithms, data structures, problem solving.' }, { code: 'ENG201', title: 'Technical Writing', outline: 'Report writing, documentation, clarity, research techniques.' } ] },
  { id: 's2', name: 'Riverside Polytechnic', location: 'Port Harcourt, Nigeria', courses: [ { code: 'MECH100', title: 'Mechanics I', outline: 'Statics, dynamics, basic thermodynamics, machine elements.' }, { code: 'EE200', title: 'Circuit Theory', outline: 'AC/DC circuits, network theorems, transient analysis.' } ] },
  { id: 's3', name: 'Northern College of Arts', location: 'Kano, Nigeria', courses: [ { code: 'ART101', title: 'Foundations of Art', outline: 'Color theory, composition, art history overview.' } ] },
  { id: 's4', name: 'University of Lagos', location: 'Lagos, Nigeria', courses: [ { code: 'CSC201', title: 'Data Structures', outline: 'Arrays, linked lists, trees, graphs, complexity.' }, { code: 'MTH101', title: 'Calculus I', outline: 'Limits, derivatives, integrals, applications.' } ] },
  { id: 's5', name: 'Ahmadu Bello University', location: 'Zaria, Nigeria', courses: [ { code: 'BIO110', title: 'General Biology', outline: 'Cell biology, genetics, evolution, ecology.' }, { code: 'CHEM101', title: 'Introductory Chemistry', outline: 'Atomic structure, bonding, stoichiometry.' } ] },
  { id: 's6', name: 'Obafemi Awolowo University', location: 'Ile-Ife, Nigeria', courses: [ { code: 'LAW201', title: 'Constitutional Law', outline: 'Foundations of constitutional frameworks and rights.' }, { code: 'ECO101', title: 'Principles of Economics', outline: 'Supply and demand, market structures, macro basics.' } ] },
  { id: 's7', name: 'University of Ibadan', location: 'Ibadan, Nigeria', courses: [ { code: 'PHY101', title: 'Physics I', outline: 'Kinematics, Newtonian mechanics, energy and momentum.' }, { code: 'ENG102', title: 'English Literature', outline: 'Poetry, prose, literary analysis.' } ] },
  { id: 's8', name: 'Covenant University', location: 'Ota, Nigeria', courses: [ { code: 'ICT101', title: 'Foundations of ICT', outline: 'Computing basics, internet, databases, web development.' }, { code: 'BUS201', title: 'Business Management', outline: 'Management principles, organization, strategy.' } ] },
  { id: 's9', name: 'University of Ghana', location: 'Accra, Ghana', courses: [ { code: 'GEO101', title: 'Human Geography', outline: 'Population, urbanisation, cultural landscapes.' }, { code: 'SOC110', title: 'Intro to Sociology', outline: 'Social structures, institutions, research methods.' } ] },
  { id: 's10', name: 'University of Nairobi', location: 'Nairobi, Kenya', courses: [ { code: 'AGB101', title: 'Introduction to Agronomy', outline: 'Crop science, soils, sustainable practices.' }, { code: 'CS105', title: 'Programming Fundamentals', outline: 'Variables, control flow, basic algorithms.' } ] },
  { id: 's11', name: 'University of Cape Town', location: 'Cape Town, South Africa', courses: [ { code: 'ENV200', title: 'Environmental Science', outline: 'Ecosystems, climate change, conservation strategies.' }, { code: 'STA101', title: 'Introductory Statistics', outline: 'Descriptive stats, probability, hypothesis testing.' } ] },
  { id: 's12', name: 'Makerere University', location: 'Kampala, Uganda', courses: [ { code: 'MED101', title: 'Human Anatomy', outline: 'Anatomical structures, systems, basic clinical correlations.' }, { code: 'PSY100', title: 'Introduction to Psychology', outline: 'Cognitive processes, behavior, research methods.' } ] },
  { id: 's13', name: 'Kwara State Polytechnic', location: 'Ilorin, Nigeria', courses: [ { code: 'ACC101', title: 'Introductory Accounting', outline: 'Financial statements, double-entry bookkeeping.' }, { code: 'IT102', title: 'Computer Applications', outline: 'Office software, basic databases, introduction to HTML/CSS.' } ] }
];

// Added based on user request: Federal Polytechnic Oko, Anambra State
SCHOOLS.push({
  id: 's14',
  name: 'Federal Polytechnic, Oko',
  location: 'Oko, Anambra State, Nigeria',
  courses: [
    { code: 'CSE101', title: 'Programming Fundamentals', outline: 'Intro to programming, variables, control flow, functions.' },
    { code: 'EET101', title: 'Basic Electrical Engineering', outline: 'Circuit basics, Ohm\'s law, introductory circuit analysis.' }
  ]
});

// Add University of Nigeria, Nsukka (UNN)
SCHOOLS.push({
  id: 's15',
  name: 'University of Nigeria, Nsukka (UNN)',
  location: 'Nsukka, Enugu State, Nigeria',
  courses: [
    { code: 'MED201', title: 'Human Anatomy', outline: 'Anatomical systems, clinical correlations.', category: 'Medicine' },
    { code: 'CSE205', title: 'Data Structures', outline: 'Trees, graphs, lists, complexity.', category: 'Applied Science' }
  ]
});

// Add Nnamdi Azikiwe University (UNIZIK)
SCHOOLS.push({
  id: 's16',
  name: 'Nnamdi Azikiwe University (UNIZIK)',
  location: 'Awka, Anambra State, Nigeria',
  courses: [
    { code: 'PHY201', title: 'Physics II', outline: 'Electricity, magnetism, optics.', category: 'Science' },
    { code: 'ACC201', title: 'Financial Accounting II', outline: 'Intermediate accounting topics.', category: 'Commercial' }
  ]
});

// Fuse.js setup: we will search across school name, location, and within each course's code/title/outline.
let fuse = null;
let currentResults = [];
let fuseSchools = null; // for matching uploaded rows to existing schools

function buildFuse() {
  const list = [];
  for (const s of SCHOOLS) {
    const schoolObj = {
      id: s.id,
      name: s.name,
      location: s.location,
      courses: s.courses
    };
    // For searching, also include a combined string for each course
    for (const c of s.courses) {
      list.push({ school: schoolObj, course: c, combined: `${s.name} ${s.location} ${c.code} ${c.title} ${c.outline}` });
    }
  }

  fuse = new Fuse(list, {
    keys: ['combined'],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true
  });
}

function buildSchoolFuse() {
  const list = SCHOOLS.map(s => ({ id: s.id, name: s.name, location: s.location }));
  fuseSchools = new Fuse(list, { keys: ['name', 'location'], threshold: 0.4, includeScore: true });
}

function populateCountryFilter() {
  const sel = document.getElementById('countryFilter');
  // extract country part after comma if present
  const countries = new Set();
  for (const s of SCHOOLS) {
    const parts = s.location.split(',').map(p => p.trim());
    const country = parts.length > 1 ? parts[parts.length - 1] : s.location;
    countries.add(country);
  }
  // clear and fill
  sel.innerHTML = '<option value="">All</option>' + Array.from(countries).sort().map(c => `<option value="${c}">${c}</option>`).join('');
  // also populate category filter based on existing course categories
  try {
    const catSel = document.getElementById('categoryFilter');
    if (catSel) {
      const cats = new Set();
      for (const s of SCHOOLS) for (const c of (s.courses || [])) cats.add(c.category || 'General');
      const opts = ['<option value="">All</option>'].concat(Array.from(cats).sort().map(x => `<option value="${x}">${x}</option>`));
      catSel.innerHTML = opts.join('');
    }
  } catch (e) { console.warn('populateCategoryFilter failed', e); }
}

function doFuseSearch(query, countryFilter, categoryFilter) {
  if (!fuse) buildFuse();
  const q = (query || '').trim();
  let hits = [];
  if (!q) {
    // return all grouped by school
    hits = [];
    for (const s of SCHOOLS) for (const c of s.courses) hits.push({ item: { school: s, course: c }, score: 0 });
  } else {
    hits = fuse.search(q);
  }

  // group by school and optionally filter by country
  const bySchool = new Map();
  for (const h of hits) {
    const item = h.item;
    const school = item.school;
    const parts = school.location.split(',').map(p => p.trim());
    const country = parts.length > 1 ? parts[parts.length - 1] : school.location;
    if (countryFilter && countryFilter !== country) continue;
    const course = item.course;
    // categoryFilter compares against course.category or 'General'
    if (categoryFilter && categoryFilter !== (course.category || 'General')) continue;
    if (!bySchool.has(school.id)) bySchool.set(school.id, { school, matches: [] });
    bySchool.get(school.id).matches.push(course);
  }

  const results = Array.from(bySchool.values());
  currentResults = results;
  return results;
}

// pagination and rendering
let currentPage = 1;
function renderPage(pageSize) {
  const results = currentResults;
  const container = document.getElementById('results');
  container.innerHTML = '';
  if (!results || results.length === 0) { container.innerHTML = '<p style="opacity:.8">No results found.</p>'; return; }

  const start = (currentPage - 1) * pageSize;
  const paged = results.slice(start, start + pageSize);

  for (const r of paged) {
  const card = document.createElement('article'); card.className = 'card';
  const h = document.createElement('h3');
  // extract country from location
  const parts = (r.school.location || '').split(',').map(p => p.trim());
  const country = parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
  const badge = document.createElement('span'); badge.className = 'country-badge'; badge.textContent = country || 'Unknown'; badge.style.background = countryColor(country);
  h.innerHTML = `${escapeHtml(r.school.name)}`;
  h.appendChild(badge);
  h.innerHTML += ` <span style="font-size:.8rem; color:#cfc0e8"> — ${escapeHtml(r.school.location)}</span>`;
  card.appendChild(h);
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `${r.school.courses.length} course(s)`; card.appendChild(meta);
    const outline = document.createElement('div'); outline.className = 'outline';
    // group matches by category
    const groups = new Map();
    for (const c of r.matches) {
      const cat = c.category || 'General';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(c);
    }
    for (const [cat, items] of groups) {
      const catH = document.createElement('h4'); catH.textContent = cat; catH.style.margin = '6px 0 6px'; catH.className = 'highlight';
      outline.appendChild(catH);
      for (const c of items) {
        const unit = document.createElement('div'); unit.style.marginBottom = '8px';
        unit.innerHTML = `<strong>${escapeHtml(c.code)}</strong> — <em>${escapeHtml(c.title)}</em><div style="margin-top:6px">${escapeHtml(c.outline)}</div>`;
        outline.appendChild(unit);
      }
    }
    card.appendChild(outline);
    container.appendChild(card);
  }

  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage <= 1;
  document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// file import helpers (JSON or CSV)
function parseAndReplace(data) {
  // Expecting an array of schools or rows with school/course columns
  if (!Array.isArray(data)) return false;
  // If objects look like { id, name, location, courses }
  if (data.length > 0 && data[0].courses) {
    SCHOOLS = data;
    fuse = null; currentResults = []; currentPage = 1; buildFuse(); populateCountryFilter(); return true;
  }

  // Otherwise try to transform CSV-like rows into schools grouped by name+location
  // We'll attempt to match rows to existing schools (fuzzy) and attach courses when possible.
  buildSchoolFuse();
  const map = new Map();
  for (const row of data) {
    const name = row.school || row.name || row.School || row.SchoolName;
    const location = row.location || row.Location || '';
    const code = row.code || row.courseCode || row.Code || '';
    const title = row.title || row.courseTitle || row.Title || '';
    const outline = row.outline || row.courseOutline || row.Outline || '';
    const category = row.category || row.Category || '';
    if (!name) continue;

    // try to find best existing school match
    let matchedSchoolId = null;
    if (fuseSchools && name) {
      const searchText = (name + ' ' + location).trim();
      const hits = fuseSchools.search(searchText, { limit: 1 });
      if (hits && hits.length > 0) {
        const hit = hits[0];
        if (hit.score !== undefined && hit.score <= 0.4) {
          matchedSchoolId = hit.item.id;
        }
      }
    }

    if (matchedSchoolId) {
      // attach to existing SCHOOLS entry
      const s = SCHOOLS.find(x => x.id === matchedSchoolId);
      if (s) {
        s.courses.push({ code, title, outline, category: category || undefined });
        continue;
      }
    }

    // otherwise group into a new school record in map
    const key = `${name}||${location}`;
    if (!map.has(key)) map.set(key, { id: 'u' + map.size, name, location, courses: [] });
    map.get(key).courses.push({ code, title, outline, category: category || undefined });
  }
  // append new schools from map to existing SCHOOLS
  const newSchools = Array.from(map.values());
  if (newSchools.length) SCHOOLS = SCHOOLS.concat(newSchools);
  fuse = null; currentResults = []; currentPage = 1; buildFuse(); populateCountryFilter(); return true;
}

// escape utils reused from earlier
function escapeHtml(str) { return (str || '').replace(/[&<>\"]/g, function (s) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[s]; }); }

// Wire up UI events
// Unified UI wiring
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const countrySel = document.getElementById('countryFilter');
  const pageSizeSel = document.getElementById('pageSize');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const fileInput = document.getElementById('fileInput');
  const loadFileBtn = document.getElementById('loadFileBtn');
  const useSampleBtn = document.getElementById('useSampleBtn');
  const fetchWebBtn = document.getElementById('fetchWebBtn');
  const fetchStatus = document.getElementById('fetchStatus');
  const exportBtn = document.getElementById('exportBtn');
  const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');

  buildFuse(); populateCountryFilter();

  function refresh() {
    const q = input.value || '';
    const country = countrySel.value || '';
    const category = (document.getElementById('categoryFilter') && document.getElementById('categoryFilter').value) || '';
    const pageSize = parseInt(pageSizeSel.value || '6', 10);
    currentPage = 1;
    doFuseSearch(q, country, category);
    renderPage(pageSize);
  }

  input.addEventListener('input', () => refresh());
  clearBtn.addEventListener('click', () => { input.value = ''; refresh(); });
  countrySel.addEventListener('change', () => refresh());
  pageSizeSel.addEventListener('change', () => { currentPage = 1; renderPage(parseInt(pageSizeSel.value, 10)); });

  prevBtn.addEventListener('click', () => { currentPage = Math.max(1, currentPage - 1); renderPage(parseInt(pageSizeSel.value, 10)); });
  nextBtn.addEventListener('click', () => { currentPage++; renderPage(parseInt(pageSizeSel.value, 10)); });

  loadFileBtn.addEventListener('click', () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) { alert('Select a JSON or CSV file first'); return; }
    const name = f.name.toLowerCase();
    if (name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = e => { try { const data = JSON.parse(e.target.result); if (parseAndReplace(data)) { refresh(); alert('Loaded JSON data'); } else alert('JSON format not recognized'); } catch (err) { alert('Invalid JSON: ' + err.message); } };
      reader.readAsText(f);
    } else {
      Papa.parse(f, { header: true, skipEmptyLines: true, complete: function(results) { if (parseAndReplace(results.data)) { refresh(); alert('Loaded CSV data'); } else alert('CSV format not recognized'); } });
    }
  });

  useSampleBtn.addEventListener('click', () => { location.reload(); });

  // Export current SCHOOLS dataset as JSON
  if (exportBtn) exportBtn.addEventListener('click', () => {
    try {
      const dataStr = JSON.stringify(SCHOOLS, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schools_dataset.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  });

  // Download CSV/JSON template to help user prepare real course outlines
  if (downloadTemplateBtn) downloadTemplateBtn.addEventListener('click', () => {
    const sampleRows = [
      { school: 'University of Nigeria, Nsukka', location: 'Nsukka, Enugu State, Nigeria', code: 'CSE101', title: 'Intro to Programming', outline: 'Basics of programming using Python.', category: 'Applied Science' },
      { school: 'Nnamdi Azikiwe University', location: 'Awka, Anambra State, Nigeria', code: 'ACC101', title: 'Introductory Accounting', outline: 'Financial accounting basics.', category: 'Commercial' }
    ];

    // Build CSV
    const headers = ['school', 'location', 'code', 'title', 'outline', 'category'];
    const csvLines = [headers.join(',')];
    for (const r of sampleRows) {
      const line = headers.map(h => '"' + (r[h] || '').replace(/"/g, '""') + '"').join(',');
      csvLines.push(line);
    }
    const csv = csvLines.join('\n');

    // Offer both CSV and JSON via a small menu
    const choice = prompt('Type "csv" to download CSV template or "json" to download JSON template. Cancel to abort. (csv/json)');
    if (!choice) return;
    if (choice.toLowerCase() === 'csv') {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'courses_template.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else if (choice.toLowerCase() === 'json') {
      const blob = new Blob([JSON.stringify(sampleRows, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'courses_template.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
      alert('Unknown choice. Type either csv or json.');
    }
  });

  const attachStdBtn = document.getElementById('attachStdBtn');
  // standard course bundles with categories (faculty/department)
  const STANDARD_BUNDLES = {
    'Applied Science': [
      { code: 'APS101', title: 'Applied Science I', outline: 'Laboratory methods, measurement, applied math.', category: 'Applied Science' },
      { code: 'MTH101', title: 'Calculus I', outline: 'Limits, derivatives, integrals.', category: 'Applied Science' },
      { code: 'PHY101', title: 'Physics I', outline: 'Mechanics, kinematics, energy, momentum.', category: 'Applied Science' }
    ],
    'Medicine': [
      { code: 'MED101', title: 'Human Anatomy', outline: 'Anatomical structures, systems overview.', category: 'Medicine' },
      { code: 'MED102', title: 'Physiology I', outline: 'Cell physiology, basic organ systems.', category: 'Medicine' }
    ],
    'Science': [
      { code: 'CHEM101', title: 'Chemistry I', outline: 'Atomic structure, bonding, stoichiometry.', category: 'Science' },
      { code: 'BIO101', title: 'Biology I', outline: 'Cell structure, genetics basics, ecology.', category: 'Science' }
    ],
    'Arts': [
      { code: 'ENG101', title: 'English Studies I', outline: 'Literary analysis, composition, critical reading.', category: 'Arts' },
      { code: 'HIS101', title: 'Introduction to History', outline: 'Historical methods, major world events overview.', category: 'Arts' }
    ],
    'Commercial': [
      { code: 'ACC101', title: 'Accounting I', outline: 'Basic bookkeeping, financial statements.', category: 'Commercial' },
      { code: 'BUS101', title: 'Business Principles', outline: 'Management, marketing basics.', category: 'Commercial' }
    ],
    'Engineering': [
      { code: 'ENGR101', title: 'Engineering Drawing', outline: 'Technical drawing, CAD basics.', category: 'Engineering' },
      { code: 'MECH100', title: 'Mechanics I', outline: 'Statics, dynamics fundamentals.', category: 'Engineering' }
    ]
  };

  // Auto-attach standard bundles to all schools on first load (idempotent).
  // This populates every school with the generic course set so the UI shows them immediately.
  try {
    if (!window.__stdBundlesApplied) {
      const allStd = [];
      for (const arr of Object.values(STANDARD_BUNDLES)) allStd.push(...arr);
      for (const s of SCHOOLS) {
        const existingCodes = new Set((s.courses || []).map(c => c.code));
        for (const c of allStd) {
          if (!existingCodes.has(c.code)) {
            s.courses = s.courses || [];
            s.courses.push({ code: c.code, title: c.title, outline: c.outline, category: c.category || 'General' });
          }
        }
      }
      window.__stdBundlesApplied = true;
      fuse = null; buildFuse(); populateCountryFilter();
    }
  } catch (e) {
    console.error('Auto-attach bundles failed', e);
  }

  attachStdBtn.addEventListener('click', () => {
    const choice = prompt('Type category to attach to schools (case-sensitive) from: ' + Object.keys(STANDARD_BUNDLES).join(', ') + '\nOr type "all" to attach all bundles, or "country:<CountryName>" to attach only to that country.');
    if (!choice) return;
    let toAttach = [];
    let targetCountry = null;
    if (choice.startsWith('country:')) {
      targetCountry = choice.split(':').slice(1).join(':').trim();
      // fallback: if empty, abort
      if (!targetCountry) { alert('Invalid country syntax. Use country:CountryName'); return; }
    }

    if (choice === 'all') {
      for (const arr of Object.values(STANDARD_BUNDLES)) toAttach.push(...arr);
    } else if (STANDARD_BUNDLES[choice]) {
      toAttach.push(...STANDARD_BUNDLES[choice]);
    } else if (choice.startsWith('country:')) {
      // attach all bundles but only to specified country
      for (const arr of Object.values(STANDARD_BUNDLES)) toAttach.push(...arr);
    } else {
      alert('Invalid choice. Use one of the categories or "all" or "country:CountryName".');
      return;
    }

    // Attach to targeted schools (or all) and avoid duplicate course codes
    for (const s of SCHOOLS) {
      if (targetCountry) {
        const parts = s.location.split(',').map(p => p.trim());
        const country = parts.length > 1 ? parts[parts.length - 1] : s.location;
        if ((country || '').toLowerCase() !== targetCountry.toLowerCase()) continue;
      }
      const existingCodes = new Set(s.courses.map(c => c.code));
      for (const c of toAttach) {
        if (!existingCodes.has(c.code)) s.courses.push({ code: c.code, title: c.title, outline: c.outline, category: c.category || 'General' });
      }
    }

    fuse = null; buildFuse(); populateCountryFilter();
    refresh();
    alert('Attached selected bundles.');
  });

  // fetch from Hipolabs universities API by country
  fetchWebBtn.addEventListener('click', async () => {
    const typed = (document.getElementById('countryInput') && document.getElementById('countryInput').value) || '';
    const country = typed.trim() || countrySel.value;
    if (!country) { alert('Select or type a country first'); return; }
    try {
      fetchStatus.textContent = 'Fetching...';
      fetchWebBtn.disabled = true;
      const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
      const resp = await fetch(url);
      const data = await resp.json();
      // map to SCHOOLS format (no course data)
  const mapped = data.map((u, idx) => ({ id: 'web' + idx + '_' + country, name: u.name, location: `${u.name.includes(country) ? u.name : (u.name + ', ' + country)}`, courses: [] }));
      // merge with existing SCHOOLS
      SCHOOLS = mapped.concat(SCHOOLS);
      fuse = null; buildFuse(); populateCountryFilter();
      refresh();
      fetchStatus.textContent = `Imported ${mapped.length} universities for ${country}`;
    } catch (err) {
      console.error(err); alert('Failed to fetch: ' + err.message);
      fetchStatus.textContent = 'Fetch failed';
    } finally {
      fetchWebBtn.disabled = false;
      setTimeout(() => { fetchStatus.textContent = ''; }, 5000);
    }
  });

  // Import all countries (experimental)
  const importAllBtn = document.getElementById('importAllBtn');
  const importProgress = document.getElementById('importProgress');
  let importCancel = false;

  importAllBtn.addEventListener('click', async () => {
    if (!confirm('This will fetch universities for many countries. It may take several minutes and use significant memory. Continue?')) return;
    importCancel = false;
    importAllBtn.disabled = true;
    importProgress.textContent = 'Starting...';

    // small list of countries (can expand) - using many common country names
    const countries = [
      'Nigeria','United States','United Kingdom','India','Canada','Australia','Kenya','Ghana','South Africa','Egypt','Pakistan','Bangladesh','China','Japan','Brazil','France','Germany','Italy','Spain','Mexico'
    ];

    let totalImported = 0;
    for (const country of countries) {
      if (importCancel) break;
      importProgress.textContent = `Fetching ${country}...`;
      try {
        const url = `https://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const mapped = data.map((u, idx) => ({ id: 'web_' + country + '_' + idx, name: u.name, location: `${u.name.includes(country) ? u.name : (u.name + ', ' + country)}`, courses: [] }));
        SCHOOLS = SCHOOLS.concat(mapped);
        totalImported += mapped.length;
        fuse = null; buildFuse(); populateCountryFilter();
        importProgress.textContent = `Imported ${mapped.length} for ${country} (total ${totalImported})`;
        // brief pause to avoid overwhelming API
        await new Promise(r => setTimeout(r, 400));
      } catch (err) {
        console.error('Import failed for', country, err);
        importProgress.textContent = `Failed ${country}`;
      }
    }

    importProgress.textContent = importCancel ? 'Cancelled' : `Done: total imported ${totalImported}`;
    importAllBtn.disabled = false;
    refresh();
  });


  // initial search render
  doFuseSearch('', '', '');
  renderPage(parseInt(pageSizeSel.value || '6', 10));
});


// Small utility: sanitize and prepare string for search
function norm(s) {
  return (s || '').toString().toLowerCase();
}

// Simple search: matches query tokens against school name, location, course code, title, and outline.
function searchSchools(query) {
  const q = norm(query).trim();
  if (!q) return SCHOOLS.map(s => ({ school: s, matches: [] }));

  const tokens = q.split(/\s+/).filter(Boolean);

  const results = [];
  for (const s of SCHOOLS) {
    const schoolText = [s.name, s.location].map(norm).join(' ');
    const courseTexts = s.courses.map(c => [c.code, c.title, c.outline].join(' '));

    // score: number of token hits across school and courses
    let score = 0;
    const matchedCourses = [];

    for (const c of s.courses) {
      const full = norm([s.name, s.location, c.code, c.title, c.outline].join(' '));
      let hits = 0;
      for (const t of tokens) if (full.includes(t)) hits++;
      if (hits > 0) {
        matchedCourses.push({ course: c, hits });
        score += hits + 1; // weight course hits slightly higher
      }
    }

    // school-level matches
    for (const t of tokens) if (schoolText.includes(t)) score += 1;

    if (score > 0) results.push({ school: s, matches: matchedCourses, score });
  }

  // sort by score desc
  return results.sort((a, b) => b.score - a.score);
}

// Highlight occurrences of tokens in a text using <mark>
function highlight(text, tokens) {
  if (!tokens || tokens.length === 0) return escapeHtml(text);
  let out = escapeHtml(text);
  for (const t of tokens) {
    if (!t) continue;
    const re = new RegExp('(' + escapeRegExp(t) + ')', 'ig');
    out = out.replace(re, '<mark>$1</mark>');
  }
  return out;
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"]+/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[s];
  });
}

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Render results into the DOM
function renderResults(results, query) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  const tokens = norm(query).split(/\s+/).filter(Boolean);

  if (!results || results.length === 0) {
    container.innerHTML = '<p style="opacity:.8">No results. Try different keywords or course codes (e.g. "CS101").</p>';
    return;
  }

  for (const r of results) {
    const card = document.createElement('article');
    card.className = 'card';

    const h = document.createElement('h3');
    h.innerHTML = highlight(r.school.name, tokens) + ` <span style="font-size:.8rem; color:#cfc0e8"> — ${escapeHtml(r.school.location)}</span>`;
    card.appendChild(h);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${r.school.courses.length} course(s)`;
    card.appendChild(meta);

    // if matched courses exist, show them first
    const outline = document.createElement('div');
    outline.className = 'outline';

    const list = document.createElement('div');
    for (const m of r.matches.length ? r.matches : r.school.courses.map(c => ({ course: c }))) {
      const c = m.course;
      const unit = document.createElement('div');
      unit.style.marginBottom = '8px';
      unit.innerHTML = `<strong>${escapeHtml(c.code)}</strong> — <em>${highlight(c.title, tokens)}</em><div style="margin-top:6px">${highlight(c.outline, tokens)}</div>`;
      list.appendChild(unit);
    }

    outline.appendChild(list);
    card.appendChild(outline);

    container.appendChild(card);
  }
}

// Wire up UI
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');

  function doSearch() {
    const q = input.value || '';
    const res = searchSchools(q);
    renderResults(res, q);
  }

  input.addEventListener('input', () => doSearch());
  clearBtn.addEventListener('click', () => { input.value = ''; input.focus(); doSearch(); });

  // initial render: show all
  renderResults(SCHOOLS.map(s => ({ school: s, matches: [] })), '');
});
