# Project Roadmap

## Database Setup

- [x] Create Supabase table for profiles
  - Fields: id, role_id, full_name, avatar_url, created_at, updated_at
- [x] Create Supabase table for roles
  - Fields: id, name, created_at, updated_at
    - name: admin, supervisor, user
- [x] Set up RLS (Row Level Security) policies
  - [x] Only allow users to modify their own data

## Type Definitions

- [x] Create Profile type
- [x] Create Role type
- [x] Create API response types

## API Integration

- [x] Create Profile CRUD operations
  - [x] useGetProfile query hook
  - [x] useGetAvatar query hook
  - [x] useUploadAvatar mutation hook
  - [x] useUpdateProfile mutation hook
- [x] Create Role CRUD operations
  - [x] useGetRoles query hook
- [x] Create Login mutation hook
