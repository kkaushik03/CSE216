const UNIFLOW_KEYS = {
  registrations: 'uniflow.registrations',
  profile: 'uniflow.profile'
};

const UNIFLOW_MEMORY = {};

function readStore(key, fallback) {
  if (Object.prototype.hasOwnProperty.call(UNIFLOW_MEMORY, key)) {
    return UNIFLOW_MEMORY[key];
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      UNIFLOW_MEMORY[key] = parsed;
      return parsed;
    }
  } catch (error) {
    return fallback;
  }
  return fallback;
}

function writeStore(key, value) {
  UNIFLOW_MEMORY[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function getRegistrations() {
  const list = readStore(UNIFLOW_KEYS.registrations, []);
  return Array.isArray(list) ? list : [];
}

function saveRegistrations(list) {
  return writeStore(UNIFLOW_KEYS.registrations, list);
}

function getCourseById(id) {
  return COURSES.find(function (course) {
    return course.id === id;
  });
}

function createRegistrationId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return 'reg-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function addRegistration(details) {
  const course = getCourseById(details.courseId);
  if (!course) {
    return { ok: false, reason: 'That course could not be found.' };
  }

  const registrations = getRegistrations();
  const duplicate = registrations.some(function (registration) {
    return registration.courseId === course.id && registration.semester === details.semester;
  });

  if (duplicate) {
    return { ok: false, reason: "You're already registered for " + course.code + ' in ' + details.semester + '.' };
  }

  const registration = {
    id: createRegistrationId(),
    courseId: course.id,
    semester: details.semester,
    studentName: details.studentName || '',
    studentId: details.studentId || '',
    email: details.email || '',
    createdAt: new Date().toISOString()
  };

  registrations.push(registration);
  saveRegistrations(registrations);

  return { ok: true, registration: registration, course: course };
}

function removeRegistration(id) {
  const registrations = getRegistrations();
  const next = registrations.filter(function (registration) {
    return registration.id !== id;
  });
  saveRegistrations(next);
  return next.length !== registrations.length;
}

function clearRegistrations() {
  saveRegistrations([]);
}

function getProfile() {
  const profile = readStore(UNIFLOW_KEYS.profile, null);
  return profile && typeof profile === 'object' ? profile : null;
}

function saveProfile(profile) {
  return writeStore(UNIFLOW_KEYS.profile, profile);
}

function getRegistrationSummary(registrations) {
  const courses = [];
  registrations.forEach(function (registration) {
    const course = getCourseById(registration.courseId);
    if (course) {
      courses.push(course);
    }
  });

  const credits = courses.reduce(function (total, course) {
    return total + course.credits;
  }, 0);

  const semesters = Array.from(
    new Set(
      registrations.map(function (registration) {
        return registration.semester;
      })
    )
  );

  return {
    count: registrations.length,
    credits: credits,
    semesters: semesters
  };
}
