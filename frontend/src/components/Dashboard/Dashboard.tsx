import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  UserRound, Users, Scale, Shield, ClipboardList,
  Trophy, MapPin, Award, BarChart2, PieChart, Menu, ListOrdered,
} from 'lucide-react';

import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';
import { type DashboardNavItem } from '@/components/Sidebar/DashboardSidebarRow';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { Sheet, SheetContent } from '@/components/UI/Sheet';
import Button from '@/components/UI/Button';
import { APP_ROUTES } from '@/constants/Routes';

import styles from './Dashboard.module.css';

const navItems: DashboardNavItem[] = [
  { label: 'Player', listPath: APP_ROUTES.dashboard.player.list, icon: UserRound },
  { label: 'Staff', listPath: APP_ROUTES.dashboard.staff.list, icon: Users },
  { label: 'Referee', listPath: APP_ROUTES.dashboard.referee.list, icon: Scale },
  { label: 'Team', listPath: APP_ROUTES.dashboard.team.list, icon: Shield },
  { label: 'Coach', listPath: APP_ROUTES.dashboard.coach.list, icon: ClipboardList },
  { label: 'Game', listPath: APP_ROUTES.dashboard.game.list, icon: Trophy },
  { label: 'Venue', listPath: APP_ROUTES.dashboard.venue.list, icon: MapPin },
  { label: 'Competition', listPath: APP_ROUTES.dashboard.competition.list, icon: Award },
];

const statsItems: DashboardNavItem[] = [
  { label: 'Player Stats', listPath: APP_ROUTES.dashboard.playerStats.list, icon: BarChart2 },
  { label: 'Team Stats', listPath: APP_ROUTES.dashboard.teamStats.list, icon: PieChart },
  { label: 'League Table', listPath: APP_ROUTES.dashboard.leagueTable.list, icon: ListOrdered },
];

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Desktop sidebar */}
      <div className={styles.desktopSidebar}>
        <DashboardSidebar navItems={navItems} statsItems={statsItems} />
      </div>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-court border-r border-white/15">
          <DashboardSidebar
            navItems={navItems}
            statsItems={statsItems}
            isEmbedded
            onLinkClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className={styles.content}>
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 md:hidden mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="text-court hover:bg-court/10"
          >
            <Menu size={20} />
          </Button>
          <span className="font-display font-bold text-court text-lg">Dashboard</span>
        </div>

        <DynamicContentWrapper>
          <Outlet />
        </DynamicContentWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
