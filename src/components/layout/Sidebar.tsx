import { NavLink, useLocation } from 'react-router-dom';
import { X, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationItems } from '@/config/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

export function Sidebar({ isOpen, onClose, isDesktop }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border",
        "flex flex-col",
        "transition-transform duration-300 ease-in-out",
        isDesktop ? "translate-x-0" : "-translate-x-full",
        !isDesktop && isOpen && "translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">HR Intelligent</span>
            <span className="text-[10px] text-muted-foreground leading-tight">BPMS</span>
          </div>
        </div>
        {!isDesktop && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => !isDesktop && onClose()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          v1.0.0 · HR Intelligent BPMS
        </p>
      </div>
    </aside>
  );
}
