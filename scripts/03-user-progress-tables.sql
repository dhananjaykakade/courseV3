-- Create user enrollments table
CREATE TABLE IF NOT EXISTS user_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create user milestone progress table
CREATE TABLE IF NOT EXISTS user_milestone_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, milestone_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user_id ON user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_course_id ON user_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_user_milestone_progress_user_id ON user_milestone_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_milestone_progress_course_id ON user_milestone_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_milestone_progress_milestone_id ON user_milestone_progress(milestone_id);

-- Enable Row Level Security
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestone_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_enrollments
CREATE POLICY "Users can view their own enrollments" ON user_enrollments
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own enrollments" ON user_enrollments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own enrollments" ON user_enrollments
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all enrollments" ON user_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create RLS policies for user_milestone_progress
CREATE POLICY "Users can view their own progress" ON user_milestone_progress
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own progress" ON user_milestone_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own progress" ON user_milestone_progress
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all progress" ON user_milestone_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_enrollments_updated_at BEFORE UPDATE
    ON user_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
