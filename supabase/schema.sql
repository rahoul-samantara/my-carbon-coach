-- Create tables for Carbon Compass

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    city TEXT DEFAULT 'Brooklyn, NY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Carbon Profiles (onboarding answers + scores)
CREATE TABLE IF NOT EXISTS public.carbon_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    commute_mode TEXT,
    weekly_distance NUMERIC,
    diet TEXT,
    household_size INTEGER,
    shopping_frequency TEXT,
    wfh_days INTEGER,
    transportation_score NUMERIC DEFAULT 0,
    food_score NUMERIC DEFAULT 0,
    energy_score NUMERIC DEFAULT 0,
    shopping_score NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_carbon_profile UNIQUE (user_id)
);

ALTER TABLE public.carbon_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own carbon profile" ON public.carbon_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own carbon profile" ON public.carbon_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own carbon profile" ON public.carbon_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own carbon profile" ON public.carbon_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Carbon Budgets
CREATE TABLE IF NOT EXISTS public.carbon_budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    monthly_budget NUMERIC DEFAULT 580 NOT NULL,
    current_usage NUMERIC DEFAULT 0 NOT NULL,
    remaining_budget NUMERIC DEFAULT 580 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_carbon_budget UNIQUE (user_id)
);

ALTER TABLE public.carbon_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own carbon budget" ON public.carbon_budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own carbon budget" ON public.carbon_budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own carbon budget" ON public.carbon_budgets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own carbon budget" ON public.carbon_budgets
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    category TEXT NOT NULL, -- 'transport', 'food', 'energy', 'shopping'
    kg NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities" ON public.activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON public.activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" ON public.activities
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.activities
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Goals
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    progress INTEGER DEFAULT 0 NOT NULL,
    reward TEXT NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'Eco User'),
        new.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
