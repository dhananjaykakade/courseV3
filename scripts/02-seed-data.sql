-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password, name, role, is_email_verified, contact_number) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@learnhub.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'System Administrator', 'admin', true, '+91 9999999999');

-- Insert sample courses
INSERT INTO courses (id, title, description, is_free, price, rating, students, instructor, duration, image_url) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript to build your first website. This comprehensive course covers everything from basic concepts to advanced techniques used in modern web development.', true, 0, 4.8, 1250, 'John Smith', '8 hours', '/placeholder.svg?height=200&width=300'),
('550e8400-e29b-41d4-a716-446655440002', 'Basic Photography', 'Master the fundamentals of photography with your smartphone or camera. Learn composition, lighting, and editing techniques.', true, 0, 4.6, 890, 'Sarah Johnson', '6 hours', '/placeholder.svg?height=200&width=300'),
('550e8400-e29b-41d4-a716-446655440003', 'Advanced React Development', 'Deep dive into React hooks, context, and advanced patterns for professional development. This comprehensive course covers everything from basic concepts to advanced techniques used in modern React applications.', false, 2999, 4.9, 450, 'Mike Chen', '12 hours', '/placeholder.svg?height=200&width=300'),
('550e8400-e29b-41d4-a716-446655440004', 'Full Stack JavaScript', 'Complete course covering Node.js, Express, MongoDB, and React for full stack development. Build real-world applications from scratch.', false, 4999, 4.8, 320, 'Emily Davis', '16 hours', '/placeholder.svg?height=200&width=300'),
('550e8400-e29b-41d4-a716-446655440005', 'Digital Marketing Basics', 'Learn the essentials of digital marketing and social media strategy. Understand SEO, content marketing, and analytics.', true, 0, 4.7, 650, 'Alex Rodriguez', '10 hours', '/placeholder.svg?height=200&width=300'),
('550e8400-e29b-41d4-a716-446655440006', 'Advanced Python & AI', 'Master Python programming and dive into machine learning and artificial intelligence. Build intelligent applications.', false, 3999, 4.9, 280, 'Dr. Lisa Wang', '20 hours', '/placeholder.svg?height=200&width=300');

-- Insert milestones for Advanced React Development course
INSERT INTO milestones (id, course_id, title, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Introduction to Advanced React', 0),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'React Hooks Deep Dive', 1),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Context API and State Management', 2),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'Performance Optimization', 3);

-- Insert content for Introduction to Advanced React milestone
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'text', null, 'Welcome to Advanced React Development! In this comprehensive course, you''ll learn the most important concepts and patterns used in modern React applications.', 0),
('550e8400-e29b-41d4-a716-446655440010', 'text', null, 'We''ll cover hooks, context, performance optimization, and advanced patterns that will make you a more effective React developer.', 1),
('550e8400-e29b-41d4-a716-446655440010', 'pdf', 'Course Syllabus', '/placeholder.pdf', 2);

-- Insert content for React Hooks Deep Dive milestone
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'video', 'Understanding useState and useEffect - Demo Video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 0),
('550e8400-e29b-41d4-a716-446655440011', 'text', null, 'React Hooks revolutionized how we write React components. Let''s explore the most commonly used hooks and their advanced patterns.', 1),
('550e8400-e29b-41d4-a716-446655440011', 'pdf', 'Hooks Reference Guide', '/placeholder.pdf', 2);

-- Insert content for Context API milestone
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440012', 'text', null, 'Learn how to effectively manage global state using React Context API and when to choose it over other state management solutions.', 0),
('550e8400-e29b-41d4-a716-446655440012', 'video', 'Building a Theme Provider with Context', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1);

-- Insert content for Performance Optimization milestone
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440013', 'text', null, 'Discover techniques to optimize your React applications for better performance and user experience.', 0),
('550e8400-e29b-41d4-a716-446655440013', 'video', 'React.memo and useMemo', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1),
('550e8400-e29b-41d4-a716-446655440013', 'pdf', 'Performance Checklist', '/placeholder.pdf', 2);

-- Insert milestones for Introduction to Web Development course
INSERT INTO milestones (id, course_id, title, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'HTML Fundamentals', 0),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'CSS Styling', 1),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 'JavaScript Basics', 2),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440001', 'Building Your First Website', 3);

-- Insert content for HTML Fundamentals
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440020', 'text', null, 'HTML (HyperText Markup Language) is the foundation of all web pages. Learn the essential tags and structure.', 0),
('550e8400-e29b-41d4-a716-446655440020', 'video', 'HTML Structure and Tags', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1);

-- Insert content for CSS Styling
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440021', 'text', null, 'CSS (Cascading Style Sheets) controls the visual presentation of your web pages. Master selectors, properties, and layouts.', 0),
('550e8400-e29b-41d4-a716-446655440021', 'video', 'CSS Fundamentals and Flexbox', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1);

-- Insert content for JavaScript Basics
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440022', 'text', null, 'JavaScript brings interactivity to your web pages. Learn variables, functions, and DOM manipulation.', 0),
('550e8400-e29b-41d4-a716-446655440022', 'video', 'JavaScript Variables and Functions', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1);

-- Insert content for Building Your First Website
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440023', 'text', null, 'Put it all together! Build a complete website using HTML, CSS, and JavaScript.', 0),
('550e8400-e29b-41d4-a716-446655440023', 'video', 'Building a Complete Website', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1),
('550e8400-e29b-41d4-a716-446655440023', 'pdf', 'Project Files and Resources', '/placeholder.pdf', 2);

-- Insert milestones for Full Stack JavaScript course
INSERT INTO milestones (id, course_id, title, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440004', 'Node.js Fundamentals', 0),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440004', 'Express.js Framework', 1),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440004', 'MongoDB Database', 2),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440004', 'React Frontend', 3),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440004', 'Full Stack Integration', 4),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440004', 'Deployment and Production', 5);

-- Insert sample content for Full Stack course
INSERT INTO milestone_content (milestone_id, type, title, content, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440030', 'text', null, 'Node.js allows you to run JavaScript on the server. Learn the fundamentals of server-side JavaScript development.', 0),
('550e8400-e29b-41d4-a716-446655440030', 'video', 'Node.js Introduction', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1);
