/**
 * HealthOS Production Mock Hospitals Dataset
 * Comprehensive dataset with real-time capacity states, clinical specs, emergency triage levels, and doctor rosters.
 */

export const MOCK_HOSPITALS = [
  {
    id: 'hosp-001',
    name: 'Metropolitan General Hospital & Trauma Center',
    licenseNumber: 'LIC-NY-99482',
    type: 'Trauma Center Level 1',
    rating: 4.9,
    reviewsCount: 342,
    distanceKm: 2.4,
    address: '450 Healthcare Blvd, Metro Central',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    emergencyHotline: '1-800-METRO-911',
    phone: '+1 (555) 019-2831',
    email: 'intake@metrogeneral.healthos.org',
    operatingHours: '24/7 Open',
    emergencyCapable: true,
    totalBeds: 350,
    availableBeds: 48,
    totalIcu: 60,
    availableIcu: 12,
    ventilatorsAvailable: 8,
    specializations: ['Emergency & Trauma', 'Cardiology', 'Neurology', 'Orthopedics', 'ICU Care'],
    departments: [
      { name: 'Emergency Triage', status: 'Active Intakes', waitTimeMin: 12 },
      { name: 'Cardiovascular Care', status: 'Operational', waitTimeMin: 25 },
      { name: 'Neurosurgery Unit', status: 'Operational', waitTimeMin: 40 },
      { name: 'Pediatrics ER', status: 'Active Intakes', waitTimeMin: 15 },
    ],
    doctors: [
      { id: 'doc-101', name: 'Dr. Johan Henry', title: 'Senior Cardiologist', specialty: 'Cardiology', experienceYears: 14, availability: 'Available Today', avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
      { id: 'doc-102', name: 'Dr. David Cooper', title: 'Chief Neurologist', specialty: 'Neurology', experienceYears: 18, availability: 'Available Today', avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
      { id: 'doc-103', name: 'Dr. Sarah Lin', title: 'Emergency Physician', specialty: 'Emergency & Trauma', experienceYears: 10, availability: 'On Shift Now', avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'hosp-002',
    name: 'St. Jude Children & Family Specialty Hospital',
    licenseNumber: 'LIC-NY-88120',
    type: 'Pediatric & Family Specialty',
    rating: 4.8,
    reviewsCount: 215,
    distanceKm: 4.1,
    address: '128 Hope Way, East District',
    city: 'New York',
    latitude: 40.7306,
    longitude: -73.9352,
    emergencyHotline: '1-800-STJUDE-ER',
    phone: '+1 (555) 392-1049',
    email: 'contact@stjude-family.healthos.org',
    operatingHours: '24/7 Open',
    emergencyCapable: true,
    totalBeds: 210,
    availableBeds: 32,
    totalIcu: 30,
    availableIcu: 7,
    ventilatorsAvailable: 5,
    specializations: ['Pediatrics', 'Neonatal ICU', 'Oncology', 'Maternity', 'Genetics'],
    departments: [
      { name: 'Neonatal Intensive Care (NICU)', status: 'Operational', waitTimeMin: 10 },
      { name: 'Pediatric Oncology', status: 'Operational', waitTimeMin: 30 },
      { name: 'Maternal & Fetal Medicine', status: 'Operational', waitTimeMin: 20 },
    ],
    doctors: [
      { id: 'doc-201', name: 'Dr. Esther Howard', title: 'Pediatric Specialist', specialty: 'Pediatrics', experienceYears: 12, availability: 'Available Today', avatarUrl: 'https://images.unsplash.com/photo-1594824813566-8185b9b8b0e7?w=150&auto=format&fit=crop&q=80' },
      { id: 'doc-202', name: 'Dr. Marcus Vance', title: 'Neonatologist', specialty: 'Neonatal ICU', experienceYears: 16, availability: 'Available Tomorrow', avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'hosp-003',
    name: 'Apex Cardiovascular Institute & Medical Center',
    licenseNumber: 'LIC-NY-77319',
    type: 'Cardiology Specialty Center',
    rating: 4.9,
    reviewsCount: 189,
    distanceKm: 6.8,
    address: '88 Apex Ridge, Medical Park',
    city: 'New York',
    latitude: 40.7589,
    longitude: -73.9851,
    emergencyHotline: '1-888-APEX-HEART',
    phone: '+1 (555) 829-4011',
    email: 'care@apexheart.healthos.org',
    operatingHours: '24/7 Open',
    emergencyCapable: true,
    totalBeds: 180,
    availableBeds: 19,
    totalIcu: 40,
    availableIcu: 6,
    ventilatorsAvailable: 4,
    specializations: ['Interventional Cardiology', 'Cardiac Surgery', 'Vascular Medicine', 'Heart Failure ICU'],
    departments: [
      { name: 'Cardiac Cath Lab', status: 'High Volume', waitTimeMin: 18 },
      { name: 'Coronary Care Unit (CCU)', status: 'Operational', waitTimeMin: 15 },
    ],
    doctors: [
      { id: 'doc-301', name: 'Dr. Robert Chen', title: 'Chief Cardiac Surgeon', specialty: 'Cardiac Surgery', experienceYears: 22, availability: 'On Shift Now', avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'hosp-004',
    name: 'Northside Community Clinic & Urgent Care',
    licenseNumber: 'LIC-NY-55291',
    type: 'Community Health Clinic',
    rating: 4.6,
    reviewsCount: 120,
    distanceKm: 8.2,
    address: '901 Northside Ave, North Sector',
    city: 'New York',
    latitude: 40.7831,
    longitude: -73.9712,
    emergencyHotline: '1-800-NORTHSIDE',
    phone: '+1 (555) 441-9200',
    email: 'info@northsideclinic.healthos.org',
    operatingHours: '08:00 AM - 10:00 PM',
    emergencyCapable: false,
    totalBeds: 45,
    availableBeds: 14,
    totalIcu: 0,
    availableIcu: 0,
    ventilatorsAvailable: 0,
    specializations: ['General Practice', 'Urgent Care', 'Family Medicine', 'Vaccinations', 'Dermatology'],
    departments: [
      { name: 'Outpatient Clinic', status: 'Walk-ins Welcome', waitTimeMin: 8 },
      { name: 'Diagnostic Imaging', status: 'Operational', waitTimeMin: 15 },
    ],
    doctors: [
      { id: 'doc-401', name: 'Dr. Maria Santos', title: 'Family Practitioner', specialty: 'General Practice', experienceYears: 9, availability: 'Available Today', avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' }
    ]
  }
];
