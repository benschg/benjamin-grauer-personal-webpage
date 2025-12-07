'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/contexts';
import ReferencesManager from '@/components/cv/components/admin/ReferencesManager';
import ShareLinksManager from '@/components/admin/ShareLinksManager';
import ContactSettingsManager from '@/components/admin/ContactSettingsManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ py: 3 }}
  >
    {value === index && children}
  </Box>
);

const TAB_KEYS = ['share-links', 'references', 'contact'] as const;
type TabKey = typeof TAB_KEYS[number];

const AdminDashboardContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user && adminEmail && user.email === adminEmail;

  // Get tab from URL, default to 0 (share-links)
  const tabParam = searchParams.get('tab') as TabKey | null;
  const tabValue = tabParam ? TAB_KEYS.indexOf(tabParam) : 0;
  const currentTabIndex = tabValue >= 0 ? tabValue : 0;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const newTab = TAB_KEYS[newValue];
    router.push(`/admin?tab=${newTab}`, { scroll: false });
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#1a1d20',
        }}
      >
        <CircularProgress sx={{ color: '#89665d' }} />
      </Box>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#1a1d20',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Orbitron',
            color: 'white',
            mb: 3,
            letterSpacing: '0.05em',
          }}
        >
          Admin Dashboard
        </Typography>

        <Paper
          sx={{
            bgcolor: '#343a40',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={currentTabIndex}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Quicksand',
                '&.Mui-selected': {
                  color: '#89665d',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#89665d',
              },
            }}
          >
            <Tab label="Share Links" />
            <Tab label="References" />
            <Tab label="Contact Info" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <TabPanel value={currentTabIndex} index={0}>
              <ShareLinksManager />
            </TabPanel>

            <TabPanel value={currentTabIndex} index={1}>
              <ReferencesManager />
            </TabPanel>

            <TabPanel value={currentTabIndex} index={2}>
              <ContactSettingsManager />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

const LoadingFallback = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#1a1d20',
    }}
  >
    <CircularProgress sx={{ color: '#89665d' }} />
  </Box>
);

const AdminDashboard = () => (
  <Suspense fallback={<LoadingFallback />}>
    <AdminDashboardContent />
  </Suspense>
);

export default AdminDashboard;
