-- React Realm API Demo
-- Seed data

INSERT INTO courses (slug, title, level, summary) VALUES
('react-fundamentals', 'React Fundamentals', 'beginner', 'Introduction to React concepts'),
('state-and-effects', 'State and Effects', 'intermediate', 'Understanding hooks and state management'),
('api-integration', 'Fetching API Data', 'intermediate', 'How React interacts with APIs');

INSERT INTO lessons (course_id, title, lesson_order, duration_minutes) VALUES
(1, 'What is React?', 1, 10),
(1, 'Components and Props', 2, 15),
(2, 'useState Deep Dive', 1, 20),
(2, 'useEffect Explained', 2, 25),
(3, 'Fetching Data with fetch()', 1, 15),
(3, 'Handling Loading and Errors', 2, 20);
