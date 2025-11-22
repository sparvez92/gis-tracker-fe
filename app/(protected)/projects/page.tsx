'use client';
import { DataTable } from '@/components/custom/dataTable';
import FilterHeader from '@/components/custom/Filters';
import Title from '@/components/custom/Title';
import { COLUMNS, DUMMY_DATA } from '@/constants';
import { useProjectsQuery } from '@/graphql/queries/project.generated';

const AddProject = () => {
  return (
    <div className="px-8 py-14">
      <Title>Projects</Title>
      <div className="mt-6 w-full">
        <FilterHeader />
      </div>

      <div className="w-full max-w-[100vw] overflow-hidden">
        <DataTable columns={COLUMNS} showPagination />
      </div>
    </div>
  );
};

export default AddProject;
