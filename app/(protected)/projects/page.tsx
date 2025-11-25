'use client';
import { DataTable } from '@/components/custom/dataTable';
import Title from '@/components/custom/Title';
import { COLUMNS } from '@/constants';

const AddProject = () => {
  return (
    <div className="px-8 py-14">
      <Title>Projects</Title>

      <div className="w-full max-w-[100vw] overflow-hidden">
        <DataTable columns={COLUMNS} showPagination showFilters />
      </div>
    </div>
  );
};

export default AddProject;
