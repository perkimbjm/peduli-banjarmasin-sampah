-- Create pelaporan table
CREATE TABLE pelaporan (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  jenis_laporan TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  lokasi JSONB NOT NULL,
  foto_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu',
  pelapor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT status_values CHECK (status IN ('menunggu', 'proses', 'selesai', 'ditolak'))
);

-- Create pengaduan table
CREATE TABLE pengaduan (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  pelaporan_id UUID NOT NULL REFERENCES pelaporan(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'menunggu',
  jenis TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  CONSTRAINT status_values CHECK (status IN ('menunggu', 'proses', 'selesai', 'ditolak'))
);

-- Create RLS policies
ALTER TABLE pelaporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaduan ENABLE ROW LEVEL SECURITY;

-- Policies for pelaporan
CREATE POLICY "Pelaporan dapat dilihat oleh semua user yang terautentikasi"
  ON pelaporan FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Pelaporan hanya dapat dibuat oleh user yang terautentikasi"
  ON pelaporan FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = pelapor_id);

CREATE POLICY "Pelaporan hanya dapat diupdate oleh admin atau pelapor"
  ON pelaporan FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = pelapor_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Policies for pengaduan
CREATE POLICY "Pengaduan dapat dilihat oleh semua user yang terautentikasi"
  ON pengaduan FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Pengaduan hanya dapat dibuat oleh admin"
  ON pengaduan FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

CREATE POLICY "Pengaduan hanya dapat diupdate oleh admin"
  ON pengaduan FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX pelaporan_pelapor_id_idx ON pelaporan(pelapor_id);
CREATE INDEX pengaduan_pelaporan_id_idx ON pengaduan(pelaporan_id);
CREATE INDEX pelaporan_status_idx ON pelaporan(status);
CREATE INDEX pengaduan_status_idx ON pengaduan(status); 