# Project Roadmap

## Database Setup

- [ ] Create Supabase table for users
  - Fields: id, identity_id, role_id, email, created_at
- [ ] Create Supabase table for profiles
  - Fields: id, user_id, name, avatar_url, created_at
    - user_id references users.id
- [ ] Create Supabase table for roles
  - Fields: id, name, created_at
    - name: admin, supervisor, user
- [ ] Set up RLS (Row Level Security) policies
  - [ ] Only allow users to modify their own data

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
