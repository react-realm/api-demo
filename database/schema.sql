-- React Realm API Demo
-- Relational schema

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    summary TEXT,
    published_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lesson_order INTEGER NOT NULL,
    duration_minutes INTEGER
);

-- Helpful index for lesson lookups by course
CREATE INDEX idx_lessons_course_id ON lessons(course_id);

-- Prevent duplicate lesson order within a single course
ALTER TABLE lessons
ADD CONSTRAINT lessons_course_order_unique UNIQUE (course_id, lesson_order);
