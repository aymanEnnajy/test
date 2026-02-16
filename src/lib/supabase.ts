import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// Generic CRUD helpers
export const fetchAll = async <T>(
  table: string,
  options?: {
    select?: string;
    filters?: Record<string, unknown>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) => {
  let query = supabase.from(table).select(options?.select || '*');

  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value as string | number | boolean);
    });
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data: data as T[] | null, error };
};

export const fetchOne = async <T>(
  table: string,
  id: string,
  select: string = '*'
) => {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq('id', id)
    .single();
  return { data: data as T | null, error };
};

export const insert = async <T>(table: string, data: Partial<T>) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data as never)
    .select()
    .single();
  return { data: result as T | null, error };
};

export const update = async <T>(
  table: string,
  id: string,
  data: Partial<T>
) => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data as never)
    .eq('id', id)
    .select()
    .single();
  return { data: result as T | null, error };
};

export const remove = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  return { error };
};
