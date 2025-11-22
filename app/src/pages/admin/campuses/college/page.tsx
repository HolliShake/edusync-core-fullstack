import TitledPage from '@/components/pages/titled.page';
import CollegeContextProvider from '@/context/college.context';
import { decryptId } from '@/lib/hash';
import type React from 'react';
import { useParams } from 'react-router';
import AdminCollegeDetailContent from './content';

export default function AdminCollege(): React.ReactNode {
  const { collegeId } = useParams();
  return (
    <TitledPage
      title="College Details"
      description="View and manage college information, buildings, and settings"
      breadcrumb={[
        { label: 'Admin', href: '/admin' },
        { label: 'Campuses', href: '/admin/campuses' },
        { label: 'College Details', href: '#' },
      ]}
    >
      <CollegeContextProvider collegeId={decryptId(collegeId as string)}>
        <AdminCollegeDetailContent />
      </CollegeContextProvider>
    </TitledPage>
  );
}
