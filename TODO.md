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

- [ ] Create User type
- [ ] Create Profile type
- [ ] Create Role type
- [ ] Create API response types

## API Integration

- [ ] Create User CRUD operations
  - [ ] useGetUsers query hook
  - [ ] useCreateUser mutation hook
  - [ ] useUpdateUser mutation hook
  - [ ] useDeleteUser mutation hook
- [ ] Create Profile CRUD operations
  - [ ] useGetProfile query hook
  - [ ] useCreateProfile mutation hook
  - [ ] useUpdateProfile mutation hook
  - [ ] useDeleteProfile mutation hook
- [ ] Create Role CRUD operations
  - [ ] useGetRoles query hook
  - [ ] useCreateRole mutation hook
  - [ ] useUpdateRole mutation hook
  - [ ] useDeleteRole mutation hook
