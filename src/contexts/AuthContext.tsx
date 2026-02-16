import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, getProfile } from '@/lib/supabase';
import type { User, UserRole, LoginCredentials, RegisterCredentials, EmployeeCreateCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ error: Error | null }>;
  register: (credentials: RegisterCredentials) => Promise<{ error: Error | null }>;
  addEmployee: (credentials: EmployeeCreateCredentials) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for development (when Supabase is not configured)
const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@hrbpms.com': {
    id: '1',
    email: 'admin@hrbpms.com',
    password: 'admin123',
    first_name: 'System',
    last_name: 'Administrator',
    role: 'ADMIN',
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    organization_id: 'org-1',
    department_id: null,
    position: 'System Administrator',
    phone: null,
  },
  'hr@hrbpms.com': {
    id: '2',
    email: 'hr@hrbpms.com',
    password: 'hr123',
    first_name: 'Sarah',
    last_name: 'Mitchell',
    role: 'HR',
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    organization_id: 'org-1',
    department_id: 'dept-1',
    position: 'HR Manager',
    phone: null,
  },
  'manager@hrbpms.com': {
    id: '3',
    email: 'manager@hrbpms.com',
    password: 'manager123',
    first_name: 'James',
    last_name: 'Rodriguez',
    role: 'TEAM_MANAGER',
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    organization_id: 'org-1',
    department_id: 'dept-2',
    position: 'Engineering Manager',
    phone: null,
  },
  'employee@hrbpms.com': {
    id: '4',
    email: 'employee@hrbpms.com',
    password: 'employee123',
    first_name: 'Emily',
    last_name: 'Chen',
    role: 'EMPLOYEE',
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    organization_id: 'org-1',
    department_id: 'dept-2',
    position: 'Software Developer',
    phone: null,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useDemoMode, setUseDemoMode] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Check if Supabase is configured correctly
    const isPlaceholderKey = supabaseKey?.startsWith('sb_publishable_');

    if (!supabaseUrl || !supabaseKey || isPlaceholderKey) {
      console.log('Supabase not configured or placeholder detected, using demo mode');
      setUseDemoMode(true);
      // Check for stored demo user
      const storedUser = localStorage.getItem('hrbpms_demo_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
      return;
    }

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking auth session...');
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase session error:', error);
          setIsLoading(false);
          return;
        }

        const session = data?.session;
        if (session?.user) {
          console.log('Session found, fetching profile...');
          const { data: profile, error: profileError } = await getProfile(session.user.id);
          if (profileError) {
            console.error('Profile fetch error:', profileError);
          } else if (profile) {
            setUser(profile as User);
          }
        } else {
          console.log('No active session');
        }
      } catch (error) {
        console.error('Session check caught exception:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Safety timeout to ensure loading screen eventually disappears
    const safetyTimeout = setTimeout(() => {
      setIsLoading(prev => {
        if (prev) {
          console.warn('Auth initialization timed out, using fallback states');
          return false;
        }
        return prev;
      });
    }, 2000); // Faster 2s timeout

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          if (session?.user) {
            const { data: profile } = await getProfile(session.user.id);
            if (profile) {
              setUser(profile as User);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ error: Error | null }> => {
    setIsLoading(true);

    try {
      if (useDemoMode) {
        // Demo mode login
        await new Promise(resolve => setTimeout(resolve, 500));

        const demoUser = DEMO_USERS[credentials.email];

        if (!demoUser || demoUser.password !== credentials.password) {
          setIsLoading(false);
          return { error: new Error('Invalid email or password') };
        }

        const { password, ...userWithoutPassword } = demoUser;
        setUser(userWithoutPassword);
        localStorage.setItem('hrbpms_demo_user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return { error: null };
      }

      // Supabase login
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      setIsLoading(false);
      return { error };
    } catch (error) {
      setIsLoading(false);
      return { error: error as Error };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (useDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: credentials.email,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          role: credentials.role,
          avatar_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          organization_id: 'demo-org-id',
          department_id: null,
          position: credentials.role === 'ADMIN' ? 'Administrator' : 'Employee',
          phone: null,
        };
        setUser(newUser);
        localStorage.setItem('hrbpms_demo_user', JSON.stringify(newUser));
        setIsLoading(false);
        return { error: null };
      }

      // 1. Create Organization (with full details)
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: credentials.organization_name,
          email: credentials.organization_email,
          phone: credentials.organization_phone,
          address: credentials.organization_address
        } as any)
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Sign Up User
      const { error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            phone: credentials.phone,
            position: credentials.position,
            role: credentials.role,
            organization_id: (org as any).id,
          }
        }
      });

      if (authError) throw authError;

      setIsLoading(false);
      return { error: null };
    } catch (error) {
      setIsLoading(false);
      return { error: error as Error };
    }
  };

  const addEmployee = async (credentials: EmployeeCreateCredentials): Promise<{ error: Error | null }> => {
    try {
      if (useDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { error: null };
      }

      // Only Admins can do this. 
      // Supabase Auth usually requires service role to create users with passwords,
      // or using a specific invite flow. For this implementation, we'll assume 
      // there's a trigger or edge function, or we use standard signUp if allowed.
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            role: credentials.role,
            organization_id: user?.organization_id,
          }
        }
      });

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    if (useDemoMode) {
      setUser(null);
      localStorage.removeItem('hrbpms_demo_user');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    if (useDemoMode || !user) return;

    const { data: profile } = await getProfile(user.id);
    if (profile) {
      setUser(profile as User);
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        addEmployee,
        logout,
        hasRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
