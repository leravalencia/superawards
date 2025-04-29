-- First, create users in auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'john@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"John Doe"}'),
  ('00000000-0000-0000-0000-000000000002', 'jane@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Jane Smith"}'),
  ('00000000-0000-0000-0000-000000000003', 'bob@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bob Johnson"}');

-- Update existing profiles instead of inserting
UPDATE profiles 
SET 
  email = CASE id
    WHEN '00000000-0000-0000-0000-000000000001' THEN 'john@example.com'
    WHEN '00000000-0000-0000-0000-000000000002' THEN 'jane@example.com'
    WHEN '00000000-0000-0000-0000-000000000003' THEN 'bob@example.com'
  END,
  full_name = CASE id
    WHEN '00000000-0000-0000-0000-000000000001' THEN 'John Doe'
    WHEN '00000000-0000-0000-0000-000000000002' THEN 'Jane Smith'
    WHEN '00000000-0000-0000-0000-000000000003' THEN 'Bob Johnson'
  END,
  subscription_status = CASE id
    WHEN '00000000-0000-0000-0000-000000000001' THEN 'active'
    WHEN '00000000-0000-0000-0000-000000000002' THEN 'active'
    WHEN '00000000-0000-0000-0000-000000000003' THEN 'active'
  END,
  subscription_plan = CASE id
    WHEN '00000000-0000-0000-0000-000000000001' THEN 'premium'
    WHEN '00000000-0000-0000-0000-000000000002' THEN 'business'
    WHEN '00000000-0000-0000-0000-000000000003' THEN 'free'
  END
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- Insert sample customers
INSERT INTO customers (user_id, stripe_customer_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'cus_premium123'),
  ('00000000-0000-0000-0000-000000000002', 'cus_business456'),
  ('00000000-0000-0000-0000-000000000003', 'cus_free789');

-- Insert sample awards and store their IDs
WITH inserted_awards AS (
  INSERT INTO awards (user_id, title, description, category, status, deadline)
  VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Best Innovation Award', 'Recognizing groundbreaking innovations in technology', 'Technology', 'active', '2024-12-31'),
    ('00000000-0000-0000-0000-000000000001', 'Excellence in Design', 'Celebrating outstanding design achievements', 'Design', 'draft', '2024-11-30'),
    ('00000000-0000-0000-0000-000000000002', 'Leadership Award', 'Honoring exceptional leadership in business', 'Business', 'active', '2024-10-31'),
    ('00000000-0000-0000-0000-000000000002', 'Community Impact', 'Recognizing positive community contributions', 'Social Impact', 'submitted', '2024-09-30'),
    ('00000000-0000-0000-0000-000000000003', 'Rising Star', 'Celebrating emerging talent', 'Talent', 'draft', '2024-08-31')
  RETURNING id
)
-- Insert sample award submissions using the award IDs
INSERT INTO award_submissions (award_id, user_id, status, submission_date)
SELECT 
  id as award_id,
  CASE 
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 0) THEN '00000000-0000-0000-0000-000000000001'::uuid
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 1) THEN '00000000-0000-0000-0000-000000000001'::uuid
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 2) THEN '00000000-0000-0000-0000-000000000002'::uuid
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 3) THEN '00000000-0000-0000-0000-000000000002'::uuid
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 4) THEN '00000000-0000-0000-0000-000000000003'::uuid
  END as user_id,
  CASE 
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 0) THEN 'submitted'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 1) THEN 'draft'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 2) THEN 'submitted'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 3) THEN 'reviewed'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 4) THEN 'draft'
  END as status,
  CASE 
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 0) THEN '2024-03-01'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 1) THEN '2024-03-02'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 2) THEN '2024-03-03'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 3) THEN '2024-03-04'
    WHEN id = (SELECT id FROM inserted_awards LIMIT 1 OFFSET 4) THEN '2024-03-05'
  END as submission_date
FROM inserted_awards;

-- Update subscription end dates
UPDATE profiles 
SET subscription_end_date = CASE 
  WHEN subscription_plan = 'premium' THEN '2024-12-31'
  WHEN subscription_plan = 'business' THEN '2024-12-31'
  ELSE NULL
END;

-- Update stripe subscription IDs
UPDATE profiles 
SET stripe_subscription_id = CASE 
  WHEN subscription_plan = 'premium' THEN 'sub_premium123'
  WHEN subscription_plan = 'business' THEN 'sub_business456'
  ELSE NULL
END; 