-- Hero Slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  image_url TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT '',
  heading_line1 TEXT NOT NULL DEFAULT '',
  heading_line2 TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT 'Shop Now',
  cta_link TEXT NOT NULL DEFAULT '/shop',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hero slides"
  ON hero_slides FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage hero slides"
  ON hero_slides FOR ALL
  USING (public.is_admin());

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT 'Shop Now',
  cta_link TEXT NOT NULL DEFAULT '/shop',
  icon_name TEXT NOT NULL DEFAULT 'HiOutlineTag',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ads"
  ON advertisements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage ads"
  ON advertisements FOR ALL
  USING (public.is_admin());
