-- Create apartments table
CREATE TABLE apartments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  room_type TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create institutions table
CREATE TABLE institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL DEFAULT 'university',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, apartment_id)
);

-- Create RLS policies
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Apartments policies
CREATE POLICY "Apartments are viewable by everyone" ON apartments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own apartments" ON apartments
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own apartments" ON apartments
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own apartments" ON apartments
  FOR DELETE USING (auth.uid() = created_by);

-- Institutions policies
CREATE POLICY "Institutions are viewable by everyone" ON institutions
  FOR SELECT USING (true);

-- User favorites policies
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_apartments_location ON apartments(lat, lng);
CREATE INDEX idx_apartments_price ON apartments(price);
CREATE INDEX idx_apartments_room_type ON apartments(room_type);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_apartment_id ON user_favorites(apartment_id);

-- Insert sample institutions
INSERT INTO institutions (name, lat, lng, type) VALUES
  ('Technion - Israel Institute of Technology', 32.776667, 35.023333, 'university'),
  ('University of Haifa', 32.794167, 34.989167, 'university'); 